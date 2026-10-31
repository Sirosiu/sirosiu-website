import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface HeroGpgpuCanvasProps {
  isActive?: boolean
  isLight?: boolean
}

// ============================================================================
// GPGPU SIMULATION SHADERS
// Gyroid curl field with 45-degree (PI/4) Manhattan routing quantization
// ============================================================================
const SIM_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const SIM_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  uniform sampler2D uPositions;
  uniform sampler2D uInitialPositions;
  uniform float uTime;
  uniform float uDelta;
  varying vec2 vUv;

  vec3 gyroidField(vec3 p) {
    return vec3(
      sin(p.y) * cos(p.z) + cos(p.x) * sin(p.y),
      sin(p.z) * cos(p.x) + cos(p.y) * sin(p.z),
      sin(p.x) * cos(p.y) + cos(p.z) * sin(p.x)
    );
  }

  vec3 computeCurl(vec3 p) {
    const float eps = 0.05;
    vec3 dx = vec3(eps, 0.0, 0.0);
    vec3 dy = vec3(0.0, eps, 0.0);
    vec3 dz = vec3(0.0, 0.0, eps);

    vec3 p_x1 = gyroidField(p + dx);
    vec3 p_x0 = gyroidField(p - dx);
    vec3 p_y1 = gyroidField(p + dy);
    vec3 p_y0 = gyroidField(p - dy);
    vec3 p_z1 = gyroidField(p + dz);
    vec3 p_z0 = gyroidField(p - dz);

    float cx = (p_y1.z - p_y0.z) - (p_z1.y - p_z0.y);
    float cy = (p_z1.x - p_z0.x) - (p_x1.z - p_x0.z);
    float cz = (p_x1.y - p_x0.y) - (p_y1.x - p_y0.x);

    return normalize(vec3(cx, cy, cz) / (2.0 * eps));
  }

  void main() {
    vec4 posData = texture2D(uPositions, vUv);
    vec4 initData = texture2D(uInitialPositions, vUv);
    vec3 pos = posData.xyz;

    // Sample scaled spatial coordinates with slow temporal drift
    vec3 rawCurl = computeCurl(pos * 0.85 + vec3(uTime * 0.08, uTime * 0.05, 0.0));

    // Quantize XY flow angle to 8-way (45-deg / 0.785398 rad) IC trace routing
    float angle = atan(rawCurl.y, rawCurl.x);
    float sector = 0.78539816339;
    float quantizedAngle = floor((angle + sector * 0.5) / sector) * sector;

    vec2 planarDir = vec2(cos(quantizedAngle), sin(quantizedAngle));
    vec3 velocity = vec3(planarDir * 0.75, rawCurl.z * 0.25);

    float speed = length(velocity);
    pos += velocity * uDelta * 0.45;

    // Soft deterministic respawn back to die origin if particle drifts out of bounds
    float distSq = dot(pos, pos);
    if (distSq > 14.0) {
      pos = initData.xyz;
    }

    gl_FragColor = vec4(pos, clamp(speed, 0.0, 1.0));
  }
`

// ============================================================================
// PARTICLE RENDER SHADERS
// Depth-attenuated points with octagonal silicon-die chamfered geometry
// ============================================================================
const RENDER_VERTEX_SHADER = /* glsl */ `
  uniform sampler2D uPositions;
  uniform float uPointScale;
  varying float vSpeed;
  varying float vDepthFade;

  void main() {
    vec4 posData = texture2D(uPositions, position.xy);
    vSpeed = posData.w;

    vec4 mvPosition = modelViewMatrix * vec4(posData.xyz, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Hardware-efficient depth attenuation instead of heavy Bokeh DoF pass
    float dist = max(-mvPosition.z, 0.1);
    gl_PointSize = clamp(uPointScale * (3.6 / dist), 1.0, 5.0);
    vDepthFade = smoothstep(8.5, 2.0, dist);
  }
`

const RENDER_FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;
  uniform vec3 uColorBase;
  uniform vec3 uColorAccent;
  uniform float uMasterOpacity;
  varying float vSpeed;
  varying float vDepthFade;

  void main() {
    // Crisp octagonal/chamfered silicon die shape instead of blurry circles
    vec2 cxy = abs(gl_PointCoord * 2.0 - 1.0);
    if (max(cxy.x, cxy.y) > 0.85 || (cxy.x + cxy.y) > 1.3) discard;

    vec3 color = mix(uColorBase, uColorAccent, smoothstep(0.25, 0.9, vSpeed));

    gl_FragColor = vec4(color, vDepthFade * uMasterOpacity);
  }
`

export default function HeroGpgpuCanvas({
  isActive = true,
  isLight = false,
}: HeroGpgpuCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isLightRef = useRef(isLight)
  const isActiveRef = useRef(isActive)
  const renderMaterialRef = useRef<THREE.ShaderMaterial | null>(null)

  isLightRef.current = isLight
  isActiveRef.current = isActive

  // Sync theme colors dynamically into shader uniforms
  useEffect(() => {
    if (!renderMaterialRef.current) return
    const mat = renderMaterialRef.current
    if (isLight) {
      mat.uniforms.uColorBase.value.setRGB(0.18, 0.22, 0.28)   // Steel charcoal
      mat.uniforms.uColorAccent.value.setRGB(0.72, 0.44, 0.18) // Rich copper
      mat.uniforms.uMasterOpacity.value = 0.52
    } else {
      mat.uniforms.uColorBase.value.setRGB(0.118, 0.149, 0.192) // #1e2631 Obsidian slate
      mat.uniforms.uColorAccent.value.setRGB(0.843, 0.651, 0.431) // #d7a66e Solar amber
      mat.uniforms.uMasterOpacity.value = 0.68
    }
  }, [isLight])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobileOrCoarse =
      window.matchMedia('(pointer: coarse)').matches ||
      (typeof navigator !== 'undefined' &&
        navigator.hardwareConcurrency !== undefined &&
        navigator.hardwareConcurrency <= 4)

    // 64x64 (4,096) on mobile/battery-tier, 128x128 (16,384) on desktop
    const simSize = isMobileOrCoarse ? 64 : 128

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: false,
      alpha: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      25
    )
    camera.position.set(0.4, 0, 5.2)

    // Seed initial particle coordinates inside an architectural vector volume
    const totalParticles = simSize * simSize
    const initialData = new Float32Array(totalParticles * 4)
    for (let i = 0; i < totalParticles; i++) {
      const i4 = i * 4
      const theta = Math.random() * Math.PI * 2
      const r = 0.5 + Math.random() * 2.4
      initialData[i4] = Math.cos(theta) * r
      initialData[i4 + 1] = (Math.random() - 0.5) * 3.2
      initialData[i4 + 2] = (Math.random() - 0.5) * 1.8
      initialData[i4 + 3] = 0.5
    }

    const initTexture = new THREE.DataTexture(
      initialData,
      simSize,
      simSize,
      THREE.RGBAFormat,
      THREE.FloatType
    )
    initTexture.needsUpdate = true

    // Check HalfFloatType support for mobile TBDR efficiency
    const isWebGL2 = renderer.capabilities.isWebGL2
    const targetType = isWebGL2 ? THREE.HalfFloatType : THREE.FloatType

    const rttOptions: THREE.RenderTargetOptions = {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: targetType,
      depthBuffer: false,
      stencilBuffer: false,
    }

    let targetA = new THREE.WebGLRenderTarget(simSize, simSize, rttOptions)
    let targetB = new THREE.WebGLRenderTarget(simSize, simSize, rttOptions)

    const simScene = new THREE.Scene()
    const simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const simMaterial = new THREE.ShaderMaterial({
      vertexShader: SIM_VERTEX_SHADER,
      fragmentShader: SIM_FRAGMENT_SHADER,
      uniforms: {
        uPositions: { value: initTexture },
        uInitialPositions: { value: initTexture },
        uTime: { value: 0 },
        uDelta: { value: 0.016 },
      },
    })
    simScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial))

    // Build UV lookup geometry for particle draw call
    const uvCoords = new Float32Array(totalParticles * 3)
    for (let y = 0; y < simSize; y++) {
      for (let x = 0; x < simSize; x++) {
        const idx = (y * simSize + x) * 3
        uvCoords[idx] = (x + 0.5) / simSize
        uvCoords[idx + 1] = (y + 0.5) / simSize
        uvCoords[idx + 2] = 0
      }
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(uvCoords, 3))

    const renderMaterial = new THREE.ShaderMaterial({
      vertexShader: RENDER_VERTEX_SHADER,
      fragmentShader: RENDER_FRAGMENT_SHADER,
      uniforms: {
        uPositions: { value: initTexture },
        uPointScale: { value: renderer.getPixelRatio() },
        uColorBase: {
          value: isLightRef.current
            ? new THREE.Color(0.18, 0.22, 0.28)
            : new THREE.Color(0.118, 0.149, 0.192),
        },
        uColorAccent: {
          value: isLightRef.current
            ? new THREE.Color(0.72, 0.44, 0.18)
            : new THREE.Color(0.843, 0.651, 0.431),
        },
        uMasterOpacity: { value: isLightRef.current ? 0.52 : 0.68 },
      },
      transparent: true,
      depthWrite: false,
      blending: isLightRef.current ? THREE.NormalBlending : THREE.AdditiveBlending,
    })
    renderMaterialRef.current = renderMaterial

    const points = new THREE.Points(particleGeo, renderMaterial)
    scene.add(points)

    let rafId = 0
    let isVisible = true
    let lastTime = performance.now()

    // Prime the initial simulation state
    renderer.setRenderTarget(targetA)
    renderer.render(simScene, simCamera)
    renderer.setRenderTarget(null)
    simMaterial.uniforms.uPositions.value = targetA.texture

    const renderLoop = (now: number) => {
      if (!isVisible || !isActiveRef.current) return
      rafId = requestAnimationFrame(renderLoop)

      const dt = Math.min((now - lastTime) * 0.001, 0.05)
      lastTime = now

      // Step 1: Run GPGPU simulation pass into targetB
      simMaterial.uniforms.uTime.value = now * 0.001
      simMaterial.uniforms.uDelta.value = dt
      renderer.setRenderTarget(targetB)
      renderer.render(simScene, simCamera)
      renderer.setRenderTarget(null)

      // Step 2: Render particles reading from targetB
      renderMaterial.uniforms.uPositions.value = targetB.texture
      renderer.render(scene, camera)

      // Ping-pong swap
      const temp = targetA
      targetA = targetB
      targetB = temp
      simMaterial.uniforms.uPositions.value = targetA.texture
    }

    if (prefersReducedMotion) {
      // Single static pass for reduced-motion visitors
      simMaterial.uniforms.uTime.value = 1.0
      simMaterial.uniforms.uDelta.value = 0.016
      renderer.setRenderTarget(targetB)
      renderer.render(simScene, simCamera)
      renderer.setRenderTarget(null)
      renderMaterial.uniforms.uPositions.value = targetB.texture
      renderer.render(scene, camera)
    } else {
      rafId = requestAnimationFrame(renderLoop)
    }

    // Halt RAF when Hero is outside the visible viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible && !prefersReducedMotion && isActiveRef.current) {
          lastTime = performance.now()
          cancelAnimationFrame(rafId)
          rafId = requestAnimationFrame(renderLoop)
        } else {
          cancelAnimationFrame(rafId)
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(container)

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderMaterial.uniforms.uPointScale.value = renderer.getPixelRatio()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
      targetA.dispose()
      targetB.dispose()
      initTexture.dispose()
      particleGeo.dispose()
      simMaterial.dispose()
      renderMaterial.dispose()
      renderer.dispose()
      renderMaterialRef.current = null
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`hero-gpgpu-ambient-wrap${isActive ? ' is-active' : ''}`}
      aria-hidden="true"
    >
      <div className="hero-gpgpu-vignette" />
    </div>
  )
}
