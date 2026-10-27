import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface ThemeToggleSwitchProps {
  className?: string
  isLight?: boolean
  onToggle?: (isLight: boolean) => void
}

export default function ThemeToggleSwitch({ className, isLight: controlledIsLight, onToggle }: ThemeToggleSwitchProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [internalLight, setInternalLight] = useState(controlledIsLight ?? false)
  const isLight = controlledIsLight !== undefined ? controlledIsLight : internalLight
  const isLightRef = useRef(isLight)
  isLightRef.current = isLight
  const [isHovered, setIsHovered] = useState(false)

  // Spring animation refs
  const springRef = useRef({
    current: isLight ? 1 : 0,
    target: isLight ? 1 : 0,
    velocity: 0,
    lastTime: performance.now(),
  })

  // Three.js internal objects
  const threeRef = useRef<{
    scene: THREE.Scene
    camera: THREE.OrthographicCamera
    renderer: THREE.WebGLRenderer
    trackMesh: THREE.Mesh | null
    sphereGroup: THREE.Group | null
    sphereMesh: THREE.Mesh | null
    pointLight: THREE.PointLight | null
    accentLight: THREE.DirectionalLight | null
    spotLight: THREE.SpotLight | null
    animId: number | null
    isAnimating: boolean
  } | null>(null)

  const applyThemeState = useCallback((t: number) => {
    const data = threeRef.current
    if (!data) return

    // Interpolate Sphere position along track local Z (-1.2 to +1.2)
    // Because rootGroup has rotation.y = Math.PI / 2, this moves strictly horizontally (left to right)
    if (data.sphereGroup) {
      data.sphereGroup.position.z = -1.2 + t * 2.4
    }

    // Interpolate Sphere rotation and color
    if (data.sphereMesh) {
      data.sphereMesh.rotation.x = t * Math.PI * 1.3
      const mat = data.sphereMesh.material as THREE.MeshStandardMaterial
      if (mat) {
        const darkBall = new THREE.Color(0x181a20)
        const lightBall = new THREE.Color(0xf6f4ee)
        mat.color.copy(darkBall).lerp(lightBall, t)
        mat.roughness = 0.5 - t * 0.15
        mat.metalness = 0.4 - t * 0.25
      }
    }

    // Interpolate Track Color
    // Dark mode: Dark slate gunmetal (#222630)
    // Light mode: Warm champagne / polished metallic stone (#dad5cb)
    if (data.trackMesh) {
      const mat = data.trackMesh.material as THREE.MeshStandardMaterial
      if (mat) {
        const darkTrack = new THREE.Color(0x222630)
        const lightTrack = new THREE.Color(0xdad5cb)
        mat.color.copy(darkTrack).lerp(lightTrack, t)
      }
    }

    // Interpolate Accent Light color
    // Dark mode: Cool cyan (#38bdf8)
    // Light mode: Warm golden amber (#f59e0b)
    const coolLight = new THREE.Color(0x38bdf8)
    const warmLight = new THREE.Color(0xf59e0b)
    const currentColor = coolLight.clone().lerp(warmLight, t)

    if (data.pointLight) data.pointLight.color.copy(currentColor)
    if (data.accentLight) data.accentLight.color.copy(currentColor)
    if (data.spotLight) data.spotLight.color.copy(currentColor)
  }, [])

  const animate = useCallback(() => {
    const data = threeRef.current
    if (!data) return

    const now = performance.now()
    const dt = Math.min((now - springRef.current.lastTime) / 1000, 0.05)
    springRef.current.lastTime = now

    // Physics spring simulation (tension = 280, friction = 24)
    const spring = springRef.current
    const tension = 280
    const friction = 24
    const force = -tension * (spring.current - spring.target) - friction * spring.velocity
    spring.velocity += force * dt
    spring.current += spring.velocity * dt

    // Settle threshold
    if (
      Math.abs(spring.velocity) < 0.0001 &&
      Math.abs(spring.current - spring.target) < 0.0001
    ) {
      spring.current = spring.target
      spring.velocity = 0
      data.isAnimating = false
    }

    applyThemeState(spring.current)
    data.renderer.render(data.scene, data.camera)

    if (data.isAnimating) {
      data.animId = requestAnimationFrame(animate)
    }
  }, [applyThemeState])

  const startAnimation = useCallback(() => {
    const data = threeRef.current
    if (!data) return
    if (!data.isAnimating) {
      data.isAnimating = true
      springRef.current.lastTime = performance.now()
      animate()
    }
  }, [animate])

  const toggle = useCallback(() => {
    const next = !isLightRef.current
    if (controlledIsLight === undefined) {
      setInternalLight(next)
    }
    isLightRef.current = next
    springRef.current.target = next ? 1 : 0
    startAnimation()
    onToggle?.(next)
  }, [controlledIsLight, onToggle, startAnimation])

  useEffect(() => {
    if (controlledIsLight !== undefined) {
      setInternalLight(controlledIsLight)
      springRef.current.target = controlledIsLight ? 1 : 0
      startAnimation()
    }
  }, [controlledIsLight, startAnimation])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 72
    const height = container.clientHeight || 36

    // Initial theme state factor: 1 for light mode, 0 for dark mode
    const initialT = isLightRef.current ? 1 : 0
    springRef.current.current = initialT
    springRef.current.target = initialT
    springRef.current.velocity = 0

    // Scene
    const scene = new THREE.Scene()

    // Orthographic Camera aligned straight horizontally
    const aspect = width / height
    const frustumSize = 3.8
    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      100
    )
    camera.position.set(0, 6.5, 9)
    camera.lookAt(0, 0.4, 0)
    camera.updateProjectionMatrix()

    // WebGL Renderer with full alpha transparency
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55 * Math.PI)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9 * Math.PI)
    keyLight.position.set(-8, 14, 10)
    keyLight.castShadow = true
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4 * Math.PI)
    fillLight.position.set(8, 6, 8)
    scene.add(fillLight)

    const initLightColor = initialT > 0.5 ? new THREE.Color(0xf59e0b) : new THREE.Color(0x38bdf8)

    const accentLight = new THREE.DirectionalLight(initLightColor, 0.6 * Math.PI)
    accentLight.position.set(0, -6, -8)
    scene.add(accentLight)

    const spotLight = new THREE.SpotLight(initLightColor, 1.2 * Math.PI)
    spotLight.position.set(0, 16, 12)
    spotLight.angle = 0.35
    spotLight.penumbra = 0.8
    scene.add(spotLight)

    // Root Group: Rotated by 90 degrees around Y (Math.PI / 2)
    const rootGroup = new THREE.Group()
    rootGroup.rotation.y = Math.PI / 2
    rootGroup.scale.set(1.15, 1.15, 1.15)
    scene.add(rootGroup)

    let trackMesh: THREE.Mesh | null = null
    let sphereGroup: THREE.Group | null = null
    let sphereMesh: THREE.Mesh | null = null
    let pointLight: THREE.PointLight | null = null

    // Setup sphere inside group according to initial theme state
    const setupSphere = (texture: THREE.Texture | null) => {
      sphereGroup = new THREE.Group()
      sphereGroup.position.set(0, 0.85, -1.2 + initialT * 2.4)

      const sphereGeo = new THREE.SphereGeometry(0.8, 48, 48)
      const ballColor = initialT > 0.5 ? new THREE.Color(0xf6f4ee) : new THREE.Color(0x181a20)
      const sphereMat = new THREE.MeshStandardMaterial({
        color: ballColor,
        roughness: 0.5 - initialT * 0.15,
        metalness: 0.4 - initialT * 0.25,
        map: texture || null,
      })

      sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
      sphereMesh.rotation.x = initialT * Math.PI * 1.3
      sphereMesh.castShadow = true
      sphereMesh.receiveShadow = true
      sphereGroup.add(sphereMesh)

      // Point light attached to the ball that travels with it
      pointLight = new THREE.PointLight(initLightColor, 20 * Math.PI, 3, 1)
      sphereGroup.add(pointLight)

      // Soft contact shadow disc under the ball
      const shadowGeo = new THREE.PlaneGeometry(1.8, 1.8)
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      })
      const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat)
      shadowDisc.rotation.x = -Math.PI / 2
      shadowDisc.position.y = -0.82
      sphereGroup.add(shadowDisc)

      rootGroup.add(sphereGroup)
    }

    // Setup procedural fallback track
    const setupFallbackTrack = () => {
      const trackGeo = new THREE.BoxGeometry(1.76, 0.34, 4.58)
      const trackColor = initialT > 0.5 ? new THREE.Color(0xdad5cb) : new THREE.Color(0x222630)
      const trackMat = new THREE.MeshStandardMaterial({
        color: trackColor,
        roughness: 0.5,
        metalness: 0.8,
      })
      trackMesh = new THREE.Mesh(trackGeo, trackMat)
      trackMesh.castShadow = true
      trackMesh.receiveShadow = true
      rootGroup.add(trackMesh)
    }

    // Load texture
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(
      '/assets/cross.jpg',
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(1, 1)
        if (sphereMesh) {
          ;(sphereMesh.material as THREE.MeshStandardMaterial).map = texture
          ;(sphereMesh.material as THREE.MeshStandardMaterial).needsUpdate = true
          renderer.render(scene, camera)
        }
      },
      undefined,
      (err) => {
        console.warn('Could not load cross.jpg texture, using procedural finish:', err)
      }
    )

    // Load GLTF track
    const gltfLoader = new GLTFLoader()
    gltfLoader.load(
      '/assets/switch.glb',
      (gltf) => {
        let loadedTrack: THREE.Mesh | null = null
        gltf.scene.traverse((child) => {
          if (child.name === 'Cube' && (child as THREE.Mesh).isMesh) {
            loadedTrack = child as THREE.Mesh
          }
        })

        if (loadedTrack) {
          if (trackMesh) {
            rootGroup.remove(trackMesh)
            trackMesh.geometry.dispose()
          }
          const loadedGeo = (loadedTrack as THREE.Mesh).geometry
          const currentT = springRef.current.current
          const darkTrack = new THREE.Color(0x222630)
          const lightTrack = new THREE.Color(0xdad5cb)
          const trackMat = new THREE.MeshStandardMaterial({
            color: darkTrack.clone().lerp(lightTrack, currentT),
            roughness: 0.45,
            metalness: 0.85,
          })
          trackMesh = new THREE.Mesh(loadedGeo, trackMat)
          trackMesh.castShadow = true
          trackMesh.receiveShadow = true
          rootGroup.add(trackMesh)

          if (threeRef.current) {
            threeRef.current.trackMesh = trackMesh
          }
          renderer.render(scene, camera)
        }
      },
      undefined,
      (err) => {
        console.warn('Could not load switch.glb, using fallback track:', err)
      }
    )

    // Initial procedural setup
    setupFallbackTrack()
    setupSphere(null)

    threeRef.current = {
      scene,
      camera,
      renderer,
      trackMesh,
      sphereGroup,
      sphereMesh,
      pointLight,
      accentLight,
      spotLight,
      animId: null,
      isAnimating: false,
    }

    // Apply exact initial theme state and render immediately
    applyThemeState(initialT)
    renderer.render(scene, camera)

    const handleResize = () => {
      if (!container || !threeRef.current) return
      const w = container.clientWidth || 72
      const h = container.clientHeight || 36
      const a = w / h
      threeRef.current.camera.left = (-frustumSize * a) / 2
      threeRef.current.camera.right = (frustumSize * a) / 2
      threeRef.current.camera.top = frustumSize / 2
      threeRef.current.camera.bottom = -frustumSize / 2
      threeRef.current.camera.updateProjectionMatrix()
      threeRef.current.renderer.setSize(w, h)
      threeRef.current.renderer.render(threeRef.current.scene, threeRef.current.camera)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (threeRef.current?.animId) {
        cancelAnimationFrame(threeRef.current.animId)
      }
      renderer.dispose()
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
      threeRef.current = null
    }
  }, [applyThemeState])

  return (
    <div
      ref={containerRef}
      className={`theme-toggle-container${isLight ? ' is-light' : ''}${isHovered ? ' is-hovered' : ''} ${className || ''}`}
      onClick={toggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="switch"
      aria-checked={isLight}
      aria-label={`Toggle theme (currently ${isLight ? 'light' : 'dark'} mode)`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggle()
        }
      }}
    />
  )
}
