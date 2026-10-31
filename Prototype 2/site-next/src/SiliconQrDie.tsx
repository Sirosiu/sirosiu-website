import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface SiliconQrDieProps {
  isLight?: boolean
  className?: string
}

function createLithographyQrTexture(): THREE.CanvasTexture {
  const size = 512
  const grid = 29 // Standard Version 3 QR matrix
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Deep silicon die substrate background
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, size, size)

  const cell = size / (grid + 4)
  const offset = cell * 2

  const isFinderPattern = (r: number, c: number) => {
    const inTL = r < 7 && c < 7
    const inTR = r < 7 && c >= grid - 7
    const inBL = r >= grid - 7 && c < 7
    if (!inTL && !inTR && !inBL) return null

    const lr = inBL ? r - (grid - 7) : r
    const lc = inTR ? c - (grid - 7) : c
    if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true
    if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true
    return false
  }

  // Draw timing pattern strips
  const isTimingPattern = (r: number, c: number) => {
    if (r === 6 && c >= 8 && c < grid - 8) return c % 2 === 0
    if (c === 6 && r >= 8 && r < grid - 8) return r % 2 === 0
    return null
  }

  ctx.fillStyle = '#ffffff'
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      const finder = isFinderPattern(r, c)
      const timing = isTimingPattern(r, c)
      let active = false
      if (finder !== null) {
        active = finder
      } else if (timing !== null) {
        active = timing
      } else {
        // High-density deterministic hash producing authentic QR module distribution
        const hash = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453
        active = hash - Math.floor(hash) > 0.44
      }

      if (active) {
        // Micro gap padding between etched metallic pads for authentic damascene lithography
        ctx.fillRect(
          offset + c * cell + 1.2,
          offset + r * cell + 1.2,
          cell - 2.4,
          cell - 2.4
        )
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.anisotropy = 4
  return tex
}

const DIE_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPos;

  void main() {
    vUv = uv;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewPos = -mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }
`

const DIE_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  uniform sampler2D uQrMask;
  uniform float uTime;
  uniform vec3 uSiliconSubstrate;
  uniform vec3 uAmberTrace;
  uniform vec3 uSteelRim;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPos;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPos);
    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);

    // Front-facing mask check
    float isFront = step(0.4, N.z);
    float mask = texture2D(uQrMask, vUv).r * isFront;

    // Sweeping specular highlight across the etched copper/amber metal
    vec3 L = normalize(vec3(sin(uTime * 0.8) * 2.2, 1.6, 2.4));
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 42.0);

    vec3 surfaceColor = mix(
      uSiliconSubstrate + spec * 0.12,
      uAmberTrace * (0.80 + spec * 0.95),
      mask
    );

    // Add metallic edge sheen
    surfaceColor += uSteelRim * fresnel * 0.7;

    gl_FragColor = vec4(surfaceColor, 1.0);
  }
`

export default function SiliconQrDie({
  isLight = false,
  className = '',
}: SiliconQrDieProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const isLightRef = useRef(isLight)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)

  isLightRef.current = isLight

  // Dynamic theme update
  useEffect(() => {
    if (!materialRef.current) return
    const mat = materialRef.current
    if (isLight) {
      mat.uniforms.uSiliconSubstrate.value.setRGB(0.86, 0.87, 0.90) // Titanium matte
      mat.uniforms.uAmberTrace.value.setRGB(0.72, 0.42, 0.16)       // Burnished copper
      mat.uniforms.uSteelRim.value.setRGB(0.55, 0.58, 0.65)
    } else {
      mat.uniforms.uSiliconSubstrate.value.setRGB(0.055, 0.067, 0.090) // #0e1117 Obsidian silicon
      mat.uniforms.uAmberTrace.value.setRGB(0.843, 0.651, 0.431)       // #d7a66e Gold/amber damascene
      mat.uniforms.uSteelRim.value.setRGB(0.28, 0.34, 0.42)
    }
  }, [isLight])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / container.clientHeight,
      0.1,
      20
    )
    camera.position.set(0, 0, 3.5)

    const qrTexture = createLithographyQrTexture()
    const geometry = new THREE.BoxGeometry(1.75, 1.75, 0.12)

    const material = new THREE.ShaderMaterial({
      vertexShader: DIE_VERTEX_SHADER,
      fragmentShader: DIE_FRAGMENT_SHADER,
      uniforms: {
        uQrMask: { value: qrTexture },
        uTime: { value: 0 },
        uSiliconSubstrate: {
          value: isLightRef.current
            ? new THREE.Color(0.86, 0.87, 0.90)
            : new THREE.Color(0.055, 0.067, 0.090),
        },
        uAmberTrace: {
          value: isLightRef.current
            ? new THREE.Color(0.72, 0.42, 0.16)
            : new THREE.Color(0.843, 0.651, 0.431),
        },
        uSteelRim: {
          value: isLightRef.current
            ? new THREE.Color(0.55, 0.58, 0.65)
            : new THREE.Color(0.28, 0.34, 0.42),
        },
      },
    })
    materialRef.current = material

    const dieMesh = new THREE.Mesh(geometry, material)
    dieMesh.rotation.set(0.12, -0.22, 0)
    scene.add(dieMesh)

    let targetRotX = 0.12
    let targetRotY = -0.22
    let isDragging = false
    let prevX = 0
    let prevY = 0

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true
      prevX = e.clientX
      prevY = e.clientY
      container.setPointerCapture?.(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) {
        targetRotY += (e.clientX - prevX) * 0.014
        targetRotX += (e.clientY - prevY) * 0.014
        prevX = e.clientX
        prevY = e.clientY
      } else {
        const rect = container.getBoundingClientRect()
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
        targetRotY = nx * 0.42 - 0.15
        targetRotX = ny * 0.32 + 0.1
      }
    }

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false
      try {
        container.releasePointerCapture?.(e.pointerId)
      } catch {}
    }

    container.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    let rafId = 0
    let isVisible = true

    const animate = (now: number) => {
      if (!isVisible) return
      rafId = requestAnimationFrame(animate)

      material.uniforms.uTime.value = now * 0.001
      dieMesh.rotation.x += (targetRotX - dieMesh.rotation.x) * 0.08
      dieMesh.rotation.y += (targetRotY - dieMesh.rotation.y) * 0.08

      renderer.render(scene, camera)
    }

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) {
        cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(animate)
      } else {
        cancelAnimationFrame(rafId)
      }
    })
    observer.observe(container)

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      qrTexture.dispose()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      materialRef.current = null
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className={`silicon-qr-die-wrap spotlight-card ${className}`}
      data-eda-tag="[ROTATE DIE]"
      aria-label="Interactive 3D Silicon Wafer QR Matrix. Drag to rotate and inspect lithography."
      role="img"
    >
      <div className="silicon-die-hud-badge">
        <span className="hud-pulse" />
        <span className="hud-label">DIE // 29x29 LITHOGRAPHY</span>
      </div>
      <div className="silicon-die-hint">DRAG TO ROTATE DIE ↻</div>
    </div>
  )
}
