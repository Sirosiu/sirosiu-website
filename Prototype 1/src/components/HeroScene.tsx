import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const MOBILE_QUERY = '(max-width: 760px)'

function createFoldedBand() {
  const angularSegments = 144
  const radialSegments = 12
  const innerRadius = 0.62
  const outerRadius = 1.48

  const positions: number[] = []
  const indices: number[] = []

  // A continuous, asymmetrical annular surface.
  // The inner boundary remains open, forming the central void.
  for (let i = 0; i <= angularSegments; i += 1) {
    const angle = (i / angularSegments) * Math.PI * 2

    for (let j = 0; j <= radialSegments; j += 1) {
      const t = j / radialSegments
      const baseRadius = innerRadius + (outerRadius - innerRadius) * t

      const asymmetry =
        1 +
        0.12 * Math.sin(angle - 0.7) +
        0.045 * Math.sin(2 * angle + 0.8)

      const radius = baseRadius * asymmetry
      const x = radius * Math.cos(angle) + 0.12 * Math.sin(angle * 2)
      const y = radius * Math.sin(angle) * 0.9
      const fold = Math.sin(angle * 2 + 0.35)
      const secondaryFold = Math.sin(angle * 3 - 0.6)

      // The radial coordinate influences the fold, giving the band
      // a twisted, folded-metal appearance rather than a flat ring.
      const z =
        0.28 * fold +
        0.13 * secondaryFold +
        (t - 0.5) * 0.34 * Math.cos(angle + 0.5)

      positions.push(x, y, z)
    }
  }

  for (let i = 0; i < angularSegments; i += 1) {
    for (let j = 0; j < radialSegments; j += 1) {
      const a = i * (radialSegments + 1) + j
      const b = a + radialSegments + 1

      indices.push(a, b, a + 1)
      indices.push(b, b + 1, a + 1)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  )
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}

function createEdgeGeometry(
  radius: number,
  startAngle: number,
  endAngle: number,
  segments = 72,
) {
  const points: THREE.Vector3[] = []

  for (let i = 0; i <= segments; i += 1) {
    const angle = startAngle + (i / segments) * (endAngle - startAngle)
    const asymmetry =
      1 + 0.12 * Math.sin(angle - 0.7) + 0.045 * Math.sin(2 * angle + 0.8)

    const r = radius * asymmetry

    points.push(
      new THREE.Vector3(
        r * Math.cos(angle) + 0.12 * Math.sin(angle * 2),
        r * Math.sin(angle) * 0.9,
        0.28 * Math.sin(angle * 2 + 0.35) +
          0.13 * Math.sin(angle * 3 - 0.6) +
          0.17 * Math.cos(angle + 0.5),
      ),
    )
  }

  return new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(points),
    segments,
    0.012,
    5,
    false,
  )
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY)
    const mobile = window.matchMedia(MOBILE_QUERY)

    let cleanupScene: (() => void) | undefined

    const stopScene = () => {
      cleanupScene?.()
      cleanupScene = undefined
    }

    const startScene = () => {
      stopScene()

      // Leave the CSS fallback in place on mobile and for reduced motion.
      if (mobile.matches || reducedMotion.matches) return

      let renderer: THREE.WebGLRenderer

      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: 'low-power',
        })
      } catch {
        return
      }

      const width = container.clientWidth
      const height = container.clientHeight

      if (!width || !height) {
        renderer.dispose()
        return
      }

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100)
      camera.position.set(0, 0, 6.8)

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.setSize(width, height)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.domElement.setAttribute('aria-hidden', 'true')
      container.appendChild(renderer.domElement)

      scene.add(new THREE.AmbientLight(0xc8c7c4, 1.35))

      const keyLight = new THREE.DirectionalLight(0xf1eee8, 3.0)
      keyLight.position.set(3, 4, 5)
      scene.add(keyLight)

      const fillLight = new THREE.DirectionalLight(0x858c96, 1.2)
      fillLight.position.set(-4, -2, 3)
      scene.add(fillLight)

      const rimLight = new THREE.PointLight(0xc17b50, 11, 10)
      rimLight.position.set(-2.5, 1.2, -1.5)
      scene.add(rimLight)

      const sculpture = new THREE.Group()
      scene.add(sculpture)

      const bandMaterial = new THREE.MeshStandardMaterial({
        color: 0x555960,
        metalness: 0.82,
        roughness: 0.28,
        side: THREE.DoubleSide,
      })

      const band = new THREE.Mesh(createFoldedBand(), bandMaterial)
      sculpture.add(band)

      // A restrained copper highlight on one edge, not an orbit ring.
      const copperMaterial = new THREE.MeshStandardMaterial({
        color: 0xc17b50,
        metalness: 0.8,
        roughness: 0.3,
        emissive: 0x291309,
        emissiveIntensity: 0.22,
      })

      const copperEdge = new THREE.Mesh(
        createEdgeGeometry(1.48, -0.55, 0.65),
        copperMaterial,
      )
      sculpture.add(copperEdge)

      // A dark secondary folded plane adds depth without closing the void.
      const innerFold = new THREE.Mesh(
        createEdgeGeometry(0.73, 0.65, 2.9),
        new THREE.MeshStandardMaterial({
          color: 0x25272b,
          metalness: 0.75,
          roughness: 0.34,
        }),
      )
      innerFold.scale.set(1, 1, 1.3)
      sculpture.add(innerFold)

      sculpture.rotation.set(-0.18, 0.18, -0.08)

      const pointer = { x: 0, y: 0 }
      const targetPointer = { x: 0, y: 0 }

      let isDragging = false
      let lastDragX = 0
      let lastDragY = 0
      let animationFrame = 0
      let lastRender = 0
      let active = !document.hidden
      let disposed = false
      let elapsed = 0

      const onPointerDown = (event: PointerEvent) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return

        event.preventDefault()

        isDragging = true
        lastDragX = event.clientX
        lastDragY = event.clientY

        renderer.domElement.style.cursor = 'grabbing'
        renderer.domElement.setPointerCapture(event.pointerId)
      }

      const onPointerMove = (event: PointerEvent) => {
        if (isDragging) {
          const deltaX = event.clientX - lastDragX
          const deltaY = event.clientY - lastDragY

          sculpture.rotation.y += deltaX * 0.008
          sculpture.rotation.x += deltaY * 0.008

          lastDragX = event.clientX
          lastDragY = event.clientY
          return
        }

        const bounds = container.getBoundingClientRect()
        if (!bounds.width || !bounds.height) return

        targetPointer.x =
          ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.3

        targetPointer.y =
          ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.2
      }

      const onPointerUp = (event: PointerEvent) => {
        if (!isDragging) return

        isDragging = false
        renderer.domElement.style.cursor = 'grab'

        if (renderer.domElement.hasPointerCapture(event.pointerId)) {
          renderer.domElement.releasePointerCapture(event.pointerId)
        }

        targetPointer.x = 0
        targetPointer.y = 0
      }

      const onPointerLeave = () => {
        if (isDragging) return

        targetPointer.x = 0
        targetPointer.y = 0
      }

      const render = (time: number) => {
        if (!active || disposed) return

        animationFrame = window.requestAnimationFrame(render)

        // Cap rendering at approximately 30 FPS.
        if (time - lastRender < 33) return

        const delta =
          lastRender === 0 ? 1 : Math.min((time - lastRender) / 33, 2)

        lastRender = time
        elapsed += delta

        pointer.x += (targetPointer.x - pointer.x) * 0.07
        pointer.y += (targetPointer.y - pointer.y) * 0.07

        if (!isDragging) {
          sculpture.rotation.x =
            -0.18 - pointer.y + Math.sin(elapsed * 0.009) * 0.035

          sculpture.rotation.y =
            0.18 + pointer.x + Math.sin(elapsed * 0.012) * 0.06

          sculpture.rotation.z =
            -0.08 + Math.sin(elapsed * 0.006) * 0.02
        }

        renderer.render(scene, camera)
      }

      const resize = () => {
        if (disposed) return

        const nextWidth = container.clientWidth
        const nextHeight = container.clientHeight
        if (!nextWidth || !nextHeight) return

        camera.aspect = nextWidth / nextHeight
        camera.updateProjectionMatrix()
        renderer.setSize(nextWidth, nextHeight)
        renderer.render(scene, camera)
      }

      const onVisibilityChange = () => {
        if (document.hidden) {
          active = false
          window.cancelAnimationFrame(animationFrame)
          return
        }

        if (!active && !disposed) {
          active = true
          lastRender = 0
          animationFrame = window.requestAnimationFrame(render)
        }
      }

      const onModeChange = () => startScene()

      renderer.domElement.style.cursor = 'grab'
      renderer.domElement.style.touchAction = 'none'

      renderer.domElement.addEventListener('pointerdown', onPointerDown)
      renderer.domElement.addEventListener('pointermove', onPointerMove)
      renderer.domElement.addEventListener('pointerup', onPointerUp)
      renderer.domElement.addEventListener('pointercancel', onPointerUp)
      renderer.domElement.addEventListener('pointerleave', onPointerLeave)
      window.addEventListener('resize', resize)
      document.addEventListener('visibilitychange', onVisibilityChange)
      mobile.addEventListener('change', onModeChange)
      reducedMotion.addEventListener('change', onModeChange)

      resize()

      if (active) {
        animationFrame = window.requestAnimationFrame(render)
      }

      cleanupScene = () => {
        disposed = true
        active = false
        window.cancelAnimationFrame(animationFrame)

        renderer.domElement.removeEventListener('pointerdown', onPointerDown)
        renderer.domElement.removeEventListener('pointermove', onPointerMove)
        renderer.domElement.removeEventListener('pointerup', onPointerUp)
        renderer.domElement.removeEventListener('pointercancel', onPointerUp)
        renderer.domElement.removeEventListener('pointerleave', onPointerLeave)
        window.removeEventListener('resize', resize)
        document.removeEventListener('visibilitychange', onVisibilityChange)
        mobile.removeEventListener('change', onModeChange)
        reducedMotion.removeEventListener('change', onModeChange)

        sculpture.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return

          object.geometry.dispose()

          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          } else {
            object.material.dispose()
          }
        })

        renderer.dispose()
        renderer.domElement.remove()
      }
    }

    startScene()

    return () => {
      stopScene()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="hero-scene-canvas"
      aria-hidden="true"
    />
  )
}