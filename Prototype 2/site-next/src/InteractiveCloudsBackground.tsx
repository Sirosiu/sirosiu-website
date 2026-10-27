import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface InteractiveCloudsBackgroundProps {
  isActive?: boolean
}

interface CloudPuff {
  baseX: number
  baseY: number
  baseZ: number
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  scale: number
  rotZ: number
  rotSpeed: number
  driftSpeed: number
  undulationSpeed: number
  undulationAmp: number
  phase: number
  density: number
  clusterId: number
  wiggleEnergy: number
  wiggleFreq: number
}

// Custom volumetric cloud shader for bright, sunny daytime cumulus clouds
// Pure white sunlit crowns, soft airy daylight sky-ambient underbelly shading
const CloudShader = {
  vertexShader: `
    attribute vec3 aInstancePos;
    attribute vec4 aInstanceParams; // x: scale, y: rotation, z: opacity, w: shadowTone
    
    varying vec2 vUv;
    varying float vOpacity;
    varying float vShadowTone;
    varying vec3 vWorldPos;

    void main() {
      vUv = uv;
      float scale = aInstanceParams.x;
      float rotZ = aInstanceParams.y;
      vOpacity = aInstanceParams.z;
      vShadowTone = aInstanceParams.w;

      // Camera-facing billboard basis vectors
      vec3 camRight = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
      vec3 camUp    = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);

      float cosR = cos(rotZ);
      float sinR = sin(rotZ);
      vec2 rotatedLocal = vec2(
        position.x * cosR - position.y * sinR,
        position.x * sinR + position.y * cosR
      );

      vec3 worldPos = aInstancePos + (camRight * rotatedLocal.x + camUp * rotatedLocal.y) * scale;
      vWorldPos = worldPos;

      gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform vec3 uSunColor;
    uniform vec3 uShadowColor;
    uniform vec3 uSkyAmbient;

    varying vec2 vUv;
    varying float vOpacity;
    varying float vShadowTone;
    varying vec3 vWorldPos;

    void main() {
      vec4 tex = texture2D(uTexture, vUv);
      if (tex.a < 0.005) discard;

      // Vertical sunlight gradient inside each puff:
      // Radiant white crown catching sunlight; soft, airy daylight ambient underbelly
      float sunFacing = clamp(vUv.y * 1.35 - 0.08, 0.0, 1.0);
      sunFacing = smoothstep(0.0, 1.0, sunFacing);

      vec3 baseShade = mix(uShadowColor, uSkyAmbient, vShadowTone * 0.45);
      vec3 puffColor = mix(baseShade, uSunColor, sunFacing);

      // Warm golden sun-rim along top contours
      float rim = smoothstep(0.70, 0.98, vUv.y) * (1.0 - smoothstep(0.85, 1.0, abs(vUv.x - 0.5) * 2.0));
      puffColor += vec3(0.07, 0.05, 0.02) * rim;

      float alpha = tex.a * vOpacity;
      gl_FragColor = vec4(puffColor, alpha);
    }
  `,
}

// Procedural soft daylight contact shadow texture (Drei ContactShadows reproduction)
function createSoftShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(24, 42, 68, 0.38)')
    gradient.addColorStop(0.35, 'rgba(28, 48, 76, 0.20)')
    gradient.addColorStop(0.7, 'rgba(35, 56, 88, 0.05)')
    gradient.addColorStop(1, 'rgba(45, 68, 100, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 128, 128)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.generateMipmaps = true
  return texture
}

export default function InteractiveCloudsBackground({ isActive = true }: InteractiveCloudsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isActiveRef = useRef(isActive)
  isActiveRef.current = isActive

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      })
    } catch {
      return
    }

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100)
    camera.position.set(0, -0.2, 23)
    camera.lookAt(0, 0, 0)

    // 1. Radiant Clear Daytime Sky Background
    const skyGeometry = new THREE.PlaneGeometry(130, 80)
    const skyMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        void main() {
          vec3 topSky    = vec3(0.53, 0.70, 0.86);     // #87b3dc (sunny morning sky)
          vec3 midSky    = vec3(0.78, 0.88, 0.95);     // #c7e0f2 (luminous horizon mist)
          vec3 bottomSky = vec3(0.965, 0.957, 0.941); // #f6f4ef (editorial paper horizon)
          
          vec3 sky = mix(bottomSky, midSky, smoothstep(0.0, 0.36, vUv.y));
          sky = mix(sky, topSky, smoothstep(0.36, 1.0, vUv.y));
          gl_FragColor = vec4(sky, 1.0);
        }
      `,
      depthWrite: false,
    })
    const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial)
    skyMesh.position.set(0, 3.0, -22)
    scene.add(skyMesh)

    // 2. Load volumetric cloud texture
    const textureLoader = new THREE.TextureLoader()
    const cloudTexture = textureLoader.load('/assets/cloud.png', () => {
      renderer.render(scene, camera)
    })
    cloudTexture.generateMipmaps = true
    cloudTexture.minFilter = THREE.LinearMipmapLinearFilter

    // 3. Volumetric Cumulus Cloud Material
    const cloudMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: cloudTexture },
        uSunColor: { value: new THREE.Color(0xffffff) },
        uShadowColor: { value: new THREE.Color(0xc2d6ea) },
        uSkyAmbient: { value: new THREE.Color(0xddebf7) },
      },
      vertexShader: CloudShader.vertexShader,
      fragmentShader: CloudShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })

    const cloudGeometry = new THREE.PlaneGeometry(1, 1)

    // 4. TOP-ONLY CLOUD FORMATIONS (Sculpted Islands, leaving center & lower areas clear)
    const clusterConfigs = [
      // Left Island (frames signature and upper-left)
      { cx: -12.5, cy: 7.8, cz: -5.5, count: 34, sx: 5.2, sy: 2.2, sz: 2.0, scale: 6.4, speed: 0.28 },
      // Right Island (frames upper-right)
      { cx: 11.5, cy: 8.2, cz: -6.0, count: 38, sx: 5.6, sy: 2.3, sz: 2.2, scale: 7.0, speed: 0.26 },
      // High Ethereal Wisp (depth)
      { cx: -0.5, cy: 9.3, cz: -8.5, count: 26, sx: 4.8, sy: 1.9, sz: 2.0, scale: 6.0, speed: 0.22 },
    ]

    const puffs: CloudPuff[] = []

    let seed = 4242
    const random = () => {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }

    clusterConfigs.forEach((c, cId) => {
      for (let i = 0; i < c.count; i++) {
        const u = random() * 2 - 1
        const v = random() * 2 - 1
        const w = random() * 2 - 1
        const distFromCenter = Math.hypot(u, v)
        const coreTaper = Math.max(0.35, 1.0 - distFromCenter * 0.42)

        const x = c.cx + u * c.sx
        const y = c.cy + v * c.sy
        const z = c.cz + w * c.sz

        puffs.push({
          baseX: x,
          baseY: y,
          baseZ: z,
          x,
          y,
          z,
          vx: 0,
          vy: 0,
          vz: 0,
          scale: c.scale * coreTaper * (0.85 + random() * 0.4),
          rotZ: random() * Math.PI * 2,
          rotSpeed: (random() - 0.5) * 0.0018,
          driftSpeed: c.speed * (0.92 + random() * 0.16),
          undulationSpeed: 0.35 + random() * 0.2,
          undulationAmp: 0.18 + random() * 0.22,
          phase: random() * Math.PI * 2,
          density: 0.82 + random() * 0.18,
          clusterId: cId,
          wiggleEnergy: 0.0,
          wiggleFreq: 14.0 + random() * 4.0,
        })
      }
    })

    const totalPuffs = puffs.length

    const instancedMesh = new THREE.InstancedMesh(cloudGeometry, cloudMaterial, totalPuffs)
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

    const instancePosData = new Float32Array(totalPuffs * 3)
    const instanceParamsData = new Float32Array(totalPuffs * 4)

    const instancePosAttr = new THREE.InstancedBufferAttribute(instancePosData, 3)
    instancePosAttr.setUsage(THREE.DynamicDrawUsage)
    cloudGeometry.setAttribute('aInstancePos', instancePosAttr)

    const instanceParamsAttr = new THREE.InstancedBufferAttribute(instanceParamsData, 4)
    instanceParamsAttr.setUsage(THREE.DynamicDrawUsage)
    cloudGeometry.setAttribute('aInstanceParams', instanceParamsAttr)

    scene.add(instancedMesh)

    // 5. Floor Contact Shadows (at Y = -8.8)
    const shadowTexture = createSoftShadowTexture()
    const shadowGeometry = new THREE.PlaneGeometry(1, 1)
    shadowGeometry.rotateX(-Math.PI / 2)

    const shadowMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      opacity: 0.28,
    })

    const shadowCount = clusterConfigs.length
    const shadowMesh = new THREE.InstancedMesh(shadowGeometry, shadowMaterial, shadowCount)
    shadowMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    scene.add(shadowMesh)

    const shadowDummy = new THREE.Object3D()

    // 6. Raycaster: Only triggers on click to wiggle clouds (hovering does nothing)
    const raycaster = new THREE.Raycaster()
    const closestPoint = new THREE.Vector3()
    const puffPos = new THREE.Vector3()

    const onClick = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 0.7) return
      const rect = canvas.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return

      const clickNdc = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      )
      raycaster.setFromCamera(clickNdc, camera)

      // Check distance from click line-of-sight to each cloud puff
      let hitAny = false
      for (let i = 0; i < totalPuffs; i++) {
        const puff = puffs[i]
        puffPos.set(puff.x, puff.y, puff.z)
        raycaster.ray.closestPointToPoint(puffPos, closestPoint)
        const dist = puffPos.distanceTo(closestPoint)

        const hitRadius = puff.scale * 0.9
        if (dist < hitRadius) {
          hitAny = true
          const intensity = Math.max(0.35, 1.0 - dist / hitRadius)
          // Gentle wiggle energy
          puff.wiggleEnergy = Math.min(1.0, puff.wiggleEnergy + intensity * 0.85)
          // Subtle soft displacement nudge
          const dx = puffPos.x - closestPoint.x
          const dy = puffPos.y - closestPoint.y
          const dLen = Math.hypot(dx, dy) || 1
          puff.vx += (dx / dLen) * 1.6 * intensity
          puff.vy += (dy / dLen) * 1.6 * intensity
        }
      }

      // If clicked near the clouds generally (within 6 units)
      if (!hitAny) {
        for (let i = 0; i < totalPuffs; i++) {
          const puff = puffs[i]
          puffPos.set(puff.x, puff.y, puff.z)
          raycaster.ray.closestPointToPoint(puffPos, closestPoint)
          const dist = puffPos.distanceTo(closestPoint)
          if (dist < 5.8) {
            const intensity = (1.0 - dist / 5.8) * 0.6
            puff.wiggleEnergy = Math.min(0.8, puff.wiggleEnergy + intensity)
            puff.vx += (Math.random() - 0.5) * 1.2 * intensity
            puff.vy += (Math.random() - 0.5) * 1.2 * intensity
          }
        }
      }
    }

    // Attach click listener for cloud wiggling
    window.addEventListener('click', onClick)

    let width = window.innerWidth
    let height = window.innerHeight
    let active = true

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width || window.innerWidth
      height = rect.height || window.innerHeight
      const aspect = width / Math.max(1, height)

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(width, height, false)
      camera.aspect = aspect
      camera.updateProjectionMatrix()
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    // View boundaries: loop across 48 units seamlessly
    const wrapMinX = -24
    const wrapMaxX = 24
    const wrapSpan = wrapMaxX - wrapMinX

    let frameId = 0
    let lastTime = performance.now()

    const animate = (time: number) => {
      if (!active) return

      const dt = Math.min((time - lastTime) / 1000.0, 0.05)
      lastTime = time

      if (!isActiveRef.current) {
        frameId = requestAnimationFrame(animate)
        return
      }

      const currentTime = time / 1000.0

      const clusterSumX = new Float32Array(clusterConfigs.length)
      const clusterSumY = new Float32Array(clusterConfigs.length)
      const clusterCounts = new Int32Array(clusterConfigs.length)

      for (let i = 0; i < totalPuffs; i++) {
        const puff = puffs[i]

        // Continuous horizontal drift (hovering does nothing)
        puff.baseX += puff.driftSpeed * dt
        if (puff.baseX > wrapMaxX) {
          puff.baseX -= wrapSpan
          puff.x -= wrapSpan
        }

        const undulationY = Math.sin(currentTime * puff.undulationSpeed + puff.phase) * puff.undulationAmp
        const targetY = puff.baseY + undulationY

        // Little elastic wiggle physics on click
        let wiggleX = 0
        let wiggleY = 0
        let wiggleRot = 0
        let wiggleScale = 1.0

        if (puff.wiggleEnergy > 0.002) {
          const wPhase = currentTime * puff.wiggleFreq + puff.phase
          wiggleX = Math.sin(wPhase) * puff.wiggleEnergy * 0.32
          wiggleY = Math.cos(wPhase * 1.15) * puff.wiggleEnergy * 0.32
          wiggleRot = Math.sin(wPhase * 0.85) * puff.wiggleEnergy * 0.09
          wiggleScale = 1.0 + Math.sin(wPhase * 1.3) * puff.wiggleEnergy * 0.07

          // Exponential decay: wiggles a little and softly settles down in ~0.6s
          puff.wiggleEnergy *= Math.pow(0.06, dt)
        } else {
          puff.wiggleEnergy = 0
        }

        // Smooth spring restoration for click nudge
        const springK = 3.6
        const damping = 0.88
        puff.vx += (puff.baseX - puff.x) * springK * dt
        puff.vy += (targetY - puff.y) * springK * dt
        puff.vz += (puff.baseZ - puff.z) * springK * dt
        puff.vx *= damping
        puff.vy *= damping
        puff.vz *= damping

        puff.x += puff.vx * dt
        puff.y += puff.vy * dt
        puff.z += puff.vz * dt

        clusterSumX[puff.clusterId] += puff.x
        clusterSumY[puff.clusterId] += puff.y
        clusterCounts[puff.clusterId] += 1

        puff.rotZ += puff.rotSpeed

        const pIdx = i * 3
        instancePosData[pIdx + 0] = puff.x + wiggleX
        instancePosData[pIdx + 1] = puff.y + wiggleY
        instancePosData[pIdx + 2] = puff.z

        const paramIdx = i * 4
        const scalePulse = 1.0 + Math.sin(currentTime * 0.32 + puff.phase) * 0.04
        instanceParamsData[paramIdx + 0] = puff.scale * scalePulse * wiggleScale
        instanceParamsData[paramIdx + 1] = puff.rotZ + wiggleRot
        instanceParamsData[paramIdx + 2] = 0.95 * puff.density
        instanceParamsData[paramIdx + 3] = (puff.z + 10.0) / 15.0
      }

      instancePosAttr.needsUpdate = true
      instanceParamsAttr.needsUpdate = true

      // Update Island Ground Shadows at Floor Level (Y = -8.8)
      for (let s = 0; s < clusterConfigs.length; s++) {
        const count = clusterCounts[s] || 1
        let avgX = clusterSumX[s] / count
        const avgY = clusterSumY[s] / count

        let shadowX = avgX
        if (shadowX > wrapMaxX) shadowX -= wrapSpan
        else if (shadowX < wrapMinX) shadowX += wrapSpan

        const shadowZ = clusterConfigs[s].cz - 1.2
        const heightFactor = Math.max(0.5, (avgY - (-8.8)) / 14.0)
        const cConfig = clusterConfigs[s]

        shadowDummy.position.set(shadowX, -8.8, shadowZ)
        shadowDummy.scale.set(cConfig.sx * 2.2 * (0.8 + heightFactor * 0.35), 1, cConfig.sy * 2.5 * (0.8 + heightFactor * 0.35))
        shadowDummy.updateMatrix()

        shadowMesh.setMatrixAt(s, shadowDummy.matrix)
      }
      shadowMesh.instanceMatrix.needsUpdate = true

      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)

    return () => {
      active = false
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('click', onClick)
      scene.clear()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      className={`hero-clouds-ambient-wrap${isActive ? ' is-active' : ''}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="hero-clouds-ambient-canvas" />
      <div className="hero-clouds-vignette" />
    </div>
  )
}
