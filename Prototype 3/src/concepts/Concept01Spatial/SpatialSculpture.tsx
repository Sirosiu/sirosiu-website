import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const SpatialSculpture: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const width = container.clientWidth || 600
    const height = container.clientHeight || 500

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
    camera.position.set(0, 0, 7.5)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // Lighting: Architectural Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.2)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8)
    keyLight.position.set(6, 8, 7)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 1024
    keyLight.shadow.mapSize.height = 1024
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.4)
    fillLight.position.set(-6, -4, 4)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0x94a3b8, 1.0)
    rimLight.position.set(0, 6, -6)
    scene.add(rimLight)

    // Sculptural Geometry Group: Interlocking Asymmetric Monoliths
    const sculptureGroup = new THREE.Group()

    // Materials: Precision Engineered Materials
    const darkSlateMaterial = new THREE.MeshStandardMaterial({
      color: 0x181e29,
      roughness: 0.35,
      metalness: 0.65,
    })

    const titaniumMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.2,
      metalness: 0.85,
    })

    const accentEdgeMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x0369a1,
      emissiveIntensity: 0.25,
    })

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    })

    // Slabs: Precision Layered Slabs
    // Slab 1: Primary Vertical Monolith
    const slab1Geo = new THREE.BoxGeometry(1.6, 3.4, 0.45)
    const slab1 = new THREE.Mesh(slab1Geo, darkSlateMaterial)
    slab1.position.set(-0.5, 0.2, 0)
    slab1.rotation.set(0.1, 0.25, -0.05)
    slab1.castShadow = true
    slab1.receiveShadow = true
    sculptureGroup.add(slab1)

    // Slab 2: Horizontal Interlocking Cantilever
    const slab2Geo = new THREE.BoxGeometry(3.2, 0.9, 0.5)
    const slab2 = new THREE.Mesh(slab2Geo, titaniumMaterial)
    slab2.position.set(0.4, -0.3, 0.4)
    slab2.rotation.set(-0.15, -0.3, 0.1)
    slab2.castShadow = true
    slab2.receiveShadow = true
    sculptureGroup.add(slab2)

    // Slab 3: Angular Precision Wedge / Fin
    const slab3Geo = new THREE.BoxGeometry(0.9, 2.0, 0.9)
    const slab3 = new THREE.Mesh(slab3Geo, accentEdgeMaterial)
    slab3.position.set(0.8, 0.9, -0.2)
    slab3.rotation.set(0.3, 0.4, 0.2)
    slab3.castShadow = true
    slab3.receiveShadow = true
    sculptureGroup.add(slab3)

    // Outer Dimensional Framing (Architectural Wireframe Cage)
    const cageGeo = new THREE.BoxGeometry(4.2, 4.2, 2.2)
    const cage = new THREE.Mesh(cageGeo, wireframeMaterial)
    cage.position.set(0, 0.2, 0)
    sculptureGroup.add(cage)

    // Precision Dimension Rings (Architectural datum marks)
    const ringGeo = new THREE.TorusGeometry(2.2, 0.015, 16, 64)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2
    sculptureGroup.add(ring)

    scene.add(sculptureGroup)

    // Mouse Parallax & Smooth Damping
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Animation Loop
    let animationFrameId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Subtle resting rotation
      const baseRotY = elapsedTime * 0.15
      const baseRotX = Math.sin(elapsedTime * 0.2) * 0.08

      // Smooth mouse follow
      targetX += (mouseX * 0.45 - targetX) * 0.04
      targetY += (mouseY * 0.35 - targetY) * 0.04

      sculptureGroup.rotation.y = baseRotY + targetX
      sculptureGroup.rotation.x = baseRotX - targetY

      // Secondary floating pulse on fin
      slab3.position.y = 0.9 + Math.sin(elapsedTime * 0.8) * 0.05
      ring.rotation.z = elapsedTime * 0.05

      renderer.render(scene, camera)
    }

    animate()

    // Resize Handler
    const handleResize = () => {
      if (!container) return
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      slab1Geo.dispose()
      slab2Geo.dispose()
      slab3Geo.dispose()
      cageGeo.dispose()
      ringGeo.dispose()
      darkSlateMaterial.dispose()
      titaniumMaterial.dispose()
      accentEdgeMaterial.dispose()
      wireframeMaterial.dispose()
      ringMat.dispose()
    }
  }, [])

  return (
    <div className="spatial-sculpture-wrapper" aria-hidden="true">
      <div className="spatial-sculpture-canvas" ref={mountRef} />
      <div className="spatial-sculpture-coords">
        <span>DIM: 4.2 × 4.2 × 2.2m</span>
        <span>LAT: 28.6139° N</span>
        <span>SPEC: TITANIUM / SLATE</span>
      </div>
    </div>
  )
}
