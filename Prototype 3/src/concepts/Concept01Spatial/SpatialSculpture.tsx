import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

export const SpatialSculpture: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const width = container.clientWidth || 600
    const height = container.clientHeight || 500

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
    camera.position.set(0, 0, 6.2)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // Materials: Dark Anodized Titanium + Brushed Slate + Machined Copper Core
    const darkTitanium = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#121622'),
      metalness: 0.9,
      roughness: 0.2,
      clearcoat: 0.35,
      clearcoatRoughness: 0.1,
    })

    const brushedSlate = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#1e2536'),
      metalness: 0.78,
      roughness: 0.28,
      clearcoat: 0.2,
    })

    const copperCoreMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#d97706'),
      metalness: 0.96,
      roughness: 0.12,
      emissive: new THREE.Color('#78350f'),
      emissiveIntensity: 0.2,
    })

    const datumRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    })

    // Nested Architectural Sculpture Group
    const artifactGroup = new THREE.Group()
    scene.add(artifactGroup)

    // Outer Monolith Frame (Chamfered Beveled Pillars)
    const outerRing = new THREE.Group()
    const pillarGeo = new RoundedBoxGeometry(0.32, 2.7, 0.32, 6, 0.035)

    ;[-1.15, 1.15].forEach((x) => {
      const p1 = new THREE.Mesh(pillarGeo, darkTitanium)
      p1.position.set(x, 0, 0)
      p1.castShadow = true
      p1.receiveShadow = true
      outerRing.add(p1)

      const p2 = new THREE.Mesh(pillarGeo, darkTitanium)
      p2.rotation.z = Math.PI / 2
      p2.position.set(0, x, 0)
      p2.castShadow = true
      p2.receiveShadow = true
      outerRing.add(p2)
    })
    artifactGroup.add(outerRing)

    // Mid Interlocking Gimbal Slab with 45-degree rotation
    const midSlabGeo = new RoundedBoxGeometry(1.65, 1.65, 0.45, 6, 0.04)
    const midSlab = new THREE.Mesh(midSlabGeo, brushedSlate)
    midSlab.rotation.set(Math.PI / 4, Math.PI / 4, 0)
    midSlab.castShadow = true
    midSlab.receiveShadow = true
    artifactGroup.add(midSlab)

    // Inner Precision Machined Octahedral Core
    const coreGeo = new THREE.OctahedronGeometry(0.55, 0)
    const coreMesh = new THREE.Mesh(coreGeo, copperCoreMat)
    coreMesh.castShadow = true
    coreMesh.receiveShadow = true
    artifactGroup.add(coreMesh)

    // Outer Datum Ring Cage (Architectural Coordinate Reference)
    const datumRingGeo = new THREE.TorusGeometry(2.1, 0.012, 16, 64)
    const datumRing = new THREE.Mesh(datumRingGeo, datumRingMat)
    datumRing.rotation.x = Math.PI / 2
    artifactGroup.add(datumRing)

    // 3-Point Architectural Studio Lighting Rig (Argon Specification)
    const ambientLight = new THREE.AmbientLight(0x0a0f1d, 0.8)
    scene.add(ambientLight)

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4)
    keyLight.position.set(5, 7, 5)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 1024
    keyLight.shadow.mapSize.height = 1024
    scene.add(keyLight)

    // Cool Rim Light grazing bevels
    const rimLight = new THREE.SpotLight(0x38bdf8, 5.0, 20, Math.PI / 4, 0.5)
    rimLight.position.set(-6, 4, -4)
    scene.add(rimLight)

    // Warm Bounce Fill
    const warmFill = new THREE.PointLight(0xf97316, 2.2, 12)
    warmFill.position.set(3, -5, 2)
    scene.add(warmFill)

    // Heavy Inertial Mouse Damping State (Argon Damping Factor: 0.035)
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }
    window.addEventListener('pointermove', onPointerMove)

    const clock = new THREE.Clock()
    let reqId: number

    const animate = () => {
      reqId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Inertial damping
      mouse.x += (mouse.targetX - mouse.x) * 0.035
      mouse.y += (mouse.targetY - mouse.y) * 0.035

      artifactGroup.rotation.y = t * 0.14 + mouse.x * 0.65
      artifactGroup.rotation.x = Math.sin(t * 0.3) * 0.12 - mouse.y * 0.45

      // Internal gimbal mechanics
      midSlab.rotation.z = -t * 0.28
      coreMesh.rotation.y = t * 0.6
      coreMesh.rotation.x = t * 0.4
      datumRing.rotation.z = t * 0.05

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!container) return
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(reqId)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      pillarGeo.dispose()
      midSlabGeo.dispose()
      coreGeo.dispose()
      datumRingGeo.dispose()
      darkTitanium.dispose()
      brushedSlate.dispose()
      copperCoreMat.dispose()
      datumRingMat.dispose()
    }
  }, [])

  return (
    <div className="spatial-sculpture-wrapper c1-glass-panel c1-crosshair" aria-hidden="true">
      <div className="spatial-sculpture-canvas" ref={mountRef} />
      <div className="spatial-sculpture-coords">
        <span>CNC ARCHITECTURAL MONOLITH // REV.03</span>
        <span>AZIMUTH: 28.6139° N</span>
        <span>MATERIAL: ANODIZED TITANIUM + COPPER CORE</span>
      </div>
    </div>
  )
}
