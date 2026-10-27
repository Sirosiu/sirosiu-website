import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface Ripple {
  x: number
  z: number
  startTime: number
  intensity: number
}

interface OceanSandboxProps {
  onBack?: () => void
}

export default function OceanSandbox({ onBack }: OceanSandboxProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [viewMode, setViewMode] = useState<'ocean' | 'ribbon' | 'hybrid'>('hybrid')
  const [intensitySetting, setIntensitySetting] = useState<'subtle' | 'medium' | 'heavy'>('medium')
  const [rippleCount, setRippleCount] = useState<number>(0)

  const viewModeRef = useRef(viewMode)
  viewModeRef.current = viewMode

  const intensityRef = useRef(intensitySetting)
  intensityRef.current = intensitySetting

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      })
    } catch {
      return
    }

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0c10)

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.set(2.2, 1.8, 2.4)
    camera.lookAt(0, -0.1, 0)

    // Densely subdivided plane geometry for detailed wave and ripple displacement
    const planeSize = 4.2
    const segments = 256
    const geometry = new THREE.PlaneGeometry(planeSize, planeSize, segments, segments)
    geometry.rotateX(-Math.PI / 2)

    // Store up to 8 concurrent ripples: vec4(x, z, startTime, intensity)
    const MAX_RIPPLES = 8
    const rippleData = new Float32Array(MAX_RIPPLES * 4) // flat array for shader uniform
    const ripplesRef: Ripple[] = []

    const material = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      wireframe: false,
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uPointerActive: { value: 0.0 },
        uRipples: { value: rippleData },
        uViewMode: { value: 2 }, // 0: ocean, 1: ribbon grid, 2: hybrid
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uPointer;
        uniform float uPointerActive;
        uniform vec4 uRipples[${MAX_RIPPLES}];
        varying float vHeight;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying float vRippleIntensity;

        float hash(vec3 p) {
          p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x),
                         mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
                     mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
                         mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
        }

        // Raging Sea multi-octave noise elevation
        float oceanElevation(vec3 p) {
          float height = sin(p.x * 2.2 + uTime * 1.1) * sin(p.z * 1.8 + uTime * 0.9) * 0.12;
          for (int i = 1; i <= 3; i++) {
            float octave = float(i);
            height -= abs(noise(vec3((p.xz + 1.5) * 1.8 * octave, uTime * 0.28)) * 0.14 / octave);
          }
          return height;
        }

        void main() {
          vUv = uv;
          vec3 p = position;

          // 1. Calculate primary ocean swell
          float baseH = oceanElevation(p);

          // 2. Continuous pointer fluid perturbation (from Flowing Ribbons influence)
          float pointerDist = distance(p.xz, uPointer);
          float pointerInfluence = max(0.0, 1.0 - pointerDist / 0.85);
          float pointerWave = pointerInfluence * sin(uTime * 4.5 + pointerDist * 12.0) * (0.04 + uPointerActive * 0.05);

          // 3. Dynamic Click Ripples (Flowing Ribbons wave disturbance physics)
          float totalRipple = 0.0;
          float rippleHighlight = 0.0;

          for (int i = 0; i < ${MAX_RIPPLES}; i++) {
            vec4 rip = uRipples[i];
            float intensity = rip.w;
            if (intensity > 0.005) {
              vec2 center = rip.xy;
              float startTime = rip.z;
              float age = uTime - startTime;

              if (age > 0.0 && age < 3.2) {
                float dist = distance(p.xz, center);
                float speed = 1.35; // ripple propagation speed
                float waveRadius = age * speed;
                float waveWidth = 0.42;
                float diff = abs(dist - waveRadius);

                if (diff < waveWidth) {
                  float proximity = 1.0 - diff / waveWidth;
                  float decay = exp(-age * 0.85) * intensity;
                  float wave = sin((dist - waveRadius) * 20.0) * proximity * decay;
                  totalRipple += wave * 0.22;
                  rippleHighlight += abs(wave) * 2.4 * decay;
                }
              }
            }
          }

          p.y += baseH + pointerWave + totalRipple;
          vHeight = p.y;
          vRippleIntensity = clamp(rippleHighlight, 0.0, 1.0);

          // Simple analytical normal approximation for specular lighting
          vec3 n = normalize(vec3(-totalRipple * 4.0, 1.0, -baseH * 3.0));
          vNormal = normalMatrix * n;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform int uViewMode; // 0: ocean, 1: ribbon grid, 2: hybrid
        varying float vHeight;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying float vRippleIntensity;

        void main() {
          // Color Palette: Deep oceanic blues and luminous electric ripples
          vec3 deep = vec3(0.02, 0.05, 0.09);
          vec3 mid = vec3(0.08, 0.28, 0.38);
          vec3 crest = vec3(0.18, 0.72, 0.82);
          vec3 rippleGlow = vec3(0.0, 0.95, 1.0); // Electric cyan-blue for interactive ripples
          vec3 gridLineColor = vec3(0.0, 0.85, 1.0);

          float trough = clamp(smoothstep(-0.25, 0.15, vHeight), 0.0, 1.0);
          vec3 oceanColor = mix(deep, mid, trough);
          oceanColor = mix(oceanColor, crest, smoothstep(0.04, 0.22, vHeight) * 0.7);

          // Add interactive ripple luminance
          oceanColor += rippleGlow * vRippleIntensity * 0.85;

          // Compute flowing ribbon grid lines (using UV coordinates)
          float gridDensity = 64.0;
          vec2 grid = abs(fract(vUv * gridDensity - 0.5) - 0.5) / fwidth(vUv * gridDensity);
          float line = 1.0 - min(min(grid.x, grid.y), 1.0);

          // Specular glint
          float specular = pow(max(0.0, dot(vNormal, normalize(vec3(0.5, 1.0, 0.5)))), 16.0);
          oceanColor += vec3(specular * 0.4);

          if (uViewMode == 0) {
            // Mode 0: Shaded Ocean with glowing ripples
            gl_FragColor = vec4(oceanColor, 0.95);
          } else if (uViewMode == 1) {
            // Mode 1: Pure Flowing Ribbon Grid (contour topography lines)
            vec3 ribbonCol = mix(vec3(0.02, 0.06, 0.12), gridLineColor, line * 0.9);
            ribbonCol += rippleGlow * vRippleIntensity * 0.9;
            gl_FragColor = vec4(ribbonCol, line * 0.85 + vRippleIntensity * 0.6 + 0.15);
          } else {
            // Mode 2: Hybrid (Shaded ocean with glowing wireframe ribbons overlaid)
            vec3 hybridCol = mix(oceanColor, gridLineColor, line * 0.38);
            hybridCol += rippleGlow * vRippleIntensity * 0.9;
            gl_FragColor = vec4(hybridCol, 0.97);
          }
        }
      `,
    })

    const waveMesh = new THREE.Mesh(geometry, material)
    scene.add(waveMesh)

    // Raycaster for precise 3D surface clicks
    const raycaster = new THREE.Raycaster()
    const mouseNorm = new THREE.Vector2(-10, -10)
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const hitPoint = new THREE.Vector3()

    let width = 0
    let height = 0
    let active = true
    let isMouseDown = false

    const addRippleAtPoint = (worldX: number, worldZ: number, multiplier = 1.0) => {
      const now = performance.now() / 1000.0
      let mult = multiplier
      if (intensityRef.current === 'subtle') mult *= 0.6
      if (intensityRef.current === 'heavy') mult *= 1.8

      // Add to FIFO ripple list
      ripplesRef.push({
        x: worldX,
        z: worldZ,
        startTime: now,
        intensity: 1.5 * mult,
      })

      // Limit to MAX_RIPPLES
      if (ripplesRef.length > MAX_RIPPLES) {
        ripplesRef.shift()
      }

      setRippleCount(ripplesRef.length)
    }

    const getIntersectionFromEvent = (e: PointerEvent | MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / Math.max(1, width)) * 2 - 1
      const y = -((e.clientY - rect.top) / Math.max(1, height)) * 2 + 1
      mouseNorm.set(x, y)

      raycaster.setFromCamera(mouseNorm, camera)
      // Check intersection against ground plane
      if (raycaster.ray.intersectPlane(groundPlane, hitPoint)) {
        return hitPoint
      }
      return null
    }

    let lastDragAt = 0
    const onPointerMove = (e: PointerEvent) => {
      const hit = getIntersectionFromEvent(e)
      if (hit) {
        material.uniforms.uPointer.value.set(hit.x, hit.z)
      }

      if (isMouseDown && hit) {
        const now = performance.now()
        // Throttle drag ripples
        if (now - lastDragAt > 90) {
          addRippleAtPoint(hit.x, hit.z, 0.65)
          lastDragAt = now
        }
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      isMouseDown = true
      material.uniforms.uPointerActive.value = 1.0
      const hit = getIntersectionFromEvent(e)
      if (hit) {
        addRippleAtPoint(hit.x, hit.z, 1.2)
      }
    }

    const onPointerUp = () => {
      isMouseDown = false
      material.uniforms.uPointerActive.value = 0.0
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(1, height)
      camera.updateProjectionMatrix()
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    canvas.addEventListener('pointermove', onPointerMove, { passive: true })
    canvas.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)

    let frameId = 0

    const renderLoop = (time: number) => {
      if (!active) return

      const currentTime = time / 1000.0

      material.uniforms.uTime.value = currentTime

      // Sync viewMode uniform
      const modeVal = viewModeRef.current === 'ocean' ? 0 : viewModeRef.current === 'ribbon' ? 1 : 2
      material.uniforms.uViewMode.value = modeVal

      // Pack active ripples into uniform array
      const flat = material.uniforms.uRipples.value as Float32Array
      flat.fill(0)

      for (let i = 0; i < ripplesRef.length; i++) {
        const rip = ripplesRef[i]
        const age = currentTime - rip.startTime
        if (age < 3.5) {
          flat[i * 4 + 0] = rip.x
          flat[i * 4 + 1] = rip.z
          flat[i * 4 + 2] = rip.startTime
          flat[i * 4 + 3] = rip.intensity
        }
      }

      // Gentle camera orbit for subtle cinematic feel
      camera.position.x = 2.2 + Math.sin(currentTime * 0.15) * 0.25
      camera.position.z = 2.4 + Math.cos(currentTime * 0.15) * 0.25
      camera.lookAt(0, -0.05, 0)

      renderer.render(scene, camera)
      frameId = requestAnimationFrame(renderLoop)
    }

    frameId = requestAnimationFrame(renderLoop)

    return () => {
      active = false
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div className="ocean-sandbox-page">
      <canvas ref={canvasRef} className="ocean-sandbox-canvas" />

      {/* Floating Header UI */}
      <header className="ocean-sandbox-header">
        <div className="ocean-sandbox-brand">
          {onBack && (
            <button type="button" onClick={onBack} className="ocean-sandbox-back-btn">
              ← Return to Portfolio
            </button>
          )}
          <span className="ocean-sandbox-pill">R&amp;D EXPERIMENT</span>
          <h1>Raging Sea × Flowing Ribbons</h1>
        </div>
        <div className="ocean-sandbox-hint">
          <span>Click anywhere to create ripples • Drag to stir water {rippleCount > 0 ? `(${rippleCount} active)` : ''}</span>
        </div>
      </header>

      {/* Control Panel Bar */}
      <footer className="ocean-sandbox-controls">
        <div className="control-group">
          <label>View Mode:</label>
          <div className="pill-toggle">
            <button
              type="button"
              className={viewMode === 'hybrid' ? 'is-active' : ''}
              onClick={() => setViewMode('hybrid')}
            >
              Hybrid Grid
            </button>
            <button
              type="button"
              className={viewMode === 'ocean' ? 'is-active' : ''}
              onClick={() => setViewMode('ocean')}
            >
              Deep Ocean
            </button>
            <button
              type="button"
              className={viewMode === 'ribbon' ? 'is-active' : ''}
              onClick={() => setViewMode('ribbon')}
            >
              Pure Ribbons
            </button>
          </div>
        </div>

        <div className="control-group">
          <label>Ripple Splash:</label>
          <div className="pill-toggle">
            <button
              type="button"
              className={intensitySetting === 'subtle' ? 'is-active' : ''}
              onClick={() => setIntensitySetting('subtle')}
            >
              Subtle
            </button>
            <button
              type="button"
              className={intensitySetting === 'medium' ? 'is-active' : ''}
              onClick={() => setIntensitySetting('medium')}
            >
              Medium
            </button>
            <button
              type="button"
              className={intensitySetting === 'heavy' ? 'is-active' : ''}
              onClick={() => setIntensitySetting('heavy')}
            >
              Heavy
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
