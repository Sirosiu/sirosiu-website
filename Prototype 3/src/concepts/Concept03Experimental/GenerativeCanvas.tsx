import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const GenerativeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const width = container.clientWidth || 600
    const height = container.clientHeight || 500

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.set(0, 0, 18)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Particle Count & Buffers
    const particleCount = 2800
    const positions = new Float32Array(particleCount * 3)
    const originalPositions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    // Palette: Electric Cobalt, Acid Lime, Vivid Coral
    const colorA = new THREE.Color(0x3b82f6) // Cobalt
    const colorB = new THREE.Color(0xa3e635) // Acid Lime
    const colorC = new THREE.Color(0xf43f5e) // Coral

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      // Torus / Vortex distribution
      const u = Math.random() * Math.PI * 2
      const v = Math.random() * Math.PI * 2
      const r = 7 + (Math.random() - 0.5) * 3
      const tubeR = 2.5 + (Math.random() - 0.5) * 1.5

      const x = (r + tubeR * Math.cos(v)) * Math.cos(u)
      const y = (r + tubeR * Math.cos(v)) * Math.sin(u)
      const z = tubeR * Math.sin(v)

      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z

      originalPositions[i3] = x
      originalPositions[i3 + 1] = y
      originalPositions[i3 + 2] = z

      velocities[i3] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02

      // Color interpolation
      const t = Math.random()
      const pColor = t < 0.5 ? colorA.clone().lerp(colorB, t * 2) : colorB.clone().lerp(colorC, (t - 0.5) * 2)
      colors[i3] = pColor.r
      colors[i3 + 1] = pColor.g
      colors[i3 + 2] = pColor.b
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Create a circular particle texture
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 32, 32)
    }
    const particleTexture = new THREE.CanvasTexture(canvas)

    const material = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const pointCloud = new THREE.Points(geometry, material)
    scene.add(pointCloud)

    // Mouse Tracking for Interactive Flow
    let mouseX = 0
    let mouseY = 0
    let targetMouseX = 0
    let targetMouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    }

    window.addEventListener('mousemove', handleMouseMove)

    let animationFrameId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      targetMouseX += (mouseX * 4 - targetMouseX) * 0.05
      targetMouseY += (mouseY * 4 - targetMouseY) * 0.05

      // Rotate whole cloud
      pointCloud.rotation.z = time * 0.08
      pointCloud.rotation.y = time * 0.05 + targetMouseX * 0.15
      pointCloud.rotation.x = targetMouseY * 0.15

      const pos = geometry.attributes.position.array as Float32Array

      // Animate individual particles with harmonic curl perturbation
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const ox = originalPositions[i3]
        const oy = originalPositions[i3 + 1]
        const oz = originalPositions[i3 + 2]

        const angle = time * 0.3 + (i % 50) * 0.1
        const wave = Math.sin(angle) * 0.4

        pos[i3] = ox + Math.cos(angle * 0.7) * wave + (targetMouseX * 0.2)
        pos[i3 + 1] = oy + Math.sin(angle * 0.8) * wave + (targetMouseY * 0.2)
        pos[i3 + 2] = oz + Math.cos(angle * 0.5) * wave
      }

      geometry.attributes.position.needsUpdate = true
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
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      particleTexture.dispose()
    }
  }, [])

  return (
    <div className="experimental-canvas-container" aria-hidden="true">
      <div className="experimental-canvas-target" ref={mountRef} />
      <div className="experimental-canvas-hud">
        <span>PARTICLES: 2,800 • FLOW: HARMONIC CURL</span>
        <span>RGB: COBALT / ACID LIME / CORAL</span>
      </div>
    </div>
  )
}
