import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'

interface GpgpuCurlNoiseBackgroundProps {
  isActive?: boolean
  isLight?: boolean
}

// ============================================================================
// SIMULATION SHADER (GLSL)
// Divergence-free Curl Noise vector field updating particle positions on GPU
// ============================================================================
const SIMULATION_SHADER = `
  uniform float uTime;
  uniform float uDelta;
  uniform float uSpeed;
  uniform float uFrequency;
  uniform vec3 uMouse;
  uniform float uMouseRadius;
  uniform float uMouseForce;
  uniform sampler2D uInitialPositions;

  // --------------------------------------------------------------------------
  // Stefan Gustavson's Simplex 3D Noise (Ashima Arts)
  // --------------------------------------------------------------------------
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

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

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

  // Sample vector noise around point p with 3 rotated phase offsets
  vec3 snoiseVec3(vec3 x) {
    float s  = snoise(vec3(x));
    float s1 = snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2));
    float s2 = snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4));
    return vec3(s, s1, s2);
  }

  // Finite-difference curl operator to enforce divergence-free solenoidal flow
  vec3 curlNoise(vec3 p) {
    const float e = 0.08;
    vec3 dx = vec3(e, 0.0, 0.0);
    vec3 dy = vec3(0.0, e, 0.0);
    vec3 dz = vec3(0.0, 0.0, e);

    vec3 p_x0 = snoiseVec3(p - dx);
    vec3 p_x1 = snoiseVec3(p + dx);
    vec3 p_y0 = snoiseVec3(p - dy);
    vec3 p_y1 = snoiseVec3(p + dy);
    vec3 p_z0 = snoiseVec3(p - dz);
    vec3 p_z1 = snoiseVec3(p + dz);

    float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
    float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
    float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

    const float divisor = 1.0 / (2.0 * e);
    return normalize(vec3(x, y, z) * divisor);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 currentData = texture2D(texturePosition, uv);
    vec3 pos = currentData.xyz;
    float life = currentData.w;

    // Advance life cycle [0.0 -> 1.0]
    life += uDelta * 0.075;

    // Boundary check or life expiration triggers a soft cyclic respawn
    float distFromOrigin = length(pos);
    if (life >= 1.0 || distFromOrigin > 9.0) {
      vec4 initData = texture2D(uInitialPositions, uv);
      pos = initData.xyz;
      life = fract(life); // preserve offset phase
    } else {
      // Divergence-free curl noise velocity
      vec3 curl = curlNoise(pos * uFrequency + vec3(0.0, 0.0, uTime * 0.12));

      // Subtle mouse divergence interaction
      if (uMouseForce > 0.001) {
        vec3 mouseDiff = pos - uMouse;
        float mouseDist = length(mouseDiff);
        if (mouseDist < uMouseRadius && mouseDist > 0.001) {
          float force = (1.0 - mouseDist / uMouseRadius) * uMouseForce;
          curl += (mouseDiff / mouseDist) * force * 1.8;
        }
      }

      // Smooth step along the vector field
      pos += curl * uSpeed * uDelta;
    }

    gl_FragColor = vec4(pos, life);
  }
`

// ============================================================================
// DEPTH-OF-FIELD POINT CLOUD SHADERS (GLSL)
// Crisp in-focus particles with soft optical bokeh and distance falloff
// ============================================================================
const POINTS_VERTEX_SHADER = `
  uniform sampler2D uPositionTexture;
  uniform float uFocusDistance;
  uniform float uFocalDepth;
  uniform float uBasePointSize;
  uniform float uMaxBokehSize;
  uniform float uPixelRatio;

  varying float vDofFactor;
  varying float vLifeAlpha;
  varying vec3 vWorldPos;

  void main() {
    // Read simulated coordinate from GPGPU FBO texture
    vec2 uv = position.xy;
    vec4 data = texture2D(uPositionTexture, uv);
    vec3 worldPos = data.xyz;
    float life = data.w;

    vWorldPos = worldPos;

    // Sine-eased life cycle gives seamless organic fade-in and fade-out
    vLifeAlpha = sin(clamp(life, 0.0, 1.0) * 3.14159265);

    vec4 mvPosition = modelViewMatrix * vec4(worldPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Camera view-space depth
    float viewDepth = -mvPosition.z;
    float distFromFocalPlane = abs(viewDepth - uFocusDistance);

    // Normalized depth-of-field factor [0.0 = tack sharp, 1.0 = fully defocused bokeh]
    float dof = clamp(distFromFocalPlane / uFocalDepth, 0.0, 1.0);
    vDofFactor = dof;

    // Focal blur expands out-of-focus particles into soft discs
    float calculatedSize = uBasePointSize + dof * uMaxBokehSize;
    gl_PointSize = clamp(calculatedSize * uPixelRatio, 1.5, 16.0);
  }
`

const POINTS_FRAGMENT_SHADER = `
  uniform vec3 uColorCore;
  uniform vec3 uColorAccent;
  uniform vec3 uColorHighlight;
  uniform float uMasterAlpha;

  varying float vDofFactor;
  varying float vLifeAlpha;
  varying vec3 vWorldPos;

  void main() {
    // Circular particle shape
    vec2 coord = gl_PointCoord - vec2(0.5);
    float distSq = dot(coord, coord);
    if (distSq > 0.25) discard;

    // Soft Gaussian-like radial edge falloff for optical bokeh
    float radialFalloff = smoothstep(0.25, 0.02, distSq);

    // Color interpolation across the vector field:
    // Core (deep obsidian/slate) -> Accent (warm silicon gold #d7a66e) -> Highlight (champagne sparkle)
    float heightMix = clamp((vWorldPos.y + 2.5) / 5.0, 0.0, 1.0);
    vec3 particleColor = mix(uColorCore, uColorAccent, heightMix);

    // Organic micro-accents along streamlines
    float microShimmer = sin(vWorldPos.x * 2.5 + vWorldPos.z * 3.0);
    if (microShimmer > 0.62) {
      particleColor = mix(particleColor, uColorHighlight, (microShimmer - 0.62) * 1.8);
    }

    // Depth-of-field alpha attenuation: out-of-focus bokeh softens in intensity
    float dofAlphaAttenuation = 1.0 - vDofFactor * 0.45;
    float finalAlpha = radialFalloff * vLifeAlpha * uMasterAlpha * dofAlphaAttenuation;

    gl_FragColor = vec4(particleColor, finalAlpha);
  }
`

// Theme-specific color palettes
const PALETTES = {
  dark: {
    background: 0x060709,
    core: new THREE.Vector3(0.20, 0.30, 0.44),      // deep muted slate cyan
    accent: new THREE.Vector3(0.88, 0.68, 0.44),    // warm architectural gold #d7a66e
    highlight: new THREE.Vector3(0.98, 0.90, 0.78), // champagne highlight
    masterAlpha: 0.35,
  },
  light: {
    background: 0xf6f4ee,
    core: new THREE.Vector3(0.28, 0.30, 0.34),      // deep charcoal/graphite
    accent: new THREE.Vector3(0.58, 0.44, 0.30),    // warm sepia/bronze
    highlight: new THREE.Vector3(0.44, 0.50, 0.58), // crisp technical slate
    masterAlpha: 0.14,                              // delicate & non-distracting in daytime
  },
}

export default function GpgpuCurlNoiseBackground({
  isActive = true,
  isLight = false,
}: GpgpuCurlNoiseBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isLightRef = useRef(isLight)
  const isActiveRef = useRef(isActive)
  const syncThemeRef = useRef<(() => void) | null>(null)

  isLightRef.current = isLight
  isActiveRef.current = isActive

  // Trigger dynamic theme update
  useEffect(() => {
    if (syncThemeRef.current) {
      syncThemeRef.current()
    }
  }, [isLight])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ------------------------------------------------------------------------
    // 1. Hardware & Device Tier Detection (Performance Guardrails)
    // ------------------------------------------------------------------------
    const isNarrowViewport = typeof window !== 'undefined' && window.innerWidth <= 768
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouchDevice =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    const isLowPowerDevice =
      typeof navigator !== 'undefined' &&
      navigator.hardwareConcurrency !== undefined &&
      navigator.hardwareConcurrency <= 4

    // On mobile / low-power devices, provide a static single-frame snapshot fallback
    // to eliminate 100% of continuous GPU draw, TBDR overdraw, and battery drain.
    const isStaticFallbackMode = isNarrowViewport || prefersReducedMotion || (isTouchDevice && isLowPowerDevice)

    // Grid size:
    // Desktop: 128 x 128 = 16,384 particles
    // Fallback: 96 x 96 = 9,216 particles (rendered once in static mode for crisp detail)
    const SIM_WIDTH = isStaticFallbackMode ? 96 : 128
    const TOTAL_PARTICLES = SIM_WIDTH * SIM_WIDTH

    // ------------------------------------------------------------------------
    // 2. WebGL Renderer Setup
    // ------------------------------------------------------------------------
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        antialias: false,
        powerPreference: isStaticFallbackMode ? 'low-power' : 'high-performance',
      })
    } catch {
      return
    }

    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, isStaticFallbackMode ? 1.5 : 1.75)
    renderer.setPixelRatio(dpr)
    const initialWidth = canvas.clientWidth || window.innerWidth
    const initialHeight = canvas.clientHeight || window.innerHeight
    renderer.setSize(initialWidth, initialHeight, false)

    const initialPalette = isLightRef.current ? PALETTES.light : PALETTES.dark
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(initialPalette.background)

    const aspect = initialWidth / initialHeight
    const camera = new THREE.PerspectiveCamera(48, aspect, 0.1, 50)

    // Mobile portrait camera framing vs desktop landscape camera framing
    if (aspect < 1.0) {
      camera.position.set(0.0, -0.6, 10.4)
      camera.lookAt(0.0, -1.0, 0.0)
    } else {
      camera.position.set(0.6, 0.3, 7.8)
      camera.lookAt(-0.2, 0.0, 0.0)
    }

    // ------------------------------------------------------------------------
    // 3. GPGPU Simulation Engine Setup
    // ------------------------------------------------------------------------
    const gpuCompute = new GPUComputationRenderer(SIM_WIDTH, SIM_WIDTH, renderer)

    // Enable half-float for broad mobile WebGL2 compatibility
    if (renderer.capabilities.isWebGL2) {
      gpuCompute.setDataType(THREE.HalfFloatType)
    }

    const dtPosition = gpuCompute.createTexture()
    const dtInitial = gpuCompute.createTexture()

    const posArray = dtPosition.image.data as Float32Array
    const initArray = dtInitial.image.data as Float32Array

    // Initialize particle cloud within an expansive spatial volume
    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const idx = i * 4

      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const r = Math.cbrt(Math.random()) * 3.6

      const x = r * Math.sin(phi) * Math.cos(theta) * 1.6 + 0.3
      const y = r * Math.sin(phi) * Math.sin(theta) * 1.2 - 0.1
      const z = r * Math.cos(phi) * 1.3

      posArray[idx + 0] = x
      posArray[idx + 1] = y
      posArray[idx + 2] = z
      posArray[idx + 3] = Math.random() // staggered initial life phase

      initArray[idx + 0] = x
      initArray[idx + 1] = y
      initArray[idx + 2] = z
      initArray[idx + 3] = posArray[idx + 3]
    }

    const positionVariable = gpuCompute.addVariable('texturePosition', SIMULATION_SHADER, dtPosition)
    gpuCompute.setVariableDependencies(positionVariable, [positionVariable])

    // Configure simulation uniforms
    const simUniforms = positionVariable.material.uniforms
    simUniforms.uTime = { value: 0 }
    simUniforms.uDelta = { value: 0.016 }
    simUniforms.uSpeed = { value: 0.48 }
    simUniforms.uFrequency = { value: 0.30 }
    simUniforms.uMouse = { value: new THREE.Vector3(999, 999, 0) }
    simUniforms.uMouseRadius = { value: 1.8 }
    simUniforms.uMouseForce = { value: 0.0 }
    simUniforms.uInitialPositions = { value: dtInitial }

    const initError = gpuCompute.init()
    if (initError !== null) {
      console.warn('GPGPU Simulation init error:', initError)
      renderer.dispose()
      return
    }

    // ------------------------------------------------------------------------
    // 4. Render Geometry & Depth-of-Field Points Material
    // ------------------------------------------------------------------------
    const pointsGeometry = new THREE.BufferGeometry()
    const uvCoords = new Float32Array(TOTAL_PARTICLES * 3)

    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const x = (i % SIM_WIDTH) / SIM_WIDTH
      const y = Math.floor(i / SIM_WIDTH) / SIM_WIDTH
      uvCoords[i * 3 + 0] = x
      uvCoords[i * 3 + 1] = y
      uvCoords[i * 3 + 2] = 0.0
    }
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(uvCoords, 3))

    const pointsMaterial = new THREE.ShaderMaterial({
      vertexShader: POINTS_VERTEX_SHADER,
      fragmentShader: POINTS_FRAGMENT_SHADER,
      uniforms: {
        uPositionTexture: { value: null },
        uFocusDistance: { value: aspect < 1.0 ? 10.4 : 7.8 }, // focal plane aligned to subject
        uFocalDepth: { value: 3.2 },                           // depth of field range
        uBasePointSize: { value: aspect < 1.0 ? 3.0 : 2.4 },   // crisp micro-nodes
        uMaxBokehSize: { value: 7.2 },                          // elegant bokeh expansion
        uPixelRatio: { value: dpr },
        uColorCore: { value: initialPalette.core },
        uColorAccent: { value: initialPalette.accent },
        uColorHighlight: { value: initialPalette.highlight },
        uMasterAlpha: { value: initialPalette.masterAlpha },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })

    const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial)
    scene.add(pointsMesh)

    // ------------------------------------------------------------------------
    // 5. Pre-warm the Simulation (Curl Streamline Formation)
    // ------------------------------------------------------------------------
    simUniforms.uDelta.value = 0.035
    for (let step = 0; step < 36; step++) {
      simUniforms.uTime.value += 0.035
      gpuCompute.compute()
    }
    const currentTexture = gpuCompute.getCurrentRenderTarget(positionVariable).texture
    pointsMaterial.uniforms.uPositionTexture.value = currentTexture

    // Theme synchronizer helper
    const updateThemePalette = () => {
      const activePalette = isLightRef.current ? PALETTES.light : PALETTES.dark
      scene.background = new THREE.Color(activePalette.background)
      pointsMaterial.uniforms.uColorCore.value = activePalette.core
      pointsMaterial.uniforms.uColorAccent.value = activePalette.accent
      pointsMaterial.uniforms.uColorHighlight.value = activePalette.highlight
      pointsMaterial.uniforms.uMasterAlpha.value = activePalette.masterAlpha
    }

    // Handle Window Resizing & Aspect Ratio Adaptation
    const onResize = () => {
      const width = canvas.clientWidth || window.innerWidth
      const height = canvas.clientHeight || window.innerHeight
      const currentAspect = width / height
      camera.aspect = currentAspect
      if (currentAspect < 1.0) {
        camera.position.set(0.0, -0.6, 10.4)
        camera.lookAt(0.0, -1.0, 0.0)
        pointsMaterial.uniforms.uFocusDistance.value = 10.4
      } else {
        camera.position.set(0.6, 0.3, 7.8)
        camera.lookAt(-0.2, 0.0, 0.0)
        pointsMaterial.uniforms.uFocusDistance.value = 7.8
      }
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
      pointsMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 1.75)
    }
    window.addEventListener('resize', onResize)

    // ------------------------------------------------------------------------
    // 6. Static Fallback Mode for Mobile & Low-Power Devices
    // ------------------------------------------------------------------------
    if (isStaticFallbackMode) {
      const renderStatic = () => {
        onResize()
        updateThemePalette()
        renderer.render(scene, camera)
      }

      // Schedule static renders once layout, fonts, and canvas CSS dimensions settle
      requestAnimationFrame(renderStatic)
      setTimeout(renderStatic, 60)
      setTimeout(renderStatic, 250)

      // Expose theme sync for user toggling in static mode
      syncThemeRef.current = renderStatic

      return () => {
        syncThemeRef.current = null
        window.removeEventListener('resize', onResize)
        pointsGeometry.dispose()
        pointsMaterial.dispose()
        gpuCompute.dispose()
        renderer.dispose()
      }
    }

    // ------------------------------------------------------------------------
    // 7. Interactive Desktop Simulation Loop & Lifecycle
    // ------------------------------------------------------------------------
    let animationFrameId: number | null = null
    let lastTime = performance.now()
    let isVisibleOnScreen = true
    let isTabFocused = !document.hidden

    syncThemeRef.current = updateThemePalette

    const mouseCurrent = new THREE.Vector3(999, 999, 0)
    const mouseTarget = new THREE.Vector3(999, 999, 0)
    let mouseActiveStrength = 0.0

    const renderFrame = (now: number) => {
      if (!isActiveRef.current || !isVisibleOnScreen || !isTabFocused) {
        animationFrameId = requestAnimationFrame(renderFrame)
        return
      }

      const elapsed = Math.min((now - lastTime) * 0.001, 0.064)
      lastTime = now

      updateThemePalette()

      // Smooth mouse interpolation & decay
      mouseCurrent.lerp(mouseTarget, 0.08)
      simUniforms.uMouse.value.copy(mouseCurrent)
      simUniforms.uMouseForce.value = mouseActiveStrength
      mouseActiveStrength = Math.max(0.0, mouseActiveStrength - elapsed * 0.45)

      // Advance GPGPU physics
      simUniforms.uTime.value += elapsed
      simUniforms.uDelta.value = elapsed
      gpuCompute.compute()

      // Bind simulated positions to visualization points material
      const simTexture = gpuCompute.getCurrentRenderTarget(positionVariable).texture
      pointsMaterial.uniforms.uPositionTexture.value = simTexture

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(renderFrame)
    }

    animationFrameId = requestAnimationFrame(renderFrame)

    // Mouse movement listener
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ndcY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)

      // Unproject NDC coordinates to z=0 plane in world coordinates
      const vector = new THREE.Vector3(ndcX, ndcY, 0.5)
      vector.unproject(camera)
      const dir = vector.sub(camera.position).normalize()
      const distance = -camera.position.z / dir.z
      const worldPos = camera.position.clone().add(dir.multiplyScalar(distance))

      mouseTarget.copy(worldPos)
      mouseActiveStrength = 0.75
    }

    const onPointerLeave = () => {
      mouseTarget.set(999, 999, 0)
      mouseActiveStrength = 0.0
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave)

    // Visibility / Scroll Observer to freeze execution when hero is off-screen
    let intersectionObserver: IntersectionObserver | null = null
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisibleOnScreen = entry.isIntersecting
          })
        },
        { threshold: 0.05 }
      )
      intersectionObserver.observe(canvas)
    }

    const onVisibilityChange = () => {
      isTabFocused = !document.hidden
      if (isTabFocused) {
        lastTime = performance.now()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    // Cleanup
    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
      syncThemeRef.current = null
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (intersectionObserver) {
        intersectionObserver.disconnect()
      }
      pointsGeometry.dispose()
      pointsMaterial.dispose()
      gpuCompute.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div className={`hero-gpgpu-ambient-wrap${isActive ? ' is-active' : ''}`}>
      <canvas
        ref={canvasRef}
        className="hero-gpgpu-ambient-canvas"
        aria-hidden="true"
      />
      {/* Subdued architectural vignette ensures text readability */}
      <div className="hero-gpgpu-vignette" />
    </div>
  )
}
