import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Ripple {
  x: number
  z: number
  startTime: number
  intensity: number
}

const MAX_RIPPLES = 16

export default function InteractiveOceanBackground({ isActive = true }: { isActive?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isActiveRef = useRef(isActive)
  isActiveRef.current = isActive

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        antialias: true,
        powerPreference: 'high-performance',
      })
    } catch {
      return
    }

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x060709)

    // Camera framed over the 3D sea with downward pitch ensuring full-bleed coverage
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.set(1.4, 1.85, 2.2)
    camera.lookAt(-0.1, -0.32, -1.2)

    // Sized generously (46 wide x 46 deep) and shifted back and left
    // so the 3D sea completely fills the top-left corner and all borders with zero gaps
    const planeWidth = 46.0
    const planeLength = 46.0
    const segments = 256
    const geometry = new THREE.PlaneGeometry(planeWidth, planeLength, segments, segments)
    geometry.rotateX(-Math.PI / 2)
    geometry.translate(-3.0, 0, -11.0) // Shift deeply into distance and leftward

    const rippleData = new Float32Array(MAX_RIPPLES * 4)
    const ripples: Ripple[] = []

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uRipples: { value: rippleData },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec4 uRipples[${MAX_RIPPLES}];

        varying float vHeight;
        varying vec3 vNormal;
        varying float vRippleIntensity;

        // Simplex 3D Noise (Stefan Gustavson)
        vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);

          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);

          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

          i = mod(i, 289.0);
          vec4 p = permute(permute(permute(
                     i.z + vec4(0.0, i1.z, i2.z, 1.0))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0));

          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;

          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);

          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);

          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);

          vec4 s0 = floor(b0) * 2.0 + 1.0;
          vec4 s1 = floor(b1) * 2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));

          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);

          vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;

          vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
        }

        // Exact OceanSandbox multi-octave wave elevation formula
        float oceanElevation(vec3 p) {
          float height = sin(p.x * 2.2 + uTime * 1.1) * sin(p.z * 1.8 + uTime * 0.9) * 0.12;
          for (int i = 1; i <= 3; i++) {
            float octave = float(i);
            height -= abs(snoise(vec3((p.xz + 1.5) * 1.8 * octave, uTime * 0.28)) * 0.14 / octave);
          }
          return height;
        }

        void main() {
          vec3 p = position;

          // 1. Primary ocean swell from OceanSandbox
          float baseH = oceanElevation(p);

          // 2. Dynamic Click Ripples (Silky smooth birth ramp & cosine bell envelope)
          float totalRipple = 0.0;
          float rippleHighlight = 0.0;

          for (int i = 0; i < ${MAX_RIPPLES}; i++) {
            vec4 rip = uRipples[i];
            float intensity = rip.w;
            if (intensity > 0.005) {
              vec2 center = rip.xy;
              float startTime = rip.z;
              float age = uTime - startTime;

              if (age > 0.0 && age < 3.4) {
                float dist = distance(p.xz, center);
                float speed = 1.35;
                float waveRadius = age * speed;
                float waveWidth = 0.48;
                float diff = abs(dist - waveRadius);

                if (diff < waveWidth) {
                  // Smooth bell-curve envelope (no linear sharp creases)
                  float normDiff = diff / waveWidth;
                  float envelope = cos(normDiff * 1.5707963);
                  envelope = envelope * envelope;

                  // Smooth birth ramp: 0 amplitude at exact click instant, blooming gracefully over 0.22s
                  float birth = smoothstep(0.0, 0.22, age);

                  // Viscous decay combined with birth ramp
                  float decay = exp(-age * 0.82) * intensity * birth;

                  // Silky, rhythmic water wave
                  float wave = sin((dist - waveRadius) * 16.0) * envelope * decay;
                  totalRipple += wave * 0.13;
                  rippleHighlight += abs(wave) * 1.5 * decay;
                }
              }
            }
          }

          // Gentle distant rise so distant water climbs to completely cover the top header & corners
          float distantRise = pow(max(0.0, (-p.z - 1.0) * 0.075), 1.6) * 1.55;

          p.y += baseH + totalRipple + distantRise;
          vHeight = p.y;
          vRippleIntensity = clamp(rippleHighlight, 0.0, 1.0);

          // Surface normal from OceanSandbox
          vec3 n = normalize(vec3(-totalRipple * 4.0, 1.0, -baseH * 3.0));
          vNormal = normalMatrix * n;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying float vHeight;
        varying vec3 vNormal;
        varying float vRippleIntensity;

        void main() {
          vec3 deep = vec3(0.025, 0.028, 0.035);        // Deep obsidian base in wave troughs (#070709)
          vec3 mid = vec3(0.180, 0.200, 0.230);         // Visible smoked slate & charcoal water body (#2e333b)
          vec3 crest = vec3(0.650, 0.700, 0.760);       // Luminous silver wave swell (#a6b3c2)
          vec3 rippleGlow = vec3(0.88, 0.92, 0.98);     // Liquid silver / mercury for interactive ripples
          vec3 mercuryWhite = vec3(0.96, 0.97, 0.99);   // Pure specular glint

          float trough = clamp(smoothstep(-0.25, 0.15, vHeight), 0.0, 1.0);
          vec3 oceanColor = mix(deep, mid, trough);
          oceanColor = mix(oceanColor, crest, smoothstep(0.04, 0.22, vHeight) * 0.75);

          // Add interactive ripple luminance (subtle silver sheen)
          oceanColor += rippleGlow * vRippleIntensity * 0.85;

          // Specular glint from OceanSandbox
          float specular = pow(max(0.0, dot(vNormal, normalize(vec3(0.5, 1.0, 0.5)))), 16.0);
          oceanColor += mercuryWhite * (specular * 0.42);

          gl_FragColor = vec4(oceanColor, 1.0);
        }
      `,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Raycaster for surface clicks on ground plane
    const raycaster = new THREE.Raycaster()
    const mouseNorm = new THREE.Vector2(-99, -99)
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const hitPoint = new THREE.Vector3()

    let width = window.innerWidth
    let height = window.innerHeight
    let active = true

    const getSurfaceHit = (e: PointerEvent | MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1
      const y = -((e.clientY - rect.top) / Math.max(1, height)) * 2 + 1
      mouseNorm.set(x, y)

      raycaster.setFromCamera(mouseNorm, camera)
      if (raycaster.ray.intersectPlane(groundPlane, hitPoint)) {
        return hitPoint
      }
      return null
    }

    const addRipple = (worldX: number, worldZ: number, multiplier = 1.0) => {
      const now = performance.now() / 1000.0
      ripples.push({
        x: worldX,
        z: worldZ,
        startTime: now,
        intensity: 0.9 * multiplier,
      })

      if (ripples.length > MAX_RIPPLES) {
        ripples.shift()
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null
      if (target && target.closest('a, button, input, textarea, select, .hero-sandbox-badge')) {
        return
      }

      const hit = getSurfaceHit(e)
      if (hit) {
        addRipple(hit.x, hit.z, 1.0)
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width || window.innerWidth
      height = rect.height || window.innerHeight
      const aspect = width / Math.max(1, height)

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(width, height, false)
      camera.aspect = aspect
      camera.updateProjectionMatrix()
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointerdown', onPointerDown)

    let frameId = 0

    const animate = (time: number) => {
      if (!active) return

      if (!isActiveRef.current) {
        frameId = requestAnimationFrame(animate)
        return
      }

      const currentTime = time / 1000.0
      material.uniforms.uTime.value = currentTime

      // Pack active ripples into uniform array
      const ripFlat = material.uniforms.uRipples.value as Float32Array
      ripFlat.fill(0)

      for (let i = 0; i < ripples.length; i++) {
        const rip = ripples[i]
        const age = currentTime - rip.startTime
        if (age < 3.2) {
          ripFlat[i * 4 + 0] = rip.x
          ripFlat[i * 4 + 1] = rip.z
          ripFlat[i * 4 + 2] = rip.startTime
          ripFlat[i * 4 + 3] = rip.intensity
        }
      }

      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)

    return () => {
      active = false
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', onPointerDown)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div className="hero-ocean-ambient-wrap" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-ocean-ambient-canvas" />
      <div className="hero-ocean-vignette" />
    </div>
  )
}
