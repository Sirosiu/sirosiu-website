import * as THREE from 'three';

export interface FluidConfig {
  container: HTMLElement;
  stiffness?: number; // Hooke spring constant k
  damping?: number;   // Viscous damping c
}

export class GelatinousFluidEngine {
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private material: THREE.ShaderMaterial;
  private mesh: THREE.Mesh;
  private rafId = 0;

  // Spring-mass surface tension telemetry
  private stiffness: number;
  private damping: number;
  private lastScrollY = window.scrollY;
  private scrollVel = 0;
  private springScrollPos = 0;
  private springScrollVel = 0;

  private pointerTarget = new THREE.Vector2(0, 0);
  private springPointerPos = new THREE.Vector2(0, 0);
  private springPointerVel = new THREE.Vector2(0, 0);

  constructor({ container, stiffness = 0.14, damping = 0.84 }: FluidConfig) {
    this.stiffness = stiffness;
    this.damping = damping;

    this.camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
    this.camera.position.z = 4.2;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setClearColor(0x08080a, 1);
    container.appendChild(this.renderer.domElement);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScrollStretch: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uPointerVel: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uScrollStretch;
        uniform vec2 uPointer;
        uniform vec2 uPointerVel;

        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPos;
        varying float vDisplacement;

        // Compact 3D Simplex Noise
        vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod(i, 289.0);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 1.0 / 7.0;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0) * 2.0 + 1.0;
          vec4 s1 = floor(b1) * 2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        // Surface tension displacement field
        vec3 deform(vec3 pos) {
          float freq = 1.25;
          float speed = uTime * 0.65;
          float n1 = snoise(pos * freq + vec3(0.0, speed, speed * 0.5));
          float n2 = snoise(pos * (freq * 2.1) - vec3(speed * 0.8));

          // Pointer Gaussian dent & shear
          float distToMouse = length(pos.xy - uPointer * 1.4);
          float mouseInfluence = exp(-distToMouse * distToMouse * 2.2);

          float disp = (n1 * 0.18 + n2 * 0.06) * (1.0 + abs(uScrollStretch) * 0.9);
          disp += mouseInfluence * (0.28 + length(uPointerVel) * 0.8);

          vec3 warped = pos + normalize(pos) * disp;
          // Isochoric (volume-preserving) vertical stretch on scroll velocity
          float stretch = clamp(uScrollStretch * 0.22, -0.45, 0.45);
          warped.y *= (1.0 + stretch);
          warped.xz *= (1.0 - stretch * 0.38);
          warped.xy += uPointerVel * mouseInfluence * 0.45;
          return warped;
        }

        void main() {
          vec3 p0 = deform(position);
          vDisplacement = length(p0 - position);

          // Finite-difference tangent basis for accurate specular normals
          float eps = 0.015;
          vec3 tangent = normalize(cross(normal, vec3(0.0, 1.0, 0.0) + 0.001));
          vec3 bitangent = normalize(cross(normal, tangent));
          vec3 p1 = deform(position + tangent * eps);
          vec3 p2 = deform(position + bitangent * eps);
          vec3 computedNormal = normalize(cross(p1 - p0, p2 - p0));

          vNormal = normalize(normalMatrix * computedNormal);
          vec4 mvPosition = modelViewMatrix * vec4(p0, 1.0);
          vViewPosition = -mvPosition.xyz;
          vWorldPos = (modelMatrix * vec4(p0, 1.0)).xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPos;
        varying float vDisplacement;

        // Procedural high-contrast studio light probes for liquid refraction
        vec3 sampleEnvMap(vec3 dir) {
          float topLight = smoothstep(0.65, 0.98, dir.y);
          float sideRim  = smoothstep(0.4, 0.9, abs(dir.x)) * smoothstep(-0.2, 0.6, dir.z);
          float gridBand = pow(sin(dir.y * 18.0 + dir.x * 12.0) * 0.5 + 0.5, 8.0) * 0.35;
          vec3 base = vec3(0.04, 0.045, 0.06);
          return base + vec3(0.85, 0.92, 1.0) * topLight + vec3(0.35, 0.58, 0.95) * sideRim + gridBand;
        }

        void main() {
          vec3 N = normalize(vNormal);
          vec3 V = normalize(vViewPosition);

          // Schlick Fresnel approximation
          float cosTheta = max(dot(N, V), 0.0);
          float fresnel = pow(1.0 - cosTheta, 3.6);

          // Multi-wavelength IOR dispersion (Chromatic Aberration)
          vec3 refractR = refract(-V, N, 1.0 / 1.12);
          vec3 refractG = refract(-V, N, 1.0 / 1.18);
          vec3 refractB = refract(-V, N, 1.0 / 1.25);

          vec3 col;
          col.r = sampleEnvMap(refractR).r;
          col.g = sampleEnvMap(refractG).g;
          col.b = sampleEnvMap(refractB).b;

          // Specular studio highlight (Blinn-Phong dual lobe)
          vec3 L1 = normalize(vec3(1.2, 1.8, 1.5));
          vec3 L2 = normalize(vec3(-1.5, -0.8, 1.0));
          vec3 H1 = normalize(L1 + V);
          vec3 H2 = normalize(L2 + V);
          float spec1 = pow(max(dot(N, H1), 0.0), 96.0) * 1.4;
          float spec2 = pow(max(dot(N, H2), 0.0), 32.0) * 0.45;

          // Chromatic edge dispersion glow driven by Fresnel & displacement tension
          vec3 aberrationRim = vec3(
            pow(1.0 - cosTheta, 2.4) * 0.95,
            pow(1.0 - cosTheta, 3.8) * 0.65,
            pow(1.0 - cosTheta, 1.6) * 1.35
          ) * (0.65 + vDisplacement * 1.8);

          vec3 finalColor = col * (1.0 - fresnel * 0.5) + aberrationRim * fresnel + spec1 + spec2 * vec3(0.4, 0.7, 1.0);
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    this.mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.18, 64), this.material);
    this.scene.add(this.mesh);

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('resize', this.onResize);
    this.animate(0);
  }

  private onScroll = () => {
    const y = window.scrollY;
    this.scrollVel = THREE.MathUtils.clamp((y - this.lastScrollY) * 0.035, -3.0, 3.0);
    this.lastScrollY = y;
  };

  private onPointerMove = (e: PointerEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointerTarget.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointerTarget.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  private onResize = () => {
    const parent = this.renderer.domElement.parentElement;
    if (!parent) return;
    this.camera.aspect = parent.clientWidth / parent.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(parent.clientWidth, parent.clientHeight);
  };

  private animate = (timestamp: number) => {
    this.rafId = requestAnimationFrame(this.animate);

    // 1. Solve Hookean spring-mass equation for scroll stretch
    const scrollForce = -this.stiffness * (this.springScrollPos - this.scrollVel);
    this.springScrollVel = (this.springScrollVel + scrollForce) * this.damping;
    this.springScrollPos += this.springScrollVel;
    this.scrollVel *= 0.88;

    // 2. Solve 2D Hookean spring-mass for pointer interaction
    const fx = -this.stiffness * (this.springPointerPos.x - this.pointerTarget.x);
    const fy = -this.stiffness * (this.springPointerPos.y - this.pointerTarget.y);
    this.springPointerVel.x = (this.springPointerVel.x + fx) * this.damping;
    this.springPointerVel.y = (this.springPointerVel.y + fy) * this.damping;
    this.springPointerPos.add(this.springPointerVel);

    this.material.uniforms.uTime.value = timestamp * 0.001;
    this.material.uniforms.uScrollStretch.value = this.springScrollPos;
    this.material.uniforms.uPointer.value.copy(this.springPointerPos);
    this.material.uniforms.uPointerVel.value.copy(this.springPointerVel);

    this.mesh.rotation.y = timestamp * 0.00025;
    this.mesh.rotation.x = this.springScrollPos * 0.18;

    this.renderer.render(this.scene, this.camera);
  };

  public dispose() {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('resize', this.onResize);
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
