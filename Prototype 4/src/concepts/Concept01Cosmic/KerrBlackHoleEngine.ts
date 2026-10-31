import * as THREE from 'three';

export interface KerrConfig {
  container: HTMLElement;
  spin?: number;        // Kerr spin parameter a* (0.0 to 0.998)
  inclination?: number; // Base disk tilt in radians
}

export class KerrBlackHoleEngine {
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private renderer: THREE.WebGLRenderer;
  private material: THREE.ShaderMaterial;
  private rafId = 0;

  private scrollVelocity = 0;
  private smoothedVelocity = 0;
  private scrollProgress = 0;
  private lastScrollY = window.scrollY;

  constructor({ container, spin = 0.94, inclination = 1.38 }: KerrConfig) {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        uSpin: { value: spin },
        uInclination: { value: inclination },
        uVelocity: { value: 0 },
        uScroll: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform float uSpin;
        uniform float uInclination;
        uniform float uVelocity;
        uniform float uScroll;

        #define PI 3.14159265359

        // Compact 2D hash & value noise for accretion turbulence
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }

        float fbm(vec2 p) {
          float v = 0.0, amp = 0.5;
          mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
          for (int i = 0; i < 4; i++) {
            v += amp * noise(p);
            p = rot * p * 2.03;
            amp *= 0.5;
          }
          return v;
        }

        // Relativistic Doppler shift: maps beaming factor delta to spectral RGB
        vec3 dopplerSpectrum(float temp, float delta) {
          float shifted = temp * pow(delta, 1.4);
          vec3 redshifted  = vec3(0.85, 0.16, 0.04); // Receding limb
          vec3 neutral     = vec3(0.98, 0.78, 0.52); // Rest frame core
          vec3 blueshifted = vec3(0.55, 0.82, 1.00); // Approaching relativistic jet

          vec3 col = mix(redshifted, neutral, smoothstep(0.4, 1.0, shifted));
          col = mix(col, blueshifted, smoothstep(1.0, 1.85, shifted));
          return col * pow(delta, 3.2); // Relativistic beaming intensity D^3+alpha
        }

        void main() {
          vec2 uv = (vUv - 0.5) * 2.0;
          uv.x *= uResolution.x / uResolution.y;

          // Scroll velocity warps camera FOV and tilts inclination
          float warp = 1.0 - clamp(abs(uVelocity) * 0.12, 0.0, 0.35);
          vec2 p = uv * warp * 3.6;

          // Kerr frame-dragging shifts shadow center horizontally by spin parameter a*
          float frameDrag = uSpin * 0.22;
          vec2 pShifted = p - vec2(frameDrag, 0.0);
          float b = length(pShifted); // Impact parameter

          // Critical photon capture radius (asymmetric prograde vs retrograde)
          float rShadow = 1.48 - 0.18 * uSpin * (pShifted.x / max(b, 0.001));

          // Einstein Ring geodesic deflection approximation
          float inc = uInclination + uVelocity * 0.08;
          float cosInc = cos(inc);
          float sinInc = sin(inc);

          // Primary image + bent secondary lensed image over the shadow poles
          float deflection = (rShadow * rShadow) / max(b * b - rShadow * 0.65, 0.04);
          vec2 diskPlanePrimary = vec2(p.x, p.y / max(cosInc, 0.08));
          vec2 diskPlaneLensed  = vec2(p.x, (p.y - sign(p.y) * deflection * sinInc) / max(sinInc, 0.1));

          float r1 = length(diskPlanePrimary);
          float r2 = length(diskPlaneLensed);

          vec3 color = vec3(0.031, 0.031, 0.035); // Matte charcoal void (#080809)

          // Evaluate both primary equatorial disk and lensed Einstein halo
          for (int img = 0; img < 2; img++) {
            vec2 dp = (img == 0) ? diskPlanePrimary : diskPlaneLensed;
            float r = (img == 0) ? r1 : r2;
            float weight = (img == 0) ? 1.0 : smoothstep(rShadow * 0.85, rShadow * 1.4, b) * 0.85;

            // ISCO (Innermost Stable Circular Orbit) shrinks with prograde Kerr spin
            float rISCO = 1.65 - 0.45 * uSpin;
            if (r > rISCO && r < 6.5) {
              // Keplerian angular velocity omega = 1 / (r^(3/2) + a*)
              float omega = 1.0 / (pow(r, 1.5) + uSpin);
              float angle = atan(dp.y, dp.x) + uTime * omega * 2.4 + uScroll * 1.5;

              // Spiral magneto-rotational turbulence
              vec2 polarUv = vec2(r * 2.2, angle + r * 1.8);
              float dust = fbm(polarUv * vec2(1.5, 2.0));
              float rings = sin(r * 14.0 - uTime * 2.0 + dust * 4.0) * 0.5 + 0.5;

              float radialProfile = smoothstep(rISCO, rISCO + 0.4, r) * exp(-(r - rISCO) * 0.72);
              float intensity = radialProfile * (0.45 + 0.55 * dust) * (0.7 + 0.3 * rings);

              // Relativistic orbital beta (v/c) and Lorentz factor gamma
              float beta = clamp(sqrt(1.0 / max(r - 0.5, 0.5)) * 0.58 + abs(uVelocity) * 0.08, 0.0, 0.88);
              float gamma = 1.0 / sqrt(1.0 - beta * beta);
              float cosTheta = -dp.x / max(r, 0.001) * sinInc; // Approaching on left (-x)
              float gravRedshift = sqrt(max(1.0 - (rShadow * 0.75) / r, 0.05));
              float delta = gravRedshift / (gamma * (1.0 - beta * cosTheta));

              vec3 diskCol = dopplerSpectrum(intensity * 1.35, delta);
              color += diskCol * intensity * weight;
            }
          }

          // Razor-sharp Lyapunov photon ring at the critical curve b = rShadow
          float photonRing = exp(-abs(b - rShadow) * 28.0) * (1.2 + abs(uVelocity) * 0.8);
          float einsteinGlow = exp(-abs(b - rShadow * 1.06) * 9.0) * 0.35;
          float ringAsymmetry = 1.0 - 0.45 * (pShifted.x / max(b, 0.001)); // Brighter on prograde edge
          color += vec3(0.85, 0.92, 1.0) * photonRing * ringAsymmetry;
          color += vec3(0.95, 0.55, 0.25) * einsteinGlow;

          // Carve out the event horizon shadow on the foreground occlusion mask
          float horizonMask = smoothstep(rShadow * 0.96, rShadow * 1.01, b);
          color *= mix(0.02, 1.0, horizonMask);

          // Subtle ACES filmic tone curve
          color = (color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material));
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize);
    this.animate(0);
  }

  private onScroll = () => {
    const currentY = window.scrollY;
    const delta = currentY - this.lastScrollY;
    this.lastScrollY = currentY;
    this.scrollVelocity = THREE.MathUtils.clamp(delta * 0.04, -3.5, 3.5);
    this.scrollProgress = currentY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
  };

  private onResize = () => {
    const parent = this.renderer.domElement.parentElement;
    if (!parent) return;
    this.renderer.setSize(parent.clientWidth, parent.clientHeight);
    this.material.uniforms.uResolution.value.set(parent.clientWidth, parent.clientHeight);
  };

  private animate = (timestamp: number) => {
    this.rafId = requestAnimationFrame(this.animate);
    // Exponential inertial decay for silky scroll response
    this.smoothedVelocity += (this.scrollVelocity - this.smoothedVelocity) * 0.08;
    this.scrollVelocity *= 0.92;

    this.material.uniforms.uTime.value = timestamp * 0.001;
    this.material.uniforms.uVelocity.value = this.smoothedVelocity;
    this.material.uniforms.uScroll.value = this.scrollProgress;
    this.renderer.render(this.scene, this.camera);
  };

  public dispose() {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
    this.material.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
