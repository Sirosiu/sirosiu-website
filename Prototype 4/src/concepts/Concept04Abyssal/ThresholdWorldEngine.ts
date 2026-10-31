import * as THREE from 'three'

export type WorldMode = 'loading' | 'intro' | 'transition' | 'journey'

export interface WorldEngineOptions {
  onLoadProgress?: (percent: number, message: string) => void
  onReady?: () => void
}

export const CELESTIAL_PALETTE = {
  voidBlack: new THREE.Color(0x020308),
  deepNebula: new THREE.Color(0x060919),
  electricCyan: new THREE.Color(0x00f0ff),
  starlightViolet: new THREE.Color(0x8b5cf6),
  accretionAmber: new THREE.Color(0xff9922),
  somaGold: new THREE.Color(0xffdf7a),
} as const

export class ThresholdWorldEngine {
  private container: HTMLElement
  private canvas: HTMLCanvasElement
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private rafId = 0
  private isDisposed = false

  // Curve and Trajectory
  private curve!: THREE.CatmullRomCurve3
  private frenetFrames!: {
    tangents: THREE.Vector3[]
    normals: THREE.Vector3[]
    binormals: THREE.Vector3[]
  }
  private totalSplineLength = 1200
  private splineSegments = 400

  // 1. Kerr Relativistic Black Hole with Blandford-Znajek Polar Jets
  private kerrBlackHoleMesh!: THREE.Mesh
  private kerrMaterial!: THREE.ShaderMaterial

  // 2. Crystalline Starlight Ribbon Highway
  private ribbonHighwayMesh!: THREE.Mesh
  private ribbonMaterial!: THREE.ShaderMaterial
  private axonCoreMesh!: THREE.Mesh
  private axonMaterial!: THREE.ShaderMaterial

  // 3. Holographic Portal Rings & Dendrites
  private portalInstancedMesh!: THREE.InstancedMesh
  private dendriteGroup!: THREE.Group

  // 4. Starfield & Cosmic Warp Streaks
  private starfieldPoints!: THREE.Points
  private starfieldMaterial!: THREE.ShaderMaterial

  // 5. Volumetric Multi-Layer Nebulae (Carina / Orion Complex)
  private nebulaGroup: THREE.Group = new THREE.Group()
  private nebulaMaterials: THREE.ShaderMaterial[] = []
  private nebulaMeshes: THREE.Mesh[] = []

  // 6. Stellar Nursery Clusters
  private stellarNurseryPoints!: THREE.Points
  private stellarNurseryMaterial!: THREE.ShaderMaterial

  // 7. Cosmic Pulsar / Magnetar Beacon
  private pulsarGroup!: THREE.Group
  private pulsarBeamMeshNorth!: THREE.Mesh
  private pulsarBeamMeshSouth!: THREE.Mesh

  // 8. Orbital Monolith Stations (Ankush's Projects)
  private orbitalStations: Array<{
    group: THREE.Group
    monolithMesh: THREE.Mesh
    ringMesh: THREE.Mesh
    beaconLight: THREE.PointLight
    uPos: number
    title: string
  }> = []

  // Dynamic Camera Rig & Traveling Photon Light
  private photonLight!: THREE.PointLight
  private hemiLight!: THREE.HemisphereLight

  // Pointer tracking & Parallax
  private pointerX = 0
  private pointerY = 0
  private targetPointerX = 0
  private targetPointerY = 0

  // State Management
  private mode: WorldMode = 'loading'
  private introTime = 0
  private introDuration = 8.5
  private scrollProgress = 0
  private smoothScrollProgress = 0
  private scrollVelocity = 0
  private lastScrollProgress = 0

  // Camera tracking vectors
  private currentLookTarget = new THREE.Vector3()
  private desiredLookTarget = new THREE.Vector3()

  private startTime = performance.now()
  private lastFrameTime = performance.now()

  constructor(container: HTMLElement, options?: WorldEngineOptions) {
    this.container = container

    // Canvas & WebGL Renderer
    this.canvas = document.createElement('canvas')
    this.canvas.className = 'threshold-world-canvas'
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
      alpha: false,
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.35
    this.renderer.setClearColor(CELESTIAL_PALETTE.voidBlack, 1.0)

    // Scene & Deep Void Fog
    this.scene = new THREE.Scene()
    this.scene.name = 'Ankush Malothia — Celestial Space World'
    this.scene.background = CELESTIAL_PALETTE.voidBlack
    this.scene.fog = new THREE.FogExp2(0x020308, 0.0055)

    // Perspective Camera
    const aspect = this.container.clientWidth / Math.max(1, this.container.clientHeight)
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 3800)
    this.scene.add(this.camera)

    // Setup all celestial features
    this.setupLighting()
    this.setupMasterSpline()
    this.setupKerrBlackHole()
    this.setupCrystallineRibbonHighway()
    this.setupPortalRings()
    this.setupDendriteConstellations()
    this.setupCosmicStarfield()
    this.setupStellarNebulae()
    this.setupStellarNursery()
    this.setupPulsarBeacon()
    this.setupOrbitalStations()

    // Initial camera pose in orbital observation vantage
    this.updateCameraPose(0, 'loading')

    // Listeners
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('pointermove', this.handlePointerMove)

    // Shader Warmup & Loading simulation
    this.initializeAssets(options)

    // Start 60fps render loop
    this.animate(performance.now())
  }

  public setPointer(x: number, y: number): void {
    this.targetPointerX = x
    this.targetPointerY = y
  }

  private handlePointerMove = (e: PointerEvent): void => {
    this.targetPointerX = (e.clientX / window.innerWidth - 0.5) * 2.0
    this.targetPointerY = (e.clientY / window.innerHeight - 0.5) * 2.0
  }

  private setupLighting(): void {
    this.hemiLight = new THREE.HemisphereLight(0x00f0ff, 0x060919, 0.5)
    this.scene.add(this.hemiLight)

    this.photonLight = new THREE.PointLight(0x00f0ff, 6.0, 95, 1.8)
    this.scene.add(this.photonLight)
  }

  private setupMasterSpline(): void {
    const waypoints: THREE.Vector3[] = []
    const controlCount = 28

    for (let i = 0; i <= controlCount; i++) {
      const u = i / controlCount
      const z = -u * this.totalSplineLength
      const x = Math.sin(u * Math.PI * 4.0) * 48 + Math.cos(u * Math.PI * 1.5) * 22
      const y = Math.cos(u * Math.PI * 3.0) * 24 + Math.sin(u * Math.PI * 6.0) * 10
      waypoints.push(new THREE.Vector3(x, y, z))
    }

    this.curve = new THREE.CatmullRomCurve3(waypoints, false, 'catmullrom', 0.5)
    this.frenetFrames = this.curve.computeFrenetFrames(this.splineSegments, false)
  }

  /**
   * 1. The Kerr Relativistic Black Hole with Blandford-Znajek Polar Jets (Interstellar Gargantua Style)
   */
  private setupKerrBlackHole(): void {
    const planeGeo = new THREE.PlaneGeometry(240, 240)

    this.kerrMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSpin: { value: 0.94 },
        uVelocity: { value: 0 },
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
        varying vec2 vUv;
        uniform float uTime;
        uniform float uSpin;
        uniform float uVelocity;

        float kHash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float kNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(kHash(i), kHash(i + vec2(1.0, 0.0)), f.x),
            mix(kHash(i + vec2(0.0, 1.0)), kHash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }

        float kFbm4(vec2 p) {
          float v = 0.0;
          float amp = 0.5;
          mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
          for (int i = 0; i < 4; i++) {
            v += amp * kNoise(p);
            p = rot * p * 2.03 + vec2(13.7, 7.3);
            amp *= 0.5;
          }
          return v;
        }

        // Relativistic Polar Jets (Blandford-Znajek synchrotron radiation)
        vec4 computePolarJets(vec2 uv, float time, float spin, float velocity) {
          vec2 p = vec2(uv.x + uv.y * velocity * 0.02, uv.y);
          float absY = abs(p.y);
          float rJet = 0.16 + 0.44 * sqrt(max(absY, 0.001));
          
          if (abs(p.x) / rJet > 2.2) return vec4(0.0);

          float twistPhase = absY * 3.6 - time * (4.5 + spin * 3.0);
          float helixA = sin(twistPhase);
          float helixB = -helixA;

          float strandA = exp(-pow(abs(p.x / rJet - helixA * 0.62), 2.0) * 18.0) * (0.65 + 0.35 * cos(twistPhase));
          float strandB = exp(-pow(abs(p.x / rJet - helixB * 0.62), 2.0) * 18.0) * (0.65 - 0.35 * cos(twistPhase));
          
          float structure = (strandA + strandB) * exp(-pow(abs(p.x) / rJet, 2.0) * 2.4);
          float intensity = structure * smoothstep(0.38, 1.45, absY) * exp(-absY * 0.26) * (0.35 + 0.65 * spin);

          vec3 jetCol = mix(vec3(0.55, 0.22, 1.0), vec3(0.0, 0.94, 1.0), smoothstep(1.3, 0.35, abs(p.x) / rJet));
          return vec4(jetCol * intensity * 2.4, clamp(intensity, 0.0, 1.0));
        }

        void main() {
          vec2 uv = (vUv - 0.5) * 2.0;
          vec2 p = uv * 3.6;

          float frameDrag = uSpin * 0.22;
          vec2 pShifted = p - vec2(frameDrag, 0.0);
          float b = length(pShifted);

          // Critical photon capture radius
          float rShadow = 1.48 - 0.18 * uSpin * (pShifted.x / max(b, 0.001));
          float deflection = (rShadow * rShadow) / max(b * b - rShadow * 0.65, 0.04);
          vec2 lensedUv = vec2(pShifted.x, pShifted.y - sign(pShifted.y) * deflection * 0.72);
          float rLensed = length(lensedUv);

          vec3 color = vec3(0.0);

          // 1. Accretion Disk with relativistic Doppler beaming
          if (rLensed > 1.30 && rLensed < 5.8) {
            float omega = 1.0 / (pow(max(rLensed, 1.0), 1.5) + 0.15 * (1.0 - uSpin));
            float angle = atan(lensedUv.y, lensedUv.x) + uTime * 1.8 * omega;
            float turbulence = kFbm4(vec2(rLensed * 3.2, angle * 2.5));
            float intensity = smoothstep(1.30, 1.75, rLensed) * exp(-(rLensed - 1.30) * 0.45) * (0.55 + 0.45 * turbulence);

            float beta = clamp(sqrt(0.68 / max(rLensed, 1.15)) * 0.72, 0.0, 0.78);
            float cosTheta = clamp(-pShifted.x / max(b, 0.001), -1.0, 1.0);
            float dopplerFactor = 1.0 / (sqrt(1.0 - beta * beta) * (1.0 - beta * cosTheta));

            vec3 receding = vec3(1.0, 0.32, 0.06); // Amber Redshift
            vec3 approach = vec3(0.0, 0.94, 1.0);  // Electric Cyan Blueshift
            vec3 diskCol = mix(receding, approach, smoothstep(0.4, 1.6, dopplerFactor));

            color += diskCol * intensity * pow(clamp(dopplerFactor, 0.2, 3.5), 3.0);
          }

          // 2. Relativistic Polar Jets
          vec4 jets = computePolarJets(p, uTime, uSpin, uVelocity);
          color += jets.rgb;

          // 3. Luminous Photon Ring
          float photonRing = exp(-abs(b - rShadow) * 32.0) * 1.8;
          color += vec3(0.85, 0.94, 1.0) * photonRing;

          // 4. Event Horizon Blackout Core
          float horizonMask = smoothstep(rShadow * 0.96, rShadow * 1.02, b);
          color *= horizonMask;

          float alpha = clamp(length(color), 0.0, 1.0);
          if (alpha < 0.015) discard;

          gl_FragColor = vec4(color, alpha);
        }
      `,
    })

    this.kerrBlackHoleMesh = new THREE.Mesh(planeGeo, this.kerrMaterial)
    const terminusPoint = this.curve.getPointAt(0.35)
    this.kerrBlackHoleMesh.position.set(terminusPoint.x + 35, terminusPoint.y + 20, -380)
    this.scene.add(this.kerrBlackHoleMesh)
  }

  /**
   * 2. Crystalline Starlight Ribbon Highway
   */
  private setupCrystallineRibbonHighway(): void {
    const ribbonGeo = new THREE.TubeGeometry(this.curve, this.splineSegments, 3.2, 8, false)
    this.ribbonMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uVelocity: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vViewPosition;
        void main() {
          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec2 vUv;
        varying vec3 vViewPosition;
        uniform float uTime;
        uniform float uVelocity;

        void main() {
          float gridU = abs(fract(vUv.x * 70.0 - uTime * 2.2) - 0.5) / max(fwidth(vUv.x * 70.0), 0.001);
          float gridV = abs(fract(vUv.y * 10.0) - 0.5) / max(fwidth(vUv.y * 10.0), 0.001);
          float grid = 1.0 - clamp(min(gridU, gridV), 0.0, 1.0);

          float centerDist = abs(vUv.y - 0.5) * 2.0;
          float core = pow(1.0 - centerDist, 3.0) * (1.1 + abs(uVelocity) * 1.4);
          float caustics = sin(vUv.x * 140.0 + uTime * 4.0) * cos(vUv.y * 45.0 - uTime * 3.0);

          vec3 cyan = vec3(0.0, 0.94, 1.0);
          vec3 violet = vec3(0.55, 0.36, 0.96);

          vec3 color = mix(violet, cyan, vUv.y) * (grid * 0.45 + caustics * 0.25);
          color += cyan * core * 2.6;

          float alpha = clamp((1.0 - centerDist) * 0.75 + grid * 0.5 + core, 0.0, 1.0);
          float depth = length(vViewPosition);
          alpha *= (1.0 - smoothstep(110.0, 380.0, depth));

          gl_FragColor = vec4(color, alpha);
        }
      `,
    })
    this.ribbonHighwayMesh = new THREE.Mesh(ribbonGeo, this.ribbonMaterial)
    this.scene.add(this.ribbonHighwayMesh)

    // Inner glowing core
    const coreGeo = new THREE.TubeGeometry(this.curve, this.splineSegments, 0.65, 6, false)
    this.axonMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uVelocity: { value: 0 },
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
        varying vec2 vUv;
        uniform float uTime;

        void main() {
          float pulse = fract(vUv.x * 24.0 - uTime * 1.8);
          float wave = smoothstep(0.0, 0.08, pulse) * exp(-pulse * 6.5);
          vec3 color = mix(vec3(0.55, 0.36, 0.96), vec3(0.0, 0.94, 1.0), wave);
          color += vec3(1.0, 0.88, 0.48) * smoothstep(0.7, 1.0, wave);
          gl_FragColor = vec4(color * (0.35 + wave * 1.8), wave * 0.85);
        }
      `,
    })
    this.axonCoreMesh = new THREE.Mesh(coreGeo, this.axonMaterial)
    this.scene.add(this.axonCoreMesh)
  }

  /**
   * 3. Holographic Portal Rings & Dendrites
   */
  private setupPortalRings(): void {
    const ringCount = 110
    const ringGeo = new THREE.TorusGeometry(6.4, 0.16, 12, 48)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    })

    this.portalInstancedMesh = new THREE.InstancedMesh(ringGeo, ringMat, ringCount)
    const dummy = new THREE.Object3D()
    const rotMatrix = new THREE.Matrix4()

    for (let i = 0; i < ringCount; i++) {
      const u = (i + 0.5) / ringCount
      const pos = this.curve.getPointAt(u)
      const frameIdx = Math.min(Math.floor(u * this.splineSegments), this.splineSegments)

      const T = this.frenetFrames.tangents[frameIdx]
      const N = this.frenetFrames.normals[frameIdx]
      const B = this.frenetFrames.binormals[frameIdx]

      rotMatrix.makeBasis(B, N, T)
      dummy.position.copy(pos)
      dummy.rotation.setFromRotationMatrix(rotMatrix)

      const isGate = i % 5 === 0
      const scale = isGate ? 1.45 : 0.92
      dummy.scale.set(scale, scale, isGate ? 2.0 : 3.6)
      dummy.updateMatrix()

      this.portalInstancedMesh.setMatrixAt(i, dummy.matrix)
      this.portalInstancedMesh.setColorAt(
        i,
        new THREE.Color(isGate ? 0x00f0ff : 0x8b5cf6)
      )
    }

    this.portalInstancedMesh.instanceMatrix.needsUpdate = true
    if (this.portalInstancedMesh.instanceColor) {
      this.portalInstancedMesh.instanceColor.needsUpdate = true
    }
    this.scene.add(this.portalInstancedMesh)
  }

  private setupDendriteConstellations(): void {
    this.dendriteGroup = new THREE.Group()
    const branchMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
    })

    const ringCount = 110
    for (let i = 4; i < ringCount; i += 3) {
      const u = i / ringCount
      const origin = this.curve.getPointAt(u)
      const frameIdx = Math.min(Math.floor(u * this.splineSegments), this.splineSegments)
      const B = this.frenetFrames.binormals[frameIdx]
      const N = this.frenetFrames.normals[frameIdx]
      const T = this.frenetFrames.tangents[frameIdx]

      const side = i % 2 === 0 ? 1 : -1
      const p1 = origin.clone().addScaledVector(B, side * 7.5)
      const p2 = p1.clone().addScaledVector(B, side * 24).addScaledVector(N, 12).addScaledVector(T, -16)
      const p3 = p2.clone().addScaledVector(B, side * 36).addScaledVector(N, i % 4 === 0 ? 18 : -14).addScaledVector(T, -30)

      const branchCurve = new THREE.CatmullRomCurve3([origin, p1, p2, p3])
      const branchGeo = new THREE.TubeGeometry(branchCurve, 24, 0.25, 6, false)
      this.dendriteGroup.add(new THREE.Mesh(branchGeo, branchMat))
    }

    this.scene.add(this.dendriteGroup)
  }

  /**
   * 4. Cosmic Starfield & Screen-Space Warp Streaks
   */
  private setupCosmicStarfield(): void {
    const count = 2800
    const [bx, by, bz] = [360, 220, 600]

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const phases = new Float32Array(count)
    const colorSeeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * bx
      positions[i3 + 1] = (Math.random() - 0.5) * by
      positions[i3 + 2] = -Math.random() * bz

      scales[i] = 0.6 + Math.pow(Math.random(), 2.2) * 3.8
      phases[i] = Math.random() * Math.PI * 2
      colorSeeds[i] = Math.random()
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    geometry.setAttribute('aColorSeed', new THREE.BufferAttribute(colorSeeds, 1))

    this.starfieldMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uCameraZ: { value: 0 },
        uBoxZ: { value: bz },
        uVelocity: { value: 0 },
        uEntranceBoost: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
      },
      vertexShader: /* glsl */ `
        attribute float aScale;
        attribute float aPhase;
        attribute float aColorSeed;

        uniform float uTime;
        uniform float uCameraZ;
        uniform float uBoxZ;
        uniform float uVelocity;
        uniform float uEntranceBoost;
        uniform float uPixelRatio;

        varying float vColorSeed;
        varying float vTwinkle;
        varying float vDepthFade;
        varying vec2 vStreakDir;
        varying float vStreakRatio;

        void main() {
          vColorSeed = aColorSeed;

          vec3 pos = position;
          float relZ = mod(pos.z - uCameraZ, uBoxZ) - uBoxZ;
          pos.z = uCameraZ + relZ;

          pos.x += sin(uTime * 0.65 + aPhase) * 1.5;
          pos.y += cos(uTime * 0.55 + aPhase * 1.3) * 1.5;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          float dist = max(-mvPosition.z, 1.0);

          float warpSpeed = clamp(abs(uVelocity) * 1.6 + uEntranceBoost * 4.2, 0.0, 7.0);

          vec4 clipCurr = projectionMatrix * mvPosition;
          vec4 clipTail = projectionMatrix * (mvPosition + vec4(0.0, 0.0, warpSpeed * 5.0, 0.0));
          vec2 ndcCurr = clipCurr.xy / max(clipCurr.w, 0.0001);
          vec2 ndcTail = clipTail.xy / max(clipTail.w, 0.0001);
          vec2 screenDelta = ndcTail - ndcCurr;

          float deltaLen = length(screenDelta);
          vStreakDir = (deltaLen > 0.0001) ? (screenDelta / deltaLen) : vec2(0.0, 1.0);
          vStreakDir.y = -vStreakDir.y;

          vStreakRatio = 1.0 + warpSpeed * 3.2;

          float basePointSize = (aScale * 195.0 / dist) * uPixelRatio;
          gl_PointSize = clamp(basePointSize * vStreakRatio, 2.0, 140.0);

          vTwinkle = 0.6 + 0.4 * sin(uTime * (2.2 + aScale) + aPhase * 6.2831);
          float nearFade = smoothstep(2.0, 18.0, dist);
          float farFade = 1.0 - smoothstep(uBoxZ * 0.75, uBoxZ * 0.98, dist);
          vDepthFade = nearFade * farFade;

          gl_Position = clipCurr;
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying float vColorSeed;
        varying float vTwinkle;
        varying float vDepthFade;
        varying vec2 vStreakDir;
        varying float vStreakRatio;

        void main() {
          if (vDepthFade <= 0.001) discard;

          vec2 uv = (gl_PointCoord - 0.5) * 2.0;
          vec2 perpDir = vec2(-vStreakDir.y, vStreakDir.x);
          float along = dot(uv, vStreakDir);
          float across = dot(uv, perpDir);

          float halfSpan = clamp((vStreakRatio - 1.0) / vStreakRatio, 0.0, 0.88);
          float clampedAlong = clamp(along, -halfSpan, halfSpan);
          float dist = length(vec2(along - clampedAlong, across * vStreakRatio));

          float core = exp(-pow(dist * 2.6, 2.0));
          float halo = exp(-pow(dist * 1.2, 1.8)) * 0.35;
          float alpha = (core + halo) * vTwinkle * vDepthFade;

          if (alpha <= 0.005) discard;

          vec3 color = vec3(0.0, 0.94, 1.0); // Cyan
          if (vColorSeed > 0.65) color = vec3(0.55, 0.36, 0.96); // Violet
          else if (vColorSeed > 0.45) color = vec3(1.0, 0.88, 0.48); // Starlight Gold

          color = mix(color, vec3(1.0), core * 0.65);
          gl_FragColor = vec4(color, alpha);
        }
      `,
    })

    this.starfieldPoints = new THREE.Points(geometry, this.starfieldMaterial)
    this.scene.add(this.starfieldPoints)
  }

  /**
   * 5. Multi-Layered Volumetric Astrophysical Nebulae (Carina / Orion Complex)
   */
  private setupStellarNebulae(): void {
    const layerCount = 14
    const planeGeo = new THREE.PlaneGeometry(360, 260, 1, 1)

    // Base Shader definition with 3D Simplex FBM, H-alpha, O-III, and dark absorption dust lanes
    const createNebulaMaterial = (layerIndex: number) => {
      return new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uLayer: { value: layerIndex },
        },
        vertexShader: /* glsl */ `
          varying vec3 vWorldPosition;
          varying vec2 vUv;
          uniform float uTime;
          uniform float uLayer;

          void main() {
            vUv = uv;
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            worldPos.y += sin(worldPos.x * 0.015 + uTime * 0.3 + uLayer) * 5.0;
            vWorldPosition = worldPos.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `,
        fragmentShader: /* glsl */ `
          precision highp float;
          varying vec3 vWorldPosition;
          varying vec2 vUv;
          uniform float uTime;
          uniform float uLayer;

          float hash(vec3 p) {
            p = fract(p * vec3(443.89, 441.27, 419.19));
            p += dot(p, p.yzx + 19.19);
            return fract((p.x + p.y) * p.z);
          }

          float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(mix(hash(i + vec3(0.0,0.0,0.0)), hash(i + vec3(1.0,0.0,0.0)), f.x),
                  mix(hash(i + vec3(0.0,1.0,0.0)), hash(i + vec3(1.0,1.0,0.0)), f.x), f.y),
              mix(mix(hash(i + vec3(0.0,0.0,1.0)), hash(i + vec3(1.0,0.0,1.0)), f.x),
                  mix(hash(i + vec3(0.0,1.0,1.0)), hash(i + vec3(1.0,1.0,1.0)), f.x), f.y), f.z);
          }

          float fbm(vec3 p) {
            float v = 0.0;
            float a = 0.5;
            vec3 shift = vec3(100.0);
            for (int i = 0; i < 5; i++) {
              v += a * noise(p);
              p = p * 2.04 + shift;
              a *= 0.5;
            }
            return v;
          }

          void main() {
            vec3 p = vWorldPosition * 0.007 + vec3(uLayer * 1.6, 0.0, uTime * 0.015);

            // 1. Multi-layered Volumetric Gas Density
            float baseNoise = fbm(p);
            float detailNoise = fbm(p * 2.3 - vec3(1.4, 0.9, 1.2));
            float density = smoothstep(0.16, 0.84, baseNoise * 0.65 + detailNoise * 0.35);

            // 2. Dark Interstellar Dust Absorption Lanes (creates realistic Carina/Pillars silhouettes)
            float dustNoise = fbm(p * 3.4 + vec3(4.2, 8.1, 2.5));
            float dustMask = smoothstep(0.36, 0.68, dustNoise);
            density *= (1.0 - dustMask * 0.85);

            if (density < 0.008) discard;

            // 3. Astrophysical Color Stratification:
            // H-Alpha (hot ionized hydrogen: deep crimson/magenta)
            // O-III (doubly-ionized oxygen: vibrant turquoise/cyan)
            // S-II (ionized sulfur: warm amber gold)
            vec3 hAlpha = vec3(1.0, 0.10, 0.38);
            vec3 oThree = vec3(0.0, 0.94, 1.0);
            vec3 sTwo   = vec3(1.0, 0.74, 0.10);

            vec3 gasColor = mix(hAlpha, oThree, smoothstep(0.22, 0.78, detailNoise));
            gasColor = mix(gasColor, sTwo, smoothstep(0.52, 0.92, baseNoise));

            // 4. Stellar Nursery Core Glow (Internal baby star clusters illuminating the cloud)
            vec3 nurseryPos = vec3(sin(uLayer * 2.4) * 70.0, 15.0 + cos(uLayer * 1.7) * 35.0, -200.0);
            float coreGlow = exp(-length(vWorldPosition - nurseryPos) * 0.012);
            gasColor += vec3(1.0, 0.92, 0.82) * coreGlow * 2.4;

            // Soft edge vignette
            vec2 centerDist = (vUv - 0.5) * 2.0;
            float radialFalloff = clamp(1.0 - dot(centerDist, centerDist), 0.0, 1.0);
            radialFalloff = pow(radialFalloff, 1.6);

            float alpha = density * radialFalloff * 0.45;

            gl_FragColor = vec4(gasColor * (density * 1.5 + coreGlow), alpha);
          }
        `,
      })
    }

    for (let i = 0; i < layerCount; i++) {
      const mat = createNebulaMaterial(i)
      this.nebulaMaterials.push(mat)

      const mesh = new THREE.Mesh(planeGeo, mat)
      const z = -35 - (i / layerCount) * 580
      const x = (Math.sin(i * 1.8) * 140) + (Math.random() - 0.5) * 60
      const y = (Math.cos(i * 1.4) * 60) + 15
      mesh.position.set(x, y, z)
      mesh.rotation.z = (i * 0.45)
      const scale = 1.4 + (i % 3) * 0.4
      mesh.scale.set(scale, scale, scale)

      this.nebulaGroup.add(mesh)
      this.nebulaMeshes.push(mesh)
    }

    this.scene.add(this.nebulaGroup)
  }

  /**
   * 6. Embedded Stellar Nursery Clusters (Baby O/B type stars nested inside the nebula)
   */
  private setupStellarNursery(): void {
    const count = 380
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const colorSeeds = new Float32Array(count)
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3] = (Math.random() - 0.5) * 180
      pos[i3 + 1] = (Math.random() - 0.5) * 100 + 15
      pos[i3 + 2] = -80 - Math.random() * 380

      sizes[i] = 1.4 + Math.pow(Math.random(), 2.0) * 4.6
      colorSeeds[i] = Math.random()
      phases[i] = Math.random() * Math.PI * 2
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aColorSeed', new THREE.BufferAttribute(colorSeeds, 1))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))

    this.stellarNurseryMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
      },
      vertexShader: /* glsl */ `
        attribute float aSize;
        attribute float aColorSeed;
        attribute float aPhase;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vColorSeed;
        varying float vTwinkle;

        void main() {
          vColorSeed = aColorSeed;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float dist = max(-mvPosition.z, 1.0);
          gl_PointSize = clamp((aSize * 240.0 / dist) * uPixelRatio, 2.0, 95.0);
          vTwinkle = 0.55 + 0.45 * sin(uTime * 3.5 + aPhase);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying float vColorSeed;
        varying float vTwinkle;

        void main() {
          vec2 uv = (gl_PointCoord - 0.5) * 2.0;
          float dist = length(uv);
          if (dist > 1.0) discard;

          float core = exp(-pow(dist * 3.2, 2.0));
          float halo = exp(-pow(dist * 1.4, 1.6)) * 0.5;

          // 4-point cross diffraction spikes on bright stars
          float spikes = max(
            exp(-pow(abs(uv.x) * 14.0, 1.2)) * exp(-pow(abs(uv.y) * 2.2, 1.5)),
            exp(-pow(abs(uv.y) * 14.0, 1.2)) * exp(-pow(abs(uv.x) * 2.2, 1.5))
          ) * 0.45;

          float alpha = (core + halo + spikes) * vTwinkle;
          if (alpha <= 0.005) discard;

          vec3 starCol = vec3(1.0, 0.95, 0.85); // Warm white
          if (vColorSeed > 0.6) starCol = vec3(0.55, 0.85, 1.0); // O-type electric blue
          else if (vColorSeed > 0.3) starCol = vec3(1.0, 0.78, 0.35); // Golden dwarf

          starCol = mix(starCol, vec3(1.0), core * 0.8);
          gl_FragColor = vec4(starCol, alpha);
        }
      `,
    })

    this.stellarNurseryPoints = new THREE.Points(geo, this.stellarNurseryMaterial)
    this.scene.add(this.stellarNurseryPoints)
  }

  /**
   * 7. Cosmic Pulsar / Magnetar Beacon (Lighthouse of the Cosmos)
   */
  private setupPulsarBeacon(): void {
    this.pulsarGroup = new THREE.Group()
    const stationPos = this.curve.getPointAt(0.38)
    this.pulsarGroup.position.set(stationPos.x + 32, stationPos.y + 18, stationPos.z - 25)

    // Pulsar core
    const coreGeo = new THREE.SphereGeometry(1.6, 24, 24)
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.95,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    this.pulsarGroup.add(coreMesh)

    // Radiation beam cones
    const coneGeo = new THREE.ConeGeometry(9.0, 75.0, 24, 1, true)
    coneGeo.translate(0, 37.5, 0)
    const beamMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
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
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          float along = vUv.y;
          float intensity = (1.0 - along) * exp(-along * 1.6);
          float pulse = 0.75 + 0.25 * sin(uTime * 14.0);
          vec3 beamCol = mix(vec3(0.0, 0.94, 1.0), vec3(0.65, 0.25, 1.0), along);
          gl_FragColor = vec4(beamCol * intensity * pulse * 2.4, intensity * pulse * 0.45);
        }
      `,
    })

    this.pulsarBeamMeshNorth = new THREE.Mesh(coneGeo, beamMat)
    this.pulsarBeamMeshSouth = new THREE.Mesh(coneGeo, beamMat)
    this.pulsarBeamMeshSouth.rotation.x = Math.PI

    this.pulsarGroup.add(this.pulsarBeamMeshNorth)
    this.pulsarGroup.add(this.pulsarBeamMeshSouth)

    const pulsarLight = new THREE.PointLight(0x00f0ff, 5.0, 90, 2.0)
    this.pulsarGroup.add(pulsarLight)

    this.scene.add(this.pulsarGroup)
  }

  /**
   * 8. Floating Orbital Monolith Stations
   */
  private setupOrbitalStations(): void {
    const stationSpecs = [
      { u: 0.16, title: 'STATION 01 // HYPERION STREAM' },
      { u: 0.40, title: 'STATION 02 // ARGON RUNTIME' },
      { u: 0.65, title: 'STATION 03 // AETHER SPATIAL ENGINE' },
      { u: 0.88, title: 'STATION 04 // CHRONOS NEURAL MATRIX' },
    ]

    const monolithGeo = new THREE.BoxGeometry(2.4, 7.8, 2.4)
    const monolithMat = new THREE.MeshStandardMaterial({
      color: 0x070c14,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.25,
    })

    const ringGeo = new THREE.TorusGeometry(5.2, 0.12, 12, 48)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffdf7a,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    })

    stationSpecs.forEach((spec) => {
      const pos = this.curve.getPointAt(spec.u)
      const group = new THREE.Group()
      group.position.copy(pos)

      // Sleek Monolith Core
      const monolithMesh = new THREE.Mesh(monolithGeo, monolithMat)
      group.add(monolithMesh)

      // Orbiting Golden Ring
      const ringMesh = new THREE.Mesh(ringGeo, ringMat)
      ringMesh.rotation.x = Math.PI / 4
      group.add(ringMesh)

      // Beacon Point Light
      const beaconLight = new THREE.PointLight(0x00f0ff, 3.5, 60, 2.0)
      group.add(beaconLight)

      this.scene.add(group)

      this.orbitalStations.push({
        group,
        monolithMesh,
        ringMesh,
        beaconLight,
        uPos: spec.u,
        title: spec.title,
      })
    })
  }

  private async initializeAssets(options?: WorldEngineOptions): Promise<void> {
    const report = (p: number, msg: string) => {
      options?.onLoadProgress?.(p, msg)
    }

    try {
      report(8, 'Aligning deep space observatories & orbital telemetry...')
      await new Promise((r) => setTimeout(r, 140))

      report(28, 'Igniting relativistic warp drive & Kerr accretion disc...')
      await new Promise((r) => setTimeout(r, 180))

      report(55, 'Mapping gravitational lensing & stellar coordinate grid...')
      await new Promise((r) => setTimeout(r, 200))

      report(82, 'Synchronizing Ankush Malothia’s core architecture systems...')
      await this.renderer.compileAsync(this.scene, this.camera)

      report(100, 'Cosmic portal locked. Step into Ankush’s universe.')
      options?.onReady?.()
    } catch (e) {
      console.error('Initialization error:', e)
      report(100, 'Cosmic portal locked.')
      options?.onReady?.()
    }
  }

  public setMode(mode: WorldMode): void {
    this.mode = mode
    if (mode === 'intro') {
      this.introTime = 0
    }
  }

  public setScrollProgress(progress: number): void {
    this.scrollProgress = THREE.MathUtils.clamp(progress, 0, 1)
  }

  public updateCameraPose(tIntro: number, mode: WorldMode): void {
    if (mode === 'loading') {
      // High-vantage orbital observation overlooking the living nebula, highway & black hole
      const t = (performance.now() - this.startTime) * 0.0004
      const radius = 32.0
      const cameraX = Math.sin(t * 0.6) * radius + this.pointerX * 7.5
      const cameraY = 13.0 + Math.cos(t * 0.4) * 4.5 - this.pointerY * 5.0
      const cameraZ = 28.0 + Math.sin(t * 0.25) * 6.0

      this.camera.position.set(cameraX, cameraY, cameraZ)
      this.desiredLookTarget.set(0, 3.5, -300.0)
      this.camera.fov = 50.0
    } else if (mode === 'intro') {
      // Forward Warp Fly-Through into Ankush's space domain
      const uFlight = tIntro * tIntro * (3 - 2 * tIntro) // Smoothstep easing
      const uSpline = THREE.MathUtils.lerp(0.001, 0.058, uFlight)

      const spinePoint = this.curve.getPointAt(uSpline)
      const tangent = this.curve.getTangentAt(uSpline)
      const normal = this.frenetFrames.normals[Math.min(Math.floor(uSpline * this.splineSegments), this.splineSegments)]

      const startPos = new THREE.Vector3(0 + this.pointerX * 5.0, 13.0 - this.pointerY * 4.0, 28.0)
      const highwayPos = spinePoint.clone().addScaledVector(normal, THREE.MathUtils.lerp(5.2, 2.6, uFlight))

      // Plunge from observation orbit down onto the highway
      const currentCamPos = new THREE.Vector3().lerpVectors(startPos, highwayPos, uFlight)
      this.camera.position.copy(currentCamPos)

      this.desiredLookTarget.copy(spinePoint).addScaledVector(tangent, THREE.MathUtils.lerp(300, 48, uFlight))
      // Transient FOV warp stretch
      this.camera.fov = THREE.MathUtils.lerp(50.0, 68.0, Math.sin(uFlight * Math.PI))
    } else if (mode === 'transition' || mode === 'journey') {
      const uSpline = THREE.MathUtils.lerp(0.058, 0.96, this.smoothScrollProgress)
      const spinePoint = this.curve.getPointAt(uSpline)
      const tangent = this.curve.getTangentAt(uSpline)
      const normal = this.frenetFrames.normals[Math.min(Math.floor(uSpline * this.splineSegments), this.splineSegments)]
      const binormal = this.frenetFrames.binormals[Math.min(Math.floor(uSpline * this.splineSegments), this.splineSegments)]

      const cameraPos = spinePoint.clone()
        .addScaledVector(normal, 2.6 - this.pointerY * 1.4)
        .addScaledVector(binormal, this.pointerX * 2.2)

      this.camera.position.copy(cameraPos)
      this.desiredLookTarget.copy(spinePoint).addScaledVector(tangent, 50)
      this.camera.fov = 55.0
    }

    this.currentLookTarget.lerp(this.desiredLookTarget, 0.12)
    this.camera.lookAt(this.currentLookTarget)
    this.camera.updateProjectionMatrix()
  }

  private animate = (now: number): void => {
    if (this.isDisposed) return
    this.rafId = requestAnimationFrame(this.animate)

    const dt = Math.min((now - this.lastFrameTime) / 1000, 0.1)
    this.lastFrameTime = now
    const timeSec = (now - this.startTime) / 1000

    // Smooth pointer lerp
    this.pointerX += (this.targetPointerX - this.pointerX) * 0.08
    this.pointerY += (this.targetPointerY - this.pointerY) * 0.08

    // Compute velocity
    const progressDelta = this.scrollProgress - this.lastScrollProgress
    this.lastScrollProgress = this.scrollProgress
    this.scrollVelocity += (progressDelta / Math.max(dt, 0.001) - this.scrollVelocity) * 0.15

    // Smooth scroll easing
    this.smoothScrollProgress += (this.scrollProgress - this.smoothScrollProgress) * (1 - Math.exp(-dt * 4.5))

    let introT = 0
    let entranceBoost = 0
    if (this.mode === 'intro') {
      this.introTime += dt
      introT = THREE.MathUtils.clamp(this.introTime / this.introDuration, 0, 1)
      entranceBoost = Math.sin(introT * Math.PI) * 1.8
    }

    // Camera Kinematics
    this.updateCameraPose(introT, this.mode)

    // Update Kerr Black Hole with Polar Jets
    if (this.kerrMaterial) {
      this.kerrMaterial.uniforms.uTime.value = timeSec
      this.kerrMaterial.uniforms.uVelocity.value = this.scrollVelocity + (this.mode === 'intro' ? 1.5 : 0)
      this.kerrBlackHoleMesh.lookAt(this.camera.position)
    }

    // Update Crystalline Ribbon Highway
    if (this.ribbonMaterial) {
      this.ribbonMaterial.uniforms.uTime.value = timeSec
      this.ribbonMaterial.uniforms.uVelocity.value = this.scrollVelocity + (this.mode === 'intro' ? 2.0 : 0)
    }
    if (this.axonMaterial) {
      this.axonMaterial.uniforms.uTime.value = timeSec
      this.axonMaterial.uniforms.uVelocity.value = this.scrollVelocity
    }

    // Update Starfield & Warp Streaks
    if (this.starfieldMaterial) {
      this.starfieldMaterial.uniforms.uTime.value = timeSec
      this.starfieldMaterial.uniforms.uCameraZ.value = this.camera.position.z
      this.starfieldMaterial.uniforms.uVelocity.value = this.scrollVelocity
      this.starfieldMaterial.uniforms.uEntranceBoost.value = entranceBoost
    }

    // Update Volumetric Nebulae
    this.nebulaMaterials.forEach((mat) => {
      mat.uniforms.uTime.value = timeSec
    })
    this.nebulaMeshes.forEach((m, idx) => {
      m.rotation.z += idx % 2 === 0 ? 0.00025 : -0.00025
    })

    // Update Stellar Nursery
    if (this.stellarNurseryMaterial) {
      this.stellarNurseryMaterial.uniforms.uTime.value = timeSec
    }

    // Update Pulsar Magnetar
    if (this.pulsarGroup) {
      this.pulsarGroup.rotation.y = timeSec * 2.4
      this.pulsarGroup.rotation.x = Math.sin(timeSec * 0.8) * 0.35
    }

    // Update Photon Light
    const currentUSpline = this.mode === 'loading'
      ? 0.015
      : this.mode === 'intro'
      ? THREE.MathUtils.lerp(0.01, 0.065, introT)
      : THREE.MathUtils.lerp(0.065, 0.98, this.smoothScrollProgress)

    const photonPoint = this.curve.getPointAt(Math.min(1.0, currentUSpline + 0.025))
    this.photonLight.position.copy(photonPoint).add(new THREE.Vector3(0, 3.0, 0))

    // Update Orbital Monolith Stations
    this.orbitalStations.forEach((station) => {
      station.monolithMesh.rotation.y = timeSec * 0.45
      station.ringMesh.rotation.z = timeSec * 0.65

      const stationZ = station.group.position.z
      const dist = Math.abs(this.camera.position.z - stationZ)
      const proximity = Math.max(0.0, 1.0 - dist / 60.0)

      station.beaconLight.intensity = 3.0 + proximity * 10.0
      const scale = 1.0 + proximity * 0.25
      station.group.scale.set(scale, scale, scale)
    })

    this.renderer.render(this.scene, this.camera)
  }

  private handleResize = (): void => {
    if (!this.container || this.isDisposed) return
    const w = this.container.clientWidth
    const h = Math.max(1, this.container.clientHeight)
    this.renderer.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  public dispose(): void {
    this.isDisposed = true
    cancelAnimationFrame(this.rafId)
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('pointermove', this.handlePointerMove)

    this.renderer.dispose()
    if (this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas)
    }
  }
}
