import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
    } catch {
      return
    }

    const scene = new THREE.Scene()
    // Match the official Raging Sea framing: a close diagonal view over a
    // square, densely subdivided plane.
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.set(1.25, 1.25, 1.25)
    camera.lookAt(0, 0, 0)

    const geometry = new THREE.PlaneGeometry(2, 2, 256, 256)
    geometry.rotateX(-Math.PI / 2)
    const material = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: { uTime: { value: 0 }, uPointer: { value: new THREE.Vector2(0, 0) } },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uPointer;
        varying float vHeight;
        float hash(vec3 p) {
          p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }
        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x),
                         mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
                     mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
                         mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
        }
        float elevation(vec3 p) {
          float height = sin(p.x * 3.0 + uTime * 1.25) * sin(p.z * 1.0 + uTime * 1.25) * 0.15;
          for (int i = 1; i <= 3; i++) {
            float octave = float(i);
            height -= abs(noise(vec3((p.xz + 2.0) * 2.0 * octave, uTime * 0.3)) * 0.18 / octave);
          }
          return height;
        }
        void main() {
          vec3 p = position;
          float cursor = exp(-distance(p.xz, uPointer * 1.7) * 2.2) * 0.08;
          p.y += elevation(p) + cursor;
          vHeight = p.y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        varying float vHeight;
        void main() {
          vec3 deep = vec3(0.018, 0.025, 0.03);
          vec3 light = vec3(0.25, 0.52, 0.49);
          vec3 accent = vec3(0.82, 0.46, 0.23);
          float trough = pow(clamp(1.0 - smoothstep(-0.28, 0.08, vHeight), 0.0, 1.0), 4.0);
          float crest = smoothstep(0.02, 0.22, vHeight);
          gl_FragColor = vec4(mix(mix(deep, light, crest * 0.62), accent, trough * 0.34), 0.94);
        }
      `,
    })
    const wave = new THREE.Mesh(geometry, material)
    // The source demo fills its viewport with the 2×2 terrain. The hero uses a
    // centered canvas column, so preserve that same close framing with a scale.
    wave.scale.setScalar(2.8)
    scene.add(wave)

    let width = 0
    let height = 0
    let frame = 0
    let active = true
    const pointer = new THREE.Vector2(0, 0)
    const onPointerMove = (event: PointerEvent) => {
      pointer.set(event.clientX / Math.max(1, width) - 0.5, -(event.clientY / Math.max(1, height) - 0.5))
    }
    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(1, height)
      camera.updateProjectionMatrix()
    }
    const render = (time: number) => {
      if (!active) return
      frame = window.requestAnimationFrame(render)
      material.uniforms.uTime.value = time * 0.001
      material.uniforms.uPointer.value.lerp(pointer, 0.04)
      renderer.render(scene, camera)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    frame = window.requestAnimationFrame(render)
    return () => {
      active = false
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return <canvas className="hero-wave-canvas" ref={canvasRef} aria-hidden="true" />
}
