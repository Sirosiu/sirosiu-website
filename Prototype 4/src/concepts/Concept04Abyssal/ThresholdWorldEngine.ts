import * as THREE from 'three'

export type WorldMode = 'loading' | 'intro' | 'transition' | 'journey'

export interface WorldEngineOptions {
  onLoadProgress?: (percent: number, message: string) => void
  onReady?: () => void
}

export const COSMIC_SYNAPSE_PALETTE = {
  obsidianVoid: new THREE.Color(0x020308),
  abyssalIndigo: new THREE.Color(0x090d24),
  synapticCyan: new THREE.Color(0x00f0ff),
  bioViolet: new THREE.Color(0x8b5cf6),
  somaGold: new THREE.Color(0xffdf7a),
  membraneSlate: new THREE.Color(0x1e293b),
} as const

export class ThresholdWorldEngine {
  private container: HTMLElement
  private canvas: HTMLCanvasElement
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private rafId = 0
  private isDisposed = false

  // Curve and Kinematics
  private curve!: THREE.CatmullRomCurve3
  private frenetFrames!: {
    tangents: THREE.Vector3[]
    normals: THREE.Vector3[]
    binormals: THREE.Vector3[]
  }
  private totalSplineLength = 1200
  private splineSegments = 400

  // 3D Meshes & Shader Materials
  private axonCoreMesh!: THREE.Mesh
  private axonMaterial!: THREE.ShaderMaterial
  private myelinInstancedMesh!: THREE.InstancedMesh
  private dendriteGroup!: THREE.Group
  private starfieldPoints!: THREE.Points
  private starfieldMaterial!: THREE.ShaderMaterial
  private nebulaGroup: THREE.Group = new THREE.Group()
  private nebulaMaterial!: THREE.ShaderMaterial
  private nebulaMeshes: THREE.Mesh[] = []

  // Landmark Soma Nuclei
  private somaLandmarks: Array<{
    group: THREE.Group
    coreMesh: THREE.Mesh
    wireMesh: THREE.Mesh
    light: THREE.PointLight
    vesicles: THREE.Points
    uPos: number
  }> = []

  // Dynamic Camera Rig & Spike Light
  private spikeLight!: THREE.PointLight
  private hemiLight!: THREE.HemisphereLight

  // State Management
  private mode: WorldMode = 'loading'
  private introTime = 0
  private introDuration = 8.5
  private scrollProgress = 0
  private smoothScrollProgress = 0
  private scrollVelocity = 0
  private lastScrollProgress = 0

  // Look target vectors
  private currentLookTarget = new THREE.Vector3()
  private desiredLookTarget = new THREE.Vector3()

  private startTime = performance.now()
  private lastFrameTime = performance.now()

  constructor(container: HTMLElement, options?: WorldEngineOptions) {
    this.container = container

    // 1. Canvas & WebGL Renderer
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
    this.renderer.toneMappingExposure = 1.2
    this.renderer.setClearColor(COSMIC_SYNAPSE_PALETTE.obsidianVoid, 1.0)

    // 2. Scene & Deep Space Cosmic Fog
    this.scene = new THREE.Scene()
    this.scene.name = 'Cosmic-Synaptic Neural Highway'
    this.scene.background = COSMIC_SYNAPSE_PALETTE.obsidianVoid
    this.scene.fog = new THREE.FogExp2(0x020308, 0.009)

    // 3. Camera Setup
    const aspect = this.container.clientWidth / Math.max(1, this.container.clientHeight)
    this.camera = new THREE.PerspectiveCamera(52, aspect, 0.1, 3000)
    this.scene.add(this.camera)

    // 4. Build Systems
    this.setupLighting()
    this.setupMasterSpline()
    this.setupAxonCore()
    this.setupMyelinNodes()
    this.setupDendriteArbors()
    this.setupCosmicStarfield()
    this.setupCorticalNebulae()
    this.setupSomaLandmarks()

    // 5. Initial Pose
    this.updateCameraPose(0, 'loading')

    window.addEventListener('resize', this.handleResize)

    // Warmup shaders
    this.initializeAssets(options)

    // Start render loop
    this.animate(performance.now())
  }

  private setupLighting(): void {
    this.hemiLight = new THREE.HemisphereLight(0x00f0ff, 0x090d24, 0.45)
    this.scene.add(this.hemiLight)

    // Traveling action potential spike light
    this.spikeLight = new THREE.PointLight(0x00f0ff, 4.5, 75, 1.8)
    this.scene.add(this.spikeLight)
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

  private setupAxonCore(): void {
    const tubeGeo = new THREE.TubeGeometry(this.curve, this.splineSegments, 1.8, 16, false)

    this.axonMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uVelocity: { value: 0 },
        uColorSlate: { value: COSMIC_SYNAPSE_PALETTE.membraneSlate },
        uColorCyan: { value: COSMIC_SYNAPSE_PALETTE.synapticCyan },
        uColorViolet: { value: COSMIC_SYNAPSE_PALETTE.bioViolet },
        uColorGold: { value: COSMIC_SYNAPSE_PALETTE.somaGold },
        uFogColor: { value: COSMIC_SYNAPSE_PALETTE.obsidianVoid },
        uFogDensity: { value: 0.009 },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uScroll;
        uniform float uVelocity;

        varying vec2 vUv;
        varying vec3 vViewPosition;
        varying vec3 vNormalView;
        varying float vSpikeAmplitude;

        float computeActionPotential(float u, float time, float scroll, float vel) {
          float phase = fract(u * 22.0 - time * (1.4 + abs(vel) * 2.2) - scroll * 15.0);
          float depolarization = smoothstep(0.0, 0.06, phase) * exp(-phase * 7.5);
          return depolarization;
        }

        void main() {
          vUv = uv;

          float primarySpike = computeActionPotential(uv.x, uTime, uScroll, uVelocity);
          float harmonic = computeActionPotential(uv.x * 0.5 + 0.25, uTime * 0.7, uScroll, uVelocity);
          vSpikeAmplitude = clamp(primarySpike + harmonic * 0.45, 0.0, 1.5);

          float radialAngle = uv.y * 6.2831853;
          float helixRipple = sin(uv.x * 160.0 + radialAngle * 3.0 - uTime * 6.0) * 0.06;
          float swell = vSpikeAmplitude * (0.32 + min(abs(uVelocity), 2.5) * 0.16) + helixRipple;

          vec3 displacedPos = position + normal * swell;

          vec4 mvPosition = modelViewMatrix * vec4(displacedPos, 1.0);
          vViewPosition = -mvPosition.xyz;
          vNormalView = normalize(normalMatrix * normal);

          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;

        uniform float uTime;
        uniform float uVelocity;
        uniform vec3 uColorSlate;
        uniform vec3 uColorCyan;
        uniform vec3 uColorViolet;
        uniform vec3 uColorGold;
        uniform vec3 uFogColor;
        uniform float uFogDensity;

        varying vec2 vUv;
        varying vec3 vViewPosition;
        varying vec3 vNormalView;
        varying float vSpikeAmplitude;

        void main() {
          vec3 N = normalize(vNormalView);
          vec3 V = normalize(vViewPosition);

          float cosTheta = abs(dot(N, V));
          float fresnel = pow(1.0 - cosTheta, 2.6);
          float coreMask = pow(cosTheta, 1.5);

          float angle = vUv.y * 6.2831853;
          float filaments = pow(0.5 + 0.5 * sin(angle * 8.0 + vUv.x * 120.0 - uTime * 4.0), 3.0);
          float nodesOfRanvier = smoothstep(0.92, 1.0, sin(vUv.x * 320.0));

          vec3 color = uColorSlate * (0.35 + 0.65 * filaments);

          float cyanDrive = (0.24 + vSpikeAmplitude * 1.85) * (coreMask + filaments * 0.5);
          color += uColorCyan * cyanDrive;

          float auraPulse = 0.65 + 0.35 * sin(vUv.x * 60.0 - uTime * 3.2);
          color += uColorViolet * fresnel * (0.9 + vSpikeAmplitude * 1.5 + abs(uVelocity) * 0.4) * auraPulse;

          float crest = smoothstep(0.62, 1.15, vSpikeAmplitude);
          color += uColorGold * (crest * 1.4 + nodesOfRanvier * vSpikeAmplitude * 0.85);

          float depth = length(vViewPosition);
          float fogFactor = clamp(1.0 - exp(-uFogDensity * uFogDensity * depth * depth), 0.0, 1.0);
          color = mix(color, uFogColor, fogFactor);

          float alpha = clamp(0.6 + fresnel * 0.4 + vSpikeAmplitude * 0.4, 0.0, 1.0) * (1.0 - fogFactor * 0.85);
          gl_FragColor = vec4(color, alpha);
        }
      `,
    })

    this.axonCoreMesh = new THREE.Mesh(tubeGeo, this.axonMaterial)
    this.scene.add(this.axonCoreMesh)
  }

  private setupMyelinNodes(): void {
    const ringCount = 110
    const ringGeo = new THREE.TorusGeometry(6.2, 0.16, 12, 48)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    })

    this.myelinInstancedMesh = new THREE.InstancedMesh(ringGeo, ringMat, ringCount)
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

      // Every 5th ring is a wider, intense cyan Node of Ranvier gate
      const isRanvierNode = i % 5 === 0
      const scale = isRanvierNode ? 1.45 : 0.95
      dummy.scale.set(scale, scale, isRanvierNode ? 2.0 : 3.8)
      dummy.updateMatrix()
      this.myelinInstancedMesh.setMatrixAt(i, dummy.matrix)
      this.myelinInstancedMesh.setColorAt(
        i,
        new THREE.Color(isRanvierNode ? 0x00f0ff : 0x8b5cf6)
      )
    }

    this.myelinInstancedMesh.instanceMatrix.needsUpdate = true
    if (this.myelinInstancedMesh.instanceColor) {
      this.myelinInstancedMesh.instanceColor.needsUpdate = true
    }
    this.scene.add(this.myelinInstancedMesh)
  }

  private setupDendriteArbors(): void {
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
      const p2 = p1.clone().addScaledVector(B, side * 22).addScaledVector(N, 10).addScaledVector(T, -14)
      const p3 = p2.clone().addScaledVector(B, side * 32).addScaledVector(N, i % 4 === 0 ? 16 : -12).addScaledVector(T, -26)

      const branchCurve = new THREE.CatmullRomCurve3([origin, p1, p2, p3])
      const branchGeo = new THREE.TubeGeometry(branchCurve, 24, 0.26, 6, false)
      this.dendriteGroup.add(new THREE.Mesh(branchGeo, branchMat))
    }

    this.scene.add(this.dendriteGroup)
  }

  private setupCosmicStarfield(): void {
    const count = 2200
    const [bx, by, bz] = [280, 180, 500]

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

      scales[i] = 0.6 + Math.pow(Math.random(), 2.2) * 3.6
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
        uColorCyan: { value: COSMIC_SYNAPSE_PALETTE.synapticCyan },
        uColorViolet: { value: COSMIC_SYNAPSE_PALETTE.bioViolet },
        uColorGold: { value: COSMIC_SYNAPSE_PALETTE.somaGold },
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

        varying float vPhase;
        varying float vColorSeed;
        varying float vTwinkle;
        varying float vDepthFade;
        varying vec2 vStreakDir;
        varying float vStreakRatio;

        void main() {
          vPhase = aPhase;
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

          vStreakRatio = 1.0 + warpSpeed * 3.0;

          float basePointSize = (aScale * 190.0 / dist) * uPixelRatio;
          gl_PointSize = clamp(basePointSize * vStreakRatio, 2.0, 130.0);

          vTwinkle = 0.6 + 0.4 * sin(uTime * (2.2 + aScale) + aPhase * 6.2831);
          float nearFade = smoothstep(2.0, 18.0, dist);
          float farFade = 1.0 - smoothstep(uBoxZ * 0.75, uBoxZ * 0.98, dist);
          vDepthFade = nearFade * farFade;

          gl_Position = clipCurr;
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;

        uniform vec3 uColorCyan;
        uniform vec3 uColorViolet;
        uniform vec3 uColorGold;

        varying float vPhase;
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

          vec3 color = uColorCyan;
          if (vColorSeed > 0.65) color = uColorViolet;
          else if (vColorSeed > 0.45) color = uColorGold;

          color = mix(color, vec3(1.0), core * 0.6);
          gl_FragColor = vec4(color, alpha);
        }
      `,
    })

    this.starfieldPoints = new THREE.Points(geometry, this.starfieldMaterial)
    this.scene.add(this.starfieldPoints)
  }

  private setupCorticalNebulae(): void {
    const planeGeo = new THREE.PlaneGeometry(220, 220, 1, 1)

    this.nebulaMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uColorTeal: { value: COSMIC_SYNAPSE_PALETTE.synapticCyan },
        uColorViolet: { value: COSMIC_SYNAPSE_PALETTE.bioViolet },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        varying vec2 vUv;
        varying float vNoiseMod;

        float noise(vec2 p) {
          return sin(p.x * 1.5 + uTime * 0.2) * cos(p.y * 1.5 - uTime * 0.15);
        }

        void main() {
          vUv = uv;
          vec3 pos = position;
          float n = noise(pos.xy * 0.02);
          pos.z += n * 18.0;
          vNoiseMod = n;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform vec3 uColorTeal;
        uniform vec3 uColorViolet;
        uniform float uTime;

        varying vec2 vUv;
        varying float vNoiseMod;

        void main() {
          vec2 center = vUv - 0.5;
          float dist = length(center);
          float radial = max(0.0, 1.0 - dist * 2.0);
          radial = pow(radial, 1.8);

          float pattern = sin(vUv.x * 12.0 + uTime * 0.4) * cos(vUv.y * 12.0 - uTime * 0.3);
          float intensity = smoothstep(0.1, 0.9, radial * (0.6 + 0.4 * pattern + vNoiseMod * 0.3));

          vec3 color = mix(uColorViolet, uColorTeal, vUv.x + vNoiseMod * 0.2);
          gl_FragColor = vec4(color, intensity * 0.22);
        }
      `,
    })

    const count = 14
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(planeGeo, this.nebulaMaterial)
      const z = -60 - (i / count) * 1100
      const x = (Math.random() - 0.5) * 380
      const y = (Math.random() - 0.5) * 190 + 20
      mesh.position.set(x, y, z)
      mesh.rotation.z = Math.random() * Math.PI
      const scale = 1.6 + Math.random() * 2.2
      mesh.scale.set(scale, scale, scale)
      this.nebulaGroup.add(mesh)
      this.nebulaMeshes.push(mesh)
    }

    this.scene.add(this.nebulaGroup)
  }

  private setupSomaLandmarks(): void {
    const milestones = [0.15, 0.38, 0.65, 0.88]
    const coreGeo = new THREE.IcosahedronGeometry(3.6, 1)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffdf7a,
      emissive: 0xffdf7a,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.8,
    })

    const wireGeo = new THREE.IcosahedronGeometry(4.8, 2)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    })

    milestones.forEach((u) => {
      const pos = this.curve.getPointAt(u)
      const group = new THREE.Group()
      group.position.copy(pos)

      const coreMesh = new THREE.Mesh(coreGeo, coreMat)
      group.add(coreMesh)

      const wireMesh = new THREE.Mesh(wireGeo, wireMat)
      group.add(wireMesh)

      const pointLight = new THREE.PointLight(0xffdf7a, 3.0, 55, 2.0)
      group.add(pointLight)

      const vesicleCount = 45
      const vGeo = new THREE.BufferGeometry()
      const vPos = new Float32Array(vesicleCount * 3)

      for (let i = 0; i < vesicleCount; i++) {
        const angle = (i / vesicleCount) * Math.PI * 2
        const r = 7.5 + Math.random() * 3.0
        vPos[i * 3] = Math.cos(angle) * r
        vPos[i * 3 + 1] = (Math.random() - 0.5) * 3.5
        vPos[i * 3 + 2] = Math.sin(angle) * r
      }

      vGeo.setAttribute('position', new THREE.BufferAttribute(vPos, 3))
      const vMat = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 0.5,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      })
      const vesicles = new THREE.Points(vGeo, vMat)
      group.add(vesicles)

      this.scene.add(group)

      this.somaLandmarks.push({
        group,
        coreMesh,
        wireMesh,
        light: pointLight,
        vesicles,
        uPos: u,
      })
    })
  }

  private async initializeAssets(options?: WorldEngineOptions): Promise<void> {
    const report = (p: number, msg: string) => {
      options?.onLoadProgress?.(p, msg)
    }

    try {
      report(8, 'Detecting cosmic synaptic signals')
      await new Promise((r) => setTimeout(r, 160))

      report(30, 'Sculpting axon highway & Nodes of Ranvier')
      await new Promise((r) => setTimeout(r, 200))

      report(60, 'Igniting cortical nebulae & neurotransmitter starfield')
      await new Promise((r) => setTimeout(r, 220))

      report(85, 'Charging Hodgkin-Huxley action potentials')
      await this.renderer.compileAsync(this.scene, this.camera)

      report(100, 'Cosmic neural continuum ready. Enter the domain.')
      options?.onReady?.()
    } catch (e) {
      console.error('Initialization error:', e)
      report(100, 'Cosmic neural continuum ready.')
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
      const t = (performance.now() - this.startTime) * 0.0007
      const u = 0.001
      const spinePoint = this.curve.getPointAt(u)
      const tangent = this.curve.getTangentAt(u)

      const cameraX = spinePoint.x + Math.sin(t * 0.8) * 2.5
      const cameraY = spinePoint.y + 4.8 + Math.cos(t * 0.6) * 1.2
      const cameraZ = spinePoint.z + 18.0

      this.camera.position.set(cameraX, cameraY, cameraZ)
      this.desiredLookTarget.copy(spinePoint).addScaledVector(tangent, 35)
      this.camera.fov = 46.0
    } else if (mode === 'intro') {
      // Forward Fly-Through along the curved neural axon
      // Accelerates smoothly from u = 0.001 to u = 0.05
      const uFlight = tIntro * tIntro * (3 - 2 * tIntro)
      const uSpline = THREE.MathUtils.lerp(0.001, 0.052, uFlight)

      const spinePoint = this.curve.getPointAt(uSpline)
      const tangent = this.curve.getTangentAt(uSpline)
      const normal = this.frenetFrames.normals[Math.min(Math.floor(uSpline * this.splineSegments), this.splineSegments)]

      const cameraPos = spinePoint.clone().addScaledVector(normal, THREE.MathUtils.lerp(4.8, 2.8, uFlight))
      this.camera.position.copy(cameraPos)
      this.desiredLookTarget.copy(spinePoint).addScaledVector(tangent, 40)
      this.camera.fov = THREE.MathUtils.lerp(46.0, 58.0, uFlight)
    } else if (mode === 'transition' || mode === 'journey') {
      // Journey Mode driven by scroll: u from 0.05 to 0.96
      const uSpline = THREE.MathUtils.lerp(0.052, 0.96, this.smoothScrollProgress)
      const spinePoint = this.curve.getPointAt(uSpline)
      const tangent = this.curve.getTangentAt(uSpline)
      const normal = this.frenetFrames.normals[Math.min(Math.floor(uSpline * this.splineSegments), this.splineSegments)]

      const cameraPos = spinePoint.clone().addScaledVector(normal, 2.8)
      this.camera.position.copy(cameraPos)
      this.desiredLookTarget.copy(spinePoint).addScaledVector(tangent, 45)
      this.camera.fov = 55.0
    }

    this.currentLookTarget.lerp(this.desiredLookTarget, 0.14)
    this.camera.lookAt(this.currentLookTarget)
    this.camera.updateProjectionMatrix()
  }

  private animate = (now: number): void => {
    if (this.isDisposed) return
    this.rafId = requestAnimationFrame(this.animate)

    const dt = Math.min((now - this.lastFrameTime) / 1000, 0.1)
    this.lastFrameTime = now
    const timeSec = (now - this.startTime) / 1000

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
      entranceBoost = Math.sin(introT * Math.PI) * 1.5
    }

    // Camera Kinematics
    this.updateCameraPose(introT, this.mode)

    // Update Axon Shaders
    if (this.axonMaterial) {
      this.axonMaterial.uniforms.uTime.value = timeSec
      this.axonMaterial.uniforms.uScroll.value = this.smoothScrollProgress
      this.axonMaterial.uniforms.uVelocity.value = this.scrollVelocity + (this.mode === 'intro' ? 1.8 : 0)
    }

    // Update Cosmic Starfield Shaders & Warp Streaks
    if (this.starfieldMaterial) {
      this.starfieldMaterial.uniforms.uTime.value = timeSec
      this.starfieldMaterial.uniforms.uCameraZ.value = this.camera.position.z
      this.starfieldMaterial.uniforms.uVelocity.value = this.scrollVelocity
      this.starfieldMaterial.uniforms.uEntranceBoost.value = entranceBoost
    }

    // Update Cortical Nebulae
    if (this.nebulaMaterial) {
      this.nebulaMaterial.uniforms.uTime.value = timeSec
      this.nebulaMeshes.forEach((m, idx) => {
        m.rotation.z += idx % 2 === 0 ? 0.0003 : -0.0003
      })
    }

    // Update Spike Light (travels ahead of camera along the curve)
    const currentUSpline = this.mode === 'loading'
      ? 0.015
      : this.mode === 'intro'
      ? THREE.MathUtils.lerp(0.01, 0.065, introT)
      : THREE.MathUtils.lerp(0.065, 0.98, this.smoothScrollProgress)

    const spikePoint = this.curve.getPointAt(Math.min(1.0, currentUSpline + 0.02))
    this.spikeLight.position.copy(spikePoint).add(new THREE.Vector3(0, 2.5, 0))

    // Update Landmark Soma Nuclei
    this.somaLandmarks.forEach((landmark) => {
      landmark.coreMesh.rotation.x = timeSec * 0.4
      landmark.coreMesh.rotation.y = timeSec * 0.5
      landmark.wireMesh.rotation.y = -timeSec * 0.35
      landmark.vesicles.rotation.y = timeSec * 0.6

      const landmarkZ = landmark.group.position.z
      const dist = Math.abs(this.camera.position.z - landmarkZ)
      const arrivalFlare = Math.max(0.0, 1.0 - dist / 55.0)

      landmark.light.intensity = 2.5 + arrivalFlare * 9.5
      const scale = 1.0 + Math.sin(timeSec * 3.0) * 0.08 + arrivalFlare * 0.4
      landmark.coreMesh.scale.set(scale, scale, scale)
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

    this.renderer.dispose()
    if (this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas)
    }
  }
}
