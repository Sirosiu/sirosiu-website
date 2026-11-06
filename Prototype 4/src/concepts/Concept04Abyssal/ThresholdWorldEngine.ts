import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

export type WorldMode = 'idle' | 'plunge' | 'glide' | 'journey'

export interface StationData {
  u: number
  title: string
  subtitle: string
  description: string
}

export const STATIONS: StationData[] = [
  {
    u: 0.22,
    title: 'Hyperion Stream',
    subtitle: '01 / SYSTEMS ARCHITECTURE',
    description: 'High-throughput event streaming & distributed real-time telemetry processing.',
  },
  {
    u: 0.42,
    title: 'Argon Runtime',
    subtitle: '02 / INTELLIGENT EXECUTION',
    description: 'Ultra-low-latency deterministic execution layer for reactive multi-agent systems.',
  },
  {
    u: 0.62,
    title: 'Aether Spatial Engine',
    subtitle: '03 / SPATIAL COMPUTING',
    description: 'Real-time spatial visualization and interactive WebGL/WebGPU physics environments.',
  },
  {
    u: 0.80,
    title: 'Chronos Neural Matrix',
    subtitle: '04 / ADAPTIVE INTELLIGENCE',
    description: 'Temporal deep learning and state prediction models deployed across edge networks.',
  },
]

export interface WorldTelemetry {
  mode: WorldMode
  progress: number // 0 to 100
  u: number
  distance: number
  velocity: number
  activeStationIndex: number
  activeBeat: string
  isAtEnd: boolean
}

export interface ThresholdWorldEngineOptions {
  onTelemetry?: (telemetry: WorldTelemetry) => void
  onReady?: () => void
}

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x))
const smoothstep = (x: number) => {
  x = clamp(x, 0, 1)
  return x * x * (3 - 2 * x)
}
const damp = (lambda: number, dt: number) => 1 - Math.exp(-lambda * dt)

export class ThresholdWorldEngine {
  private container: HTMLElement
  private canvas: HTMLCanvasElement
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private composer: EffectComposer | null = null
  private chromaticPass: ShaderPass | null = null

  private curve: THREE.CatmullRomCurve3
  private frenetFrames: ReturnType<THREE.CatmullRomCurve3['computeFrenetFrames']>
  private numFrames = 800

  // Meshes & Materials
  private blackHoleMesh!: THREE.Mesh
  private stationRings: THREE.Mesh[] = []
  private starUniforms!: {
    uTime: { value: number }
    uWarp: { value: number }
    uDir: { value: THREE.Vector3 }
    uPR: { value: number }
  }

  // Camera & Motion vectors
  private vantage = new THREE.Vector3(18, 24, 44)
  private vLook = new THREE.Vector3(10, 10, -130)
  private camPos = new THREE.Vector3(18, 24, 44)
  private camLook = new THREE.Vector3(10, 10, -130)
  private camUp = new THREE.Vector3(0, 1, 0)

  // Kinematics State
  private mode: WorldMode = 'idle'
  private plungeProgress = 0
  private glideTime = 0
  private u = 0.012
  private scrollTarget = 0.02
  private scrollValue = 0.02
  private scrollVelocity2 = 0
  private warpIntensity = 0
  private fovTarget = 48
  private lastScrollTime = 0

  // Pointer tracking
  private pointerX = 0
  private pointerY = 0
  private smoothPointerX = 0
  private smoothPointerY = 0

  // Narrative & Telemetry
  private narrativeBeats = [
    'In the silence of deep space, complex systems find perfect clarity.',
    'I architect software that spans light-years. Welcome to my domain.',
  ]
  private curBeatIndex = 0
  private activeStationIndex = -1
  private onTelemetry?: (telemetry: WorldTelemetry) => void

  private rafId = 0
  private lastTime = performance.now()
  private elapsedTime = 0
  private isDisposed = false

  // Sound Callback
  private onWarpSound?: (warp: number) => void

  constructor(
    container: HTMLElement,
    options?: ThresholdWorldEngineOptions,
    onWarpSound?: (warp: number) => void
  ) {
    this.container = container
    this.onTelemetry = options?.onTelemetry
    this.onWarpSound = onWarpSound

    // 1. Canvas & WebGL Renderer
    this.canvas = document.createElement('canvas')
    this.canvas.className = 'universe-canvas'
    this.canvas.style.position = 'absolute'
    this.canvas.style.inset = '0'
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    this.canvas.style.display = 'block'
    this.container.appendChild(this.canvas)

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2.0))
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.setClearColor(0x020408, 1.0)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.0

    // 2. Scene & Fog
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x020408, 0.0065)

    // 3. Perspective Camera
    const aspect = this.container.clientWidth / Math.max(1, this.container.clientHeight)
    this.camera = new THREE.PerspectiveCamera(48, aspect, 0.1, 1400)
    this.camera.position.copy(this.vantage)
    this.camera.lookAt(this.vLook)
    this.scene.add(this.camera)

    // 4. Catmull-Rom Trajectory & Frenet Frames
    this.curve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 0, 10),
        new THREE.Vector3(14, 6, -30),
        new THREE.Vector3(-12, -4, -80),
        new THREE.Vector3(10, 10, -130),
        new THREE.Vector3(26, -2, -180),
        new THREE.Vector3(2, -12, -225),
        new THREE.Vector3(-18, 4, -265),
        new THREE.Vector3(-4, 8, -300),
      ],
      false,
      'catmullrom',
      0.5
    )
    this.frenetFrames = this.curve.computeFrenetFrames(this.numFrames, false)

    // 5. Setup Celestial Features
    this.setupHighwayRibbon()
    this.setupStarsAndWarpStreaks()
    this.setupKerrBlackHole()
    this.setupOrbitalStations()
    this.setupNebularDustHaze()
    this.setupPostProcessing()

    // 6. Listeners
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('pointermove', this.handlePointerMove, { passive: true })
    window.addEventListener('wheel', this.handleWheel, { passive: false })
    window.addEventListener('touchstart', this.handleTouchStart, { passive: true })
    window.addEventListener('touchmove', this.handleTouchMove, { passive: false })
    window.addEventListener('keydown', this.handleKeyDown)

    // 7. Ready notification
    options?.onReady?.()

    // 8. Start Render Loop
    this.animate(performance.now())
  }

  // Helper to interpolate Frenet frames smoothly along the path
  private sampleFrame(u: number, frames: THREE.Vector3[]): THREE.Vector3 {
    const clampedU = clamp(u, 0, 1)
    const f = this.curve.getUtoTmapping(clampedU, (null as unknown as number)) * this.numFrames
    const i = Math.min(this.numFrames - 1, Math.floor(f))
    const k = f - i
    return frames[i].clone().lerp(frames[i + 1] || frames[i], k).normalize()
  }

  private rail(u: number): { p: THREE.Vector3; l: THREE.Vector3; n: THREE.Vector3 } {
    const n = this.sampleFrame(u, this.frenetFrames.normals)
    const b = this.sampleFrame(u, this.frenetFrames.binormals)
    const pU = this.curve.getPointAt(clamp(u, 0, 1))
    const pNext1 = this.curve.getPointAt(clamp(u + 0.01, 0, 1))
    const pNext4 = this.curve.getPointAt(clamp(u + 0.04, 0, 1))
    const pNext5 = this.curve.getPointAt(clamp(u + 0.05, 0, 1))

    const t0 = pNext1.clone().sub(pU).normalize()
    const t1 = pNext5.clone().sub(pNext4).normalize()
    const bank = clamp(t1.sub(t0).dot(b) * 9, -0.25, 0.25)

    return {
      p: pU.addScaledVector(n, 1.5),
      l: pNext4.addScaledVector(n, 0.4),
      n: n.clone().applyAxisAngle(t0, bank),
    }
  }

  /**
   * 1. Crystalline Ribbon Highway
   */
  private setupHighwayRibbon(): void {
    const verts: number[] = []
    const indices: number[] = []
    const leftRail: THREE.Vector3[] = []
    const rightRail: THREE.Vector3[] = []
    const ties: THREE.Vector3[] = []

    for (let i = 0; i <= this.numFrames; i += 2) {
      const p = this.curve.getPoint(i / this.numFrames)
      const b = this.frenetFrames.binormals[i]

      verts.push(
        p.x + b.x * 0.45,
        p.y + b.y * 0.45,
        p.z + b.z * 0.45,
        p.x - b.x * 0.45,
        p.y - b.y * 0.45,
        p.z - b.z * 0.45
      )

      leftRail.push(p.clone().addScaledVector(b, 1.5))
      rightRail.push(p.clone().addScaledVector(b, -1.5))

      if (i % 8 === 0) {
        ties.push(p.clone().addScaledVector(b, 1.5), p.clone().addScaledVector(b, -1.5))
      }

      const k = i / 2
      if (i < this.numFrames) {
        indices.push(k * 2, k * 2 + 1, k * 2 + 2, k * 2 + 1, k * 2 + 3, k * 2 + 2)
      }
    }

    const roadGeo = new THREE.BufferGeometry()
    roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    roadGeo.setIndex(indices)

    const roadMesh = new THREE.Mesh(
      roadGeo,
      new THREE.MeshBasicMaterial({
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    )
    this.scene.add(roadMesh)

    // Outer Starlight Rails
    const railMat = new THREE.LineBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.45,
    })
    this.scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(leftRail), railMat))
    this.scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rightRail), railMat))

    // Starlight Cross Ties
    const tiesMat = new THREE.LineBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.28,
    })
    this.scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(ties), tiesMat))
  }

  /**
   * 2. Stars, Stardust & Relativistic Warp Streaks
   */
  private setupStarsAndWarpStreaks(): void {
    const numStars = 4200
    const numStreaks = 2600
    const positions = new Float32Array(numStars * 3)
    const seeds = new Float32Array(numStars)

    for (let i = 0; i < numStars; i++) {
      let p: THREE.Vector3
      if (i < numStreaks) {
        p = this.curve.getPoint(Math.random())
        const dir = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize()
        p.addScaledVector(dir, 7 + Math.pow(Math.random(), 0.7) * 95)
      } else {
        p = new THREE.Vector3(
          (Math.random() - 0.5) * 700,
          (Math.random() - 0.5) * 400,
          -420 + Math.random() * 480
        )
      }
      positions[i * 3] = p.x
      positions[i * 3 + 1] = p.y
      positions[i * 3 + 2] = p.z
      seeds[i] = Math.random()
    }

    this.starUniforms = {
      uTime: { value: 0 },
      uWarp: { value: 0 },
      uDir: { value: new THREE.Vector3(0, 0, -1) },
      uPR: { value: this.renderer.getPixelRatio() },
    }

    // Point Stars
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    starGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))

    const starMat = new THREE.ShaderMaterial({
      uniforms: this.starUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        precision highp float;
        attribute float aSeed;
        uniform float uTime;
        uniform float uPR;
        varying float vA;
        varying vec3 vC;

        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp((0.8 + aSeed * 1.8) * uPR * (70.0 / -mv.z), uPR, 3.2 * uPR);
          vA = (0.3 + 0.7 * (0.5 + 0.5 * sin(uTime * (0.5 + aSeed * 1.7) + aSeed * 40.0))) * (0.45 + 0.55 * aSeed);
          vC = mix(vec3(0.58, 0.64, 0.72), vec3(0.89, 0.91, 0.94), aSeed);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying float vA;
        varying vec3 vC;

        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          float a = smoothstep(0.5, 0.0, d) * vA;
          gl_FragColor = vec4(vC * a, a);
        }
      `,
    })
    this.scene.add(new THREE.Points(starGeo, starMat))

    // Velocity Warp Streaks
    const streakPos = new Float32Array(numStreaks * 6)
    const ends = new Float32Array(numStreaks * 2)
    const streakSeeds = new Float32Array(numStreaks * 2)

    for (let i = 0; i < numStreaks; i++) {
      for (let k = 0; k < 2; k++) {
        streakPos.set(positions.subarray(i * 3, i * 3 + 3), (i * 2 + k) * 3)
        ends[i * 2 + k] = k
        streakSeeds[i * 2 + k] = seeds[i]
      }
    }

    const streakGeo = new THREE.BufferGeometry()
    streakGeo.setAttribute('position', new THREE.BufferAttribute(streakPos, 3))
    streakGeo.setAttribute('aEnd', new THREE.BufferAttribute(ends, 1))
    streakGeo.setAttribute('aSeed', new THREE.BufferAttribute(streakSeeds, 1))

    const streakMat = new THREE.ShaderMaterial({
      uniforms: this.starUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        precision highp float;
        attribute float aEnd;
        attribute float aSeed;
        uniform float uWarp;
        uniform vec3 uDir;
        varying float vA;

        void main() {
          vec3 p = position - uDir * aEnd * uWarp * (8.0 + aSeed * 26.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          vA = (1.0 - aEnd) * uWarp * 0.55 * (0.4 + aSeed * 0.6);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying float vA;

        void main() {
          gl_FragColor = vec4(vec3(0.82, 0.88, 0.96) * vA, vA);
        }
      `,
    })
    const streakLines = new THREE.LineSegments(streakGeo, streakMat)
    streakLines.frustumCulled = false
    this.scene.add(streakLines)
  }

  /**
   * 3. Analytic Kerr Gravitational Core (Einstein Lensing Ring)
   */
  private setupKerrBlackHole(): void {
    const kerrMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.OneFactor,
      blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
      vertexShader: /* glsl */ `
        precision highp float;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec2 vUv;

        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          float r = length(p);
          float an = atan(p.y, p.x);

          float hz = smoothstep(0.205, 0.195, r);
          float dop = 0.45 + 0.55 * smoothstep(-0.5, 0.6, -p.x);

          float ring = exp(-pow((r - 0.235) / 0.011, 2.0)) * (0.3 + 0.7 * (0.5 + 0.5 * cos(an - 2.6)));
          float disc = exp(-pow(p.y * 20.0, 2.0)) * smoothstep(0.21, 0.3, abs(p.x)) * exp(-(abs(p.x) - 0.21) * 4.5) * dop;
          float arc = exp(-pow((r - 0.29) / 0.02, 2.0)) * smoothstep(0.0, 0.18, p.y) * exp(-abs(p.x) * 3.0) * 0.8
                    + exp(-pow((r - 0.27) / 0.015, 2.0)) * smoothstep(0.0, -0.2, p.y) * exp(-abs(p.x) * 5.0) * 0.25;
          float glow = 0.012 / (r * r + 0.012) * smoothstep(1.0, 0.35, r);

          vec3 c = vec3(0.89, 0.91, 0.94) * (ring * 0.9 + arc * 0.6)
                 + vec3(1.0, 0.72, 0.38) * disc * 0.8
                 + vec3(0.22, 0.74, 0.97) * glow * 0.22;

          gl_FragColor = vec4(c * (1.0 - hz), hz);
        }
      `,
    })

    this.blackHoleMesh = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), kerrMat)
    this.blackHoleMesh.position.set(0, 0, -350)
    this.blackHoleMesh.renderOrder = 2
    this.scene.add(this.blackHoleMesh)
  }

  /**
   * 4. Minimalist Architectural Monolith Stations
   */
  private setupOrbitalStations(): void {
    this.scene.add(new THREE.AmbientLight(0x1b2433, 1.4))
    const dirLight = new THREE.DirectionalLight(0xe2e8f0, 0.9)
    dirLight.position.set(20, 30, 10)
    this.scene.add(dirLight)

    const mat = new THREE.MeshStandardMaterial({
      color: 0x0b0f17,
      metalness: 0.9,
      roughness: 0.15,
      transparent: true,
      opacity: 0.88,
    })
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.7,
    })

    STATIONS.forEach((s, i) => {
      const g = new THREE.Group()
      const b = this.sampleFrame(s.u, this.frenetFrames.binormals)
      const n = this.sampleFrame(s.u, this.frenetFrames.normals)
      const side = i % 2 === 1 ? -1 : 1

      g.position.copy(this.curve.getPointAt(s.u)).addScaledVector(b, side * 10).addScaledVector(n, 1.5)

      const addGeo = (geo: THREE.BufferGeometry, x = 0, y = 0, z = 0) => {
        const m = new THREE.Mesh(geo, mat)
        m.position.set(x, y, z)
        g.add(m)
        const l = new THREE.LineSegments(new THREE.EdgesGeometry(geo), lineMat)
        l.position.copy(m.position)
        g.add(l)
      }

      if (i === 0) {
        // Station 01 // Hyperion Stream: Layered floating slabs
        for (let k = -2; k <= 2; k++) {
          addGeo(new THREE.BoxGeometry(2.8 - Math.abs(k) * 0.35, 1, 0.5), 0, k * 1.9, 0)
        }
      } else if (i === 1) {
        // Station 02 // Argon Runtime: Hexagonal core
        addGeo(new THREE.CylinderGeometry(1.2, 1.2, 9, 6))
        addGeo(new THREE.CylinderGeometry(2.6, 2.6, 0.4, 6))
      } else if (i === 2) {
        // Station 03 // Aether Spatial Engine: Octahedron crystal
        addGeo(new THREE.OctahedronGeometry(3.4))
        addGeo(new THREE.IcosahedronGeometry(1.4))
      } else {
        // Station 04 // Chronos Neural Matrix: Constellation spheres
        for (let k = 0; k < 7; k++) {
          addGeo(
            new THREE.SphereGeometry(0.5 + (k % 3) * 0.25, 10, 8),
            Math.sin(k * 2.1) * 2.4,
            (k - 3) * 1.3,
            Math.cos(k * 2.1) * 2.4
          )
        }
      }

      // Rotating Starlight Torus Ring
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(5.6, 0.03, 6, 120),
        new THREE.MeshBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.45 })
      )
      ring.rotation.x = Math.PI / 2.4
      g.add(ring)
      this.stationRings.push(ring)

      // Wireframe Floor Grid
      const grid = new THREE.GridHelper(16, 16, 0x94a3b8, 0x94a3b8)
      grid.position.y = -5.5
      if (grid.material instanceof THREE.Material) {
        grid.material.transparent = true
        grid.material.opacity = 0.14
      }
      g.add(grid)

      // Subtle Point Light
      const pl = new THREE.PointLight(0x38bdf8, 0.7, 40)
      pl.position.set(0, 0, 3)
      g.add(pl)

      g.lookAt(this.curve.getPointAt(s.u))
      this.scene.add(g)
    })
  }

  /**
   * 5. Restrained Nebular Stardust Haze (Atmospheric Depth)
   */
  private setupNebularDustHaze(): void {
    const n = 140
    const p = new Float32Array(n * 3)
    const z = new Float32Array(n)

    for (let i = 0; i < n; i++) {
      const q = this.curve.getPoint(Math.random()).add(
        new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize().multiplyScalar(35 + Math.random() * 80)
      )
      p[i * 3] = q.x
      p[i * 3 + 1] = q.y
      p[i * 3 + 2] = q.z
      z[i] = 0.5 + Math.random()
    }

    const hazeGeo = new THREE.BufferGeometry()
    hazeGeo.setAttribute('position', new THREE.BufferAttribute(p, 3))
    hazeGeo.setAttribute('aSeed', new THREE.BufferAttribute(z, 1))

    const hazeMat = new THREE.ShaderMaterial({
      uniforms: this.starUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        precision highp float;
        attribute float aSeed;
        uniform float uPR;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = min(aSeed * 9000.0 * uPR / -mv.z, 900.0 * uPR);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5)) * 2.0;
          float a = exp(-d * d * 3.0) * 0.05;
          gl_FragColor = vec4(vec3(0.1, 0.17, 0.25) * a * 4.0, a);
        }
      `,
    })
    this.scene.add(new THREE.Points(hazeGeo, hazeMat))
  }

  /**
   * 6. Post-Processing: Bloom + Chromatic Aberration
   */
  private setupPostProcessing(): void {
    try {
      this.composer = new EffectComposer(this.renderer)
      this.composer.addPass(new RenderPass(this.scene, this.camera))

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.6,
        0.7,
        0.22
      )
      this.composer.addPass(bloomPass)

      this.chromaticPass = new ShaderPass({
        uniforms: {
          tDiffuse: { value: null },
          uAmt: { value: 0 },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          precision highp float;
          uniform sampler2D tDiffuse;
          uniform float uAmt;
          varying vec2 vUv;
          void main() {
            vec2 d = (vUv - 0.5) * uAmt;
            gl_FragColor = vec4(
              texture2D(tDiffuse, vUv + d).r,
              texture2D(tDiffuse, vUv).g,
              texture2D(tDiffuse, vUv - d).b,
              1.0
            );
          }
        `,
      })
      this.composer.addPass(this.chromaticPass)
    } catch (e) {
      console.warn('Post-processing initialization error:', e)
      this.composer = null
    }
  }

  // Pointer Movement
  private handlePointerMove = (e: PointerEvent): void => {
    this.pointerX = (e.clientX / window.innerWidth) * 2 - 1
    this.pointerY = (e.clientY / window.innerHeight) * 2 - 1
  }

  // Wheel Movement (Virtual Spring)
  private handleWheel = (e: WheelEvent): void => {
    if (this.mode === 'journey') {
      e.preventDefault()
      this.scrollTarget = clamp(this.scrollTarget + e.deltaY * 0.00018, 0.02, 0.93)
      this.lastScrollTime = this.elapsedTime
    }
  }

  private touchStartY = 0
  private handleTouchStart = (e: TouchEvent): void => {
    this.touchStartY = e.touches[0].clientY
  }

  private handleTouchMove = (e: TouchEvent): void => {
    if (this.mode === 'journey') {
      e.preventDefault()
      const y = e.touches[0].clientY
      this.scrollTarget = clamp(this.scrollTarget + (this.touchStartY - y) * 0.0007, 0.02, 0.93)
      this.touchStartY = y
      this.lastScrollTime = this.elapsedTime
    }
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (this.mode === 'journey') {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        this.scrollTarget = clamp(this.scrollTarget + 0.05, 0.02, 0.93)
        this.lastScrollTime = this.elapsedTime
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        this.scrollTarget = clamp(this.scrollTarget - 0.05, 0.02, 0.93)
        this.lastScrollTime = this.elapsedTime
      }
    }
  }

  public setPointer(x: number, y: number): void {
    this.pointerX = x
    this.pointerY = y
  }

  public startPlunge(): void {
    if (this.mode === 'idle') {
      this.mode = 'plunge'
      this.plungeProgress = 0
    }
  }

  public skipToJourney(): void {
    this.mode = 'journey'
    this.scrollTarget = this.scrollValue = this.u = 0.095
    this.scrollVelocity2 = 0
  }

  public goToStation(index: number): void {
    if (index >= 0 && index < STATIONS.length && this.mode === 'journey') {
      this.scrollTarget = STATIONS[index].u
      this.lastScrollTime = this.elapsedTime
    }
  }

  private animate = (now: number): void => {
    if (this.isDisposed) return
    this.rafId = requestAnimationFrame(this.animate)

    const dt = Math.min(0.05, (now - this.lastTime) / 1000)
    this.lastTime = now
    this.elapsedTime += dt

    let targetPos: THREE.Vector3
    let targetLook: THREE.Vector3
    let targetUp: THREE.Vector3 = new THREE.Vector3(0, 1, 0)
    let lambda = 3
    let warpT = 0

    const right = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 0)
    const up = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 1)

    this.smoothPointerX += (this.pointerX - this.smoothPointerX) * damp(3, dt)
    this.smoothPointerY += (this.pointerY - this.smoothPointerY) * damp(3, dt)

    if (this.mode === 'idle') {
      targetPos = this.vantage.clone().add(
        new THREE.Vector3(Math.sin(this.elapsedTime * 0.2) * 1.2, Math.cos(this.elapsedTime * 0.17) * 0.8, 0)
      )
      targetLook = this.vLook
        .clone()
        .addScaledVector(right, this.smoothPointerX * 7)
        .addScaledVector(up, -this.smoothPointerY * 4)
      lambda = 2.5
    } else if (this.mode === 'plunge') {
      this.plungeProgress = Math.min(1, this.plungeProgress + dt / 3.4)
      const e = smoothstep(this.plungeProgress)
      const r0 = this.rail(0.095)

      targetPos = this.vantage.clone().lerp(r0.p, e)
      targetLook = this.vLook.clone().lerp(r0.l, e)
      targetUp = new THREE.Vector3(0, 1, 0).lerp(r0.n, e)
      lambda = 5

      warpT = Math.sin(this.plungeProgress * Math.PI)
      this.fovTarget = 48 + 14 * smoothstep(this.plungeProgress * 1.3)

      if (this.plungeProgress >= 1) {
        this.mode = 'journey'
        this.scrollTarget = this.scrollValue = this.u = 0.095
        this.scrollVelocity2 = 0
      }
    } else if (this.mode === 'glide') {
      this.glideTime += dt
      const x = clamp(this.glideTime / 9.6, 0, 1)
      this.u = 0.012 + 0.083 * (1 - (1 - x) * (1 - x))
      warpT = 0.2 * (1 - x)

      const bIndex = this.glideTime > 0.6 && this.glideTime < 4.4 ? 1 : this.glideTime > 5.2 && this.glideTime < 9.0 ? 2 : 0
      this.curBeatIndex = bIndex

      if (this.glideTime > 9.6) {
        this.mode = 'journey'
        this.scrollTarget = this.scrollValue = this.u = 0.095
        this.scrollVelocity2 = 0
      }

      const r = this.rail(this.u)
      targetPos = r.p
      targetLook = r.l
      targetUp = r.n
      lambda = 5
      this.fovTarget = 62
    } else {
      // 2nd-order Critically Damped Spring Physics for World Journey
      const w = 7
      const accel = w * w * (this.scrollTarget - this.scrollValue) - 2 * w * this.scrollVelocity2
      this.scrollVelocity2 += accel * dt
      this.scrollValue += this.scrollVelocity2 * dt
      this.u = clamp(this.scrollValue, 0.02, 0.93)

      const r = this.rail(this.u)
      targetPos = r.p
        .addScaledVector(right, this.smoothPointerX * 0.35)
        .addScaledVector(up, -this.smoothPointerY * 0.25)
      targetLook = r.l
      targetUp = r.n
      lambda = 7

      warpT = clamp(Math.abs(this.scrollVelocity2) * 5, 0, 0.5)
      this.fovTarget = 62 + clamp(Math.abs(this.scrollVelocity2) * 10, 0, 4)

      // Active Chapter Detection
      let nearestIndex = -1
      STATIONS.forEach((s, i) => {
        if (Math.abs(this.u - s.u) < 0.045) nearestIndex = i
      })
      this.activeStationIndex = nearestIndex

      // Subtle Magnetic Pull to station when user rests near it
      if (this.elapsedTime - this.lastScrollTime > 1.2 && nearestIndex >= 0) {
        this.scrollTarget += (STATIONS[nearestIndex].u - this.scrollTarget) * damp(1.5, dt)
      }
    }

    // Smooth Camera Kinematics
    this.camPos.lerp(targetPos, damp(lambda, dt))
    this.camLook.lerp(targetLook, damp(lambda, dt))
    this.camUp.lerp(targetUp, damp(lambda, dt)).normalize()

    this.camera.position.copy(this.camPos)
    this.camera.up.copy(this.camUp)
    this.camera.lookAt(this.camLook)

    this.camera.fov += (this.fovTarget - this.camera.fov) * damp(3, dt)
    this.camera.updateProjectionMatrix()
    this.camera.updateMatrixWorld()

    // Smooth Warp Shader & Sound Modulation
    this.warpIntensity += (warpT - this.warpIntensity) * damp(4, dt)
    this.starUniforms.uTime.value = this.elapsedTime
    this.starUniforms.uWarp.value = this.warpIntensity
    this.starUniforms.uDir.value.copy(this.camLook).sub(this.camPos).normalize()

    if (this.onWarpSound) {
      this.onWarpSound(this.warpIntensity)
    }

    // Black Hole Scaling and Rotation
    if (this.blackHoleMesh) {
      this.blackHoleMesh.quaternion.copy(this.camera.quaternion)
      this.blackHoleMesh.scale.setScalar(1 + 1.2 * smoothstep((this.u - 0.55) / 0.38))
    }

    // Station Rings Rotation
    this.stationRings.forEach((ring, i) => {
      ring.rotation.z = this.elapsedTime * 0.08 * (i % 2 === 1 ? -1 : 1)
    })

    // Chromatic Aberration Shader Pass
    if (this.chromaticPass) {
      this.chromaticPass.uniforms.uAmt.value = 0.0012 + this.warpIntensity * 0.014
    }

    // Report Telemetry
    if (this.onTelemetry) {
      const activeBeat = this.curBeatIndex > 0 ? this.narrativeBeats[this.curBeatIndex - 1] : ''
      this.onTelemetry({
        mode: this.mode,
        progress: Math.min(100, Math.floor(((this.u - 0.02) / 0.91) * 100)),
        u: this.u,
        distance: Math.round(this.u * 300),
        velocity: Math.abs(this.scrollVelocity2) * 100,
        activeStationIndex: this.activeStationIndex,
        activeBeat,
        isAtEnd: this.u > 0.87,
      })
    }

    // Render Scene
    if (this.composer) {
      this.composer.render()
    } else {
      this.renderer.render(this.scene, this.camera)
    }
  }

  private handleResize = (): void => {
    if (!this.container || this.isDisposed) return
    const w = this.container.clientWidth
    const h = Math.max(1, this.container.clientHeight)
    this.renderer.setSize(w, h, false)
    if (this.composer) {
      this.composer.setSize(w, h)
    }
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  public dispose(): void {
    this.isDisposed = true
    cancelAnimationFrame(this.rafId)

    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('pointermove', this.handlePointerMove)
    window.removeEventListener('wheel', this.handleWheel)
    window.removeEventListener('touchstart', this.handleTouchStart)
    window.removeEventListener('touchmove', this.handleTouchMove)
    window.removeEventListener('keydown', this.handleKeyDown)

    this.renderer.dispose()
    if (this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas)
    }
  }
}
