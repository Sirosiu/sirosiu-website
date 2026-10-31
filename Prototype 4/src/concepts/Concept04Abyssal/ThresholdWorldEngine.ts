import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export type WorldMode = 'loading' | 'intro' | 'transition' | 'journey'

export interface WorldEngineOptions {
  onLoadProgress?: (percent: number, message: string) => void
  onReady?: () => void
}

export class ThresholdWorldEngine {
  private container: HTMLElement
  private canvas: HTMLCanvasElement
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private rafId = 0
  private isDisposed = false

  // Lights & Atmosphere
  private hemiLight!: THREE.HemisphereLight
  private sunLight!: THREE.DirectionalLight
  private fillLight!: THREE.DirectionalLight

  // Entities
  private guideOrbGroup!: THREE.Group
  private orbLight!: THREE.PointLight
  private dustPoints!: THREE.Points
  private guidingThreadMesh: THREE.Mesh | null = null
  private guidingThreadUniforms: Record<string, THREE.IUniform> = {}
  private ribbonGroup: THREE.Group = new THREE.Group()
  private terrainGroup: THREE.Group = new THREE.Group()
  private mistGroup: THREE.Group = new THREE.Group()

  // State
  private mode: WorldMode = 'loading'
  private introTime = 0
  private introDuration = 8.5
  private scrollProgress = 0
  private smoothScrollProgress = 0

  // Camera tracking vectors
  private currentLookTarget = new THREE.Vector3(0, 0.7, -3)
  private desiredLookTarget = new THREE.Vector3(0, 0.7, -3)
  private drawingBufferSize = new THREE.Vector2()

  private startTime = performance.now()
  private lastFrameTime = performance.now()

  constructor(container: HTMLElement, options?: WorldEngineOptions) {
    this.container = container

    // 1. Canvas & Renderer
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
    this.renderer.toneMappingExposure = 1.06
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // 2. Scene & Fog
    this.scene = new THREE.Scene()
    this.scene.name = 'Continuous Threshold World'
    this.scene.fog = new THREE.FogExp2('#0d151d', 0.0125)

    // 3. Camera
    const aspect = this.container.clientWidth / Math.max(1, this.container.clientHeight)
    this.camera = new THREE.PerspectiveCamera(46, aspect, 0.1, 2500)
    this.scene.add(this.camera)

    // Setup initial entities
    this.setupLighting()
    this.setupGuideOrb()
    this.setupSpatialDust()
    this.setupGuidingThread()
    this.setupProceduralLandscape()
    this.setupMistBillboards()
    this.scene.add(this.ribbonGroup)

    // Initial Camera Pose
    this.updateCameraPose(0, 'loading')

    // Handle Resize
    window.addEventListener('resize', this.handleResize)

    // Asynchronous Asset Loading & Shader Warmup
    this.initializeAssets(options)

    // Start Render Loop
    this.animate(performance.now())
  }

  /**
   * Route equation: continuous curved road winding into deep space
   */
  public static routeAt(z: number): number {
    return (
      2.8 * Math.sin(-z * 0.049) +
      1.2 * Math.sin(-z * 0.095) -
      3.0 * THREE.MathUtils.smoothstep(-z, 150, 189)
    )
  }

  private setupLighting(): void {
    // Soft skylight & earth bounce
    this.hemiLight = new THREE.HemisphereLight('#a9b9ca', '#171919', 0.92)
    this.scene.add(this.hemiLight)

    // Warm coastal sunset directional light
    this.sunLight = new THREE.DirectionalLight('#ffcd94', 2.6)
    this.sunLight.castShadow = true
    this.sunLight.shadow.mapSize.set(1024, 1024)
    this.sunLight.shadow.camera.left = -22
    this.sunLight.shadow.camera.right = 22
    this.sunLight.shadow.camera.top = 22
    this.sunLight.shadow.camera.bottom = -22
    this.sunLight.shadow.camera.near = 0.5
    this.sunLight.shadow.camera.far = 120
    this.sunLight.shadow.bias = -0.0004
    this.sunLight.shadow.normalBias = 0.035
    this.scene.add(this.sunLight)
    this.scene.add(this.sunLight.target)

    // Fill Light
    this.fillLight = new THREE.DirectionalLight('#c3cbd1', 0.55)
    this.fillLight.position.set(-14, 18, 12)
    this.scene.add(this.fillLight)
  }

  private setupGuideOrb(): void {
    this.guideOrbGroup = new THREE.Group()
    this.guideOrbGroup.name = 'Guide Light Orb'

    // Core glowing sphere
    const coreGeo = new THREE.SphereGeometry(0.09, 24, 18)
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(3.5, 2.6, 1.2),
      toneMapped: false,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    this.guideOrbGroup.add(coreMesh)

    // Radial gradient sprite halo
    const haloCanvas = document.createElement('canvas')
    haloCanvas.width = 128
    haloCanvas.height = 128
    const ctx = haloCanvas.getContext('2d')
    if (ctx) {
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
      g.addColorStop(0, 'rgba(255, 240, 200, 1)')
      g.addColorStop(0.12, 'rgba(255, 215, 145, 0.82)')
      g.addColorStop(0.4, 'rgba(235, 170, 90, 0.18)')
      g.addColorStop(1, 'rgba(235, 170, 90, 0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 128, 128)
    }
    const haloTex = new THREE.CanvasTexture(haloCanvas)
    const haloMat = new THREE.SpriteMaterial({
      map: haloTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      opacity: 0.88,
    })
    const haloSprite = new THREE.Sprite(haloMat)
    haloSprite.scale.set(3.8, 3.8, 1)
    this.guideOrbGroup.add(haloSprite)

    // Dynamic point light illuminating ground and mist
    this.orbLight = new THREE.PointLight('#ffd89c', 4.5, 18, 2)
    this.guideOrbGroup.add(this.orbLight)

    this.scene.add(this.guideOrbGroup)
  }

  private setupSpatialDust(): void {
    const dustCount = 850
    const positions = new Float32Array(dustCount * 3)

    let seed = 19711
    const rnd = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
      return seed / 4294967296
    }

    for (let i = 0; i < dustCount; i++) {
      const z = 16 - rnd() * 220
      const x = ThresholdWorldEngine.routeAt(z) + (rnd() - 0.5) * 26
      const y = -4.5 + rnd() * 14
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const mat = new THREE.PointsMaterial({
      color: '#e3c28e',
      size: 0.032,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    })

    this.dustPoints = new THREE.Points(geo, mat)
    this.scene.add(this.dustPoints)
  }

  private setupGuidingThread(): void {
    const segmentCount = 1800
    const startZ = 16
    const endZ = -195
    const roadSurface = -0.98

    const positions: number[] = []
    const tangents: number[] = []
    const sides: number[] = []
    const indices: number[] = []

    for (let i = 0; i <= segmentCount; i++) {
      const z = startZ + ((endZ - startZ) * i) / segmentCount
      const x = ThresholdWorldEngine.routeAt(z)
      const dz = 0.025
      const dx =
        (ThresholdWorldEngine.routeAt(z + dz) -
          ThresholdWorldEngine.routeAt(z - dz)) /
        (2 * dz)

      for (const side of [-1, 1]) {
        positions.push(x, roadSurface, z)
        tangents.push(-dx * 0.05, 0, -0.05)
        sides.push(side)
      }

      if (i < segmentCount) {
        const a = i * 2
        indices.push(a, a + 1, a + 3, a, a + 3, a + 2)
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setAttribute('tangentPath', new THREE.Float32BufferAttribute(tangents, 3))
    geo.setAttribute('side', new THREE.Float32BufferAttribute(sides, 1))
    geo.setIndex(indices)
    geo.computeBoundingSphere()

    this.guidingThreadUniforms = {
      viewport: { value: new THREE.Vector2(1, 1) },
      resolutionScale: { value: 1.0 },
      intensity: { value: 1.2 },
    }

    const mat = new THREE.ShaderMaterial({
      uniforms: this.guidingThreadUniforms,
      transparent: true,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      vertexShader: `
        attribute vec3 tangentPath;
        attribute float side;
        uniform vec2 viewport;
        uniform float resolutionScale;
        varying float vSide;
        varying float vCore;
        varying float vHalf;
        varying float vDepth;

        void main() {
          vec4 view = modelViewMatrix * vec4(position, 1.0);
          vec4 clip = projectionMatrix * view;
          vec4 next = projectionMatrix * modelViewMatrix * vec4(position + tangentPath, 1.0);
          float w = abs(clip.w) > 0.0001 ? clip.w : 0.0001;
          float nw = abs(next.w) > 0.0001 ? next.w : 0.0001;
          vec2 direction = (next.xy / nw - clip.xy / w) * viewport;
          direction /= max(length(direction), 0.00001);
          vec2 normal = vec2(-direction.y, direction.x);
          float distance = max(0.1, -view.z);
          float core = clamp(viewport.y * 0.021 / distance, 0.58 * resolutionScale, 2.1 * resolutionScale);
          float halfWidth = core * 6.0;
          clip.xy += normal * side * halfWidth * 2.0 / viewport * clip.w;
          vSide = side;
          vCore = core;
          vHalf = halfWidth;
          vDepth = -view.z;
          gl_Position = clip;
        }
      `,
      fragmentShader: `
        uniform float intensity;
        varying float vSide;
        varying float vCore;
        varying float vHalf;
        varying float vDepth;

        void main() {
          float lateral = abs(vSide) * vHalf;
          float core = exp(-pow(lateral / vCore, 2.0));
          float aura = exp(-pow(lateral / (vCore * 3.0), 2.0));
          float visibility = smoothstep(0.18, 1.1, vDepth) * (1.0 - smoothstep(110.0, 180.0, vDepth));
          vec3 colour = vec3(1.0, 0.58, 0.24) * core * 2.1 + vec3(1.0, 0.42, 0.14) * aura * 0.26;
          gl_FragColor = vec4(colour * intensity, visibility);
        }
      `,
    })

    this.guidingThreadMesh = new THREE.Mesh(geo, mat)
    this.guidingThreadMesh.name = 'Guiding Light Thread'
    this.guidingThreadMesh.frustumCulled = false
    this.guidingThreadMesh.renderOrder = 2
    this.scene.add(this.guidingThreadMesh)
  }

  private setupProceduralLandscape(): void {
    // Continuous canyon terrain ground mesh
    const lengthZ = 220
    const segmentsZ = 160
    const segmentsX = 40
    const terrainGeo = new THREE.PlaneGeometry(64, lengthZ, segmentsX, segmentsZ)
    terrainGeo.rotateX(-Math.PI / 2)

    const pos = terrainGeo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i) - 90
      const origX = pos.getX(i)
      const roadX = ThresholdWorldEngine.routeAt(z)

      const distFromRoad = origX - roadX
      const absDist = Math.abs(distFromRoad)

      // Road is a flat carved track, with steep cliffs rising on the sides
      let y = -1.0
      if (absDist > 2.5) {
        const cliffRise = Math.pow(Math.min(1.0, (absDist - 2.5) / 18.0), 1.6) * 11.5
        const noise =
          Math.sin(z * 0.12 + origX * 0.15) * 1.4 +
          Math.cos(z * 0.05 + origX * 0.08) * 2.2
        y += cliffRise + noise
      } else {
        // Road surface gentle micro-crowning
        y += (1.0 - Math.pow(absDist / 2.5, 2.0)) * 0.04
      }

      pos.setXYZ(i, origX, y, z)
    }

    terrainGeo.computeVertexNormals()

    const terrainMat = new THREE.MeshStandardMaterial({
      color: '#28333c',
      roughness: 0.88,
      metalness: 0.05,
      side: THREE.DoubleSide,
    })

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat)
    terrainMesh.receiveShadow = true
    this.terrainGroup.add(terrainMesh)
    this.scene.add(this.terrainGroup)
  }

  private setupMistBillboards(): void {
    const texLoader = new THREE.TextureLoader()
    texLoader.load('/textures/dream-cloud.webp', (cloudTex) => {
      cloudTex.colorSpace = THREE.SRGBColorSpace
      const mistMat = new THREE.MeshBasicMaterial({
        map: cloudTex,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })

      for (let i = 0; i < 18; i++) {
        const z = -i * 12 + (i % 2 === 0 ? 4 : -4)
        const x = ThresholdWorldEngine.routeAt(z) + (i % 2 === 0 ? 7 : -7)
        const y = -1.8 + Math.sin(i) * 1.2

        const mistMesh = new THREE.Mesh(new THREE.PlaneGeometry(16, 9), mistMat)
        mistMesh.position.set(x, y, z)
        mistMesh.rotation.y = (Math.PI / 180) * ((i * 37) % 360)
        this.mistGroup.add(mistMesh)
      }
      this.scene.add(this.mistGroup)
    })
  }

  private async initializeAssets(options?: WorldEngineOptions): Promise<void> {
    const report = (p: number, msg: string) => {
      options?.onLoadProgress?.(p, msg)
    }

    try {
      report(5, 'Finding the first light')
      await new Promise((r) => setTimeout(r, 180))

      report(22, 'Sculpting the continuous landscape')
      // Attempt to load GLTF dream ribbons
      const gltfLoader = new GLTFLoader()
      try {
        const gltf = await gltfLoader.loadAsync('/models/dream-ribbons.glb')
        gltf.scene.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh
            mesh.castShadow = false
            mesh.receiveShadow = true
            mesh.material = new THREE.MeshStandardMaterial({
              color: '#d1c9b9',
              roughness: 0.55,
              metalness: 0.08,
              transparent: true,
              opacity: 0.85,
              side: THREE.DoubleSide,
            })
          }
        })
        this.ribbonGroup.add(gltf.scene)
      } catch (err) {
        console.warn('Dream ribbons model fallback to procedural ribbons:', err)
        this.createProceduralRibbons()
      }

      report(55, 'Unfolding the translucent dream')
      await new Promise((r) => setTimeout(r, 240))

      report(78, 'Lighting the world & tuning acoustics')
      await new Promise((r) => setTimeout(r, 260))

      report(92, 'Preparing textures and GPU shaders')
      await this.renderer.compileAsync(this.scene, this.camera)

      report(100, 'Bring your idea. Let’s see where it can go.')
      options?.onReady?.()
    } catch (e) {
      console.error('Initialization error:', e)
      report(100, 'Your journey is ready.')
      options?.onReady?.()
    }
  }

  private createProceduralRibbons(): void {
    const curvePoints: THREE.Vector3[] = []
    for (let z = 16; z >= -180; z -= 3) {
      const rx = ThresholdWorldEngine.routeAt(z)
      curvePoints.push(
        new THREE.Vector3(rx + Math.sin(z * 0.06) * 4.5, 1.8 + Math.cos(z * 0.04) * 1.5, z)
      )
    }
    const curve = new THREE.CatmullRomCurve3(curvePoints)
    const tubeGeo = new THREE.TubeGeometry(curve, 140, 0.28, 8, false)
    const tubeMat = new THREE.MeshStandardMaterial({
      color: '#e2cfb4',
      roughness: 0.4,
      metalness: 0.15,
      transparent: true,
      opacity: 0.82,
      side: THREE.DoubleSide,
    })
    const ribbonMesh = new THREE.Mesh(tubeGeo, tubeMat)
    this.ribbonGroup.add(ribbonMesh)
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
      // Floating preloader vantage pose
      const t = (performance.now() - this.startTime) * 0.0006
      const z = 14.0 + Math.sin(t * 0.7) * 0.25
      const x = ThresholdWorldEngine.routeAt(z) + Math.cos(t * 0.5) * 0.35
      const y = 2.85 + Math.sin(t * 0.9) * 0.12

      this.camera.position.set(x, y, z)
      this.desiredLookTarget.set(
        ThresholdWorldEngine.routeAt(z - 17),
        0.7,
        z - 17
      )
      this.camera.fov = 44.0
    } else if (mode === 'intro') {
      // Forward Fly-Through interpolation
      // Smooth cubic acceleration into the world
      const u = tIntro * tIntro * (3 - 2 * tIntro)
      const z = THREE.MathUtils.lerp(14.0, 5.0, u)
      const x = ThresholdWorldEngine.routeAt(z)
      const y = THREE.MathUtils.lerp(2.85, 2.2, u)

      this.camera.position.set(x, y, z)
      this.desiredLookTarget.set(
        ThresholdWorldEngine.routeAt(z - 17),
        0.65,
        z - 17
      )
      this.camera.fov = THREE.MathUtils.lerp(45.0, 55.0, u)
    } else if (mode === 'transition' || mode === 'journey') {
      // Continuous Journey Pose driven by scroll
      const z = THREE.MathUtils.lerp(5.0, -178.0, this.smoothScrollProgress)
      const x = ThresholdWorldEngine.routeAt(z)
      const ahead = z - 17.0
      const targetX = ThresholdWorldEngine.routeAt(ahead)

      this.camera.position.set(x, 2.2, z)
      this.desiredLookTarget.set(targetX, 0.65, ahead)
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

    // Smooth Scroll Easing
    this.smoothScrollProgress += (this.scrollProgress - this.smoothScrollProgress) * (1 - Math.exp(-dt * 4.5))

    // Handle Intro Mode Timing
    let introT = 0
    if (this.mode === 'intro') {
      this.introTime += dt
      introT = THREE.MathUtils.clamp(this.introTime / this.introDuration, 0, 1)
    }

    // Camera Pose Updates
    this.updateCameraPose(introT, this.mode)

    // Guide Orb Position (leads ahead of camera along the road)
    const orbLeadZ = Math.max(-190, this.camera.position.z - (this.mode === 'journey' ? 26 : 14))
    const orbX = ThresholdWorldEngine.routeAt(orbLeadZ)
    const orbY = -0.7 + Math.sin(now * 0.002) * 0.12
    this.guideOrbGroup.position.set(orbX, orbY, orbLeadZ)

    // Sun target tracking
    this.sunLight.target.position.set(this.camera.position.x, -1, this.camera.position.z - 12)
    this.sunLight.position.set(
      this.camera.position.x + 8,
      16,
      this.camera.position.z - 36
    )

    // Update Guiding Thread Viewport Uniforms
    if (this.guidingThreadMesh && this.guidingThreadUniforms.viewport) {
      this.renderer.getDrawingBufferSize(this.drawingBufferSize)
      this.guidingThreadUniforms.viewport.value.copy(this.drawingBufferSize)
      this.guidingThreadUniforms.resolutionScale.value = Math.min(
        this.renderer.getPixelRatio(),
        1.75
      )
    }

    // Dust gentle floating
    if (this.dustPoints) {
      this.dustPoints.rotation.y = now * 0.00008
    }

    // Render Scene
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
