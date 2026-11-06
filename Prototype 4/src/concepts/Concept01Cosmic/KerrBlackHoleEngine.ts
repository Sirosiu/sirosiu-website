import * as THREE from 'three';

export interface KerrConfig {
  container: HTMLElement;
  spin?: number;        // Kerr spin parameter a* (0.0 to 0.998)
  inclination?: number; // Base disk tilt in radians
  initialPalette?: number; // 0: Solar, 1: Gold, 2: Violet, 3: Monochrome
}

export class KerrBlackHoleEngine {
  private container: HTMLElement;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private renderer: THREE.WebGLRenderer;
  private material: THREE.ShaderMaterial;
  private rafId = 0;

  // Scroll & Elastic Zoom Physics (Hookean Spring-Mass)
  private scrollVelocity = 0;
  private smoothedVelocity = 0;
  private scrollProgress = 0;
  private lastScrollY = window.scrollY;

  // Elastic Camera Zoom: Expands on scroll, snaps back to 1.0
  private currentZoom = 1.0;
  private zoomVelocity = 0;
  private springStiffness = 45.0; // Spring constant k
  private springDamping = 8.5;     // Damping coefficient c

  // Interactive Cursor Micro-Singularity
  private pointerTarget = new THREE.Vector2(10.0, 10.0); // Start off-screen
  private smoothedPointer = new THREE.Vector2(10.0, 10.0);

  // Active Spectral Palette (0: Solar Amber, 1: Gold, 2: Tachyon, 3: Monochrome)
  private currentPalette = 0;

  // Web Audio 43Hz Sub-Bass Gravitational Engine
  private audioCtx: AudioContext | null = null;
  private oscA: OscillatorNode | null = null;
  private oscB: OscillatorNode | null = null;
  private subFilter: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isAudioPlaying = false;

  constructor({ container, spin = 0.94, inclination = 1.38, initialPalette = 0 }: KerrConfig) {
    this.container = container;
    this.currentPalette = initialPalette;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
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
        uCameraZoom: { value: 1.0 },
        uPointer: { value: new THREE.Vector2(10.0, 10.0) },
        uPalette: { value: initialPalette },
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
        uniform float uCameraZoom;
        uniform vec2 uPointer;
        uniform int uPalette;

        #define PI 3.14159265359

        // =========================================================================
        // NOISE HELPERS
        // =========================================================================
        float dfHash21(vec2 p) {
          p = fract(p * vec2(234.34, 435.345));
          p += dot(p, p + 34.23);
          return fract(p.x * p.y);
        }

        vec2 dfHash22(vec2 p) {
          float n = dfHash21(p);
          return vec2(n, dfHash21(p + n));
        }

        float dfNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(dfHash21(i), dfHash21(i + vec2(1.0, 0.0)), f.x),
            mix(dfHash21(i + vec2(0.0, 1.0)), dfHash21(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }

        float adHash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float adNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(adHash(i), adHash(i + vec2(1.0, 0.0)), f.x),
            mix(adHash(i + vec2(0.0, 1.0)), adHash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }

        float adFbm4(vec2 p) {
          float v = 0.0;
          float amp = 0.5;
          mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
          for (int i = 0; i < 4; i++) {
            v += amp * adNoise(p);
            p = rot * p * 2.02 + vec2(13.7, 7.3);
            amp *= 0.5;
          }
          return v;
        }

        vec2 adCurl(vec2 p) {
          const float eps = 0.06;
          float n1 = adFbm4(p + vec2(0.0, eps));
          float n2 = adFbm4(p - vec2(0.0, eps));
          float n3 = adFbm4(p + vec2(eps, 0.0));
          float n4 = adFbm4(p - vec2(eps, 0.0));
          return vec2(n1 - n2, -(n3 - n4)) / (2.0 * eps);
        }

        float bzHash(vec2 p) {
          return fract(sin(dot(p, vec2(41.3, 289.7))) * 43758.5453);
        }

        float bzNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(bzHash(i), bzHash(i + vec2(1.0, 0.0)), f.x),
            mix(bzHash(i + vec2(0.0, 1.0)), bzHash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }

        // =========================================================================
        // 1. PROCEDURAL STARFIELD & GRAVITATIONALLY LENSED DEEP FIELD
        // =========================================================================
        vec3 dfStarSpectrum(float seed) {
          vec3 blueGiant  = vec3(0.62, 0.80, 1.00);
          vec3 whiteMain  = vec3(0.96, 0.97, 1.00);
          vec3 amberDwarf = vec3(1.00, 0.68, 0.36);
          vec3 redGiant   = vec3(1.00, 0.38, 0.22);
          if (seed < 0.35) return mix(blueGiant, whiteMain, seed / 0.35);
          if (seed < 0.75) return mix(whiteMain, amberDwarf, (seed - 0.35) / 0.40);
          return mix(amberDwarf, redGiant, (seed - 0.75) / 0.25);
        }

        vec3 dfStarLayer(vec2 uv, float scale, float densityThreshold, float time) {
          vec2 gv = fract(uv * scale) - 0.5;
          vec2 id = floor(uv * scale);
          vec2 rand = dfHash22(id);
          if (rand.x < densityThreshold) return vec3(0.0);

          vec2 offset = (rand - 0.5) * 0.72;
          vec2 d = gv - offset;
          float distSq = dot(d, d);

          float brightness = smoothstep(densityThreshold, 1.0, rand.x);
          float twinkle = 0.82 + 0.18 * sin(time * (2.0 + rand.y * 5.0) + rand.x * 6.2831);
          float core = exp(-distSq * (95.0 - brightness * 55.0));
          float halo = exp(-distSq * 14.0) * 0.25 * brightness;

          vec3 col = dfStarSpectrum(fract(rand.y * 13.37));
          return col * (core + halo) * brightness * twinkle;
        }

        vec3 dfDistantSpiralGalaxy(vec2 sourceUv) {
          vec2 gUv = sourceUv - vec2(0.28, 0.16);
          mat2 tilt = mat2(0.848, -0.530, 0.530, 0.848);
          vec2 p = tilt * gUv;
          p.y *= 2.65;

          float r = length(p);
          if (r > 2.2) return vec3(0.0);

          float angle = atan(p.y, p.x);
          float logSpiral = angle * 2.0 - 4.2 * log(max(r, 0.04));
          float arms = 0.5 + 0.5 * cos(logSpiral);
          float dust = dfNoise(p * 4.5 + vec2(cos(angle), sin(angle)));

          float coreBulge = exp(-r * r * 9.5) * 1.35;
          float diskEnvelope = exp(-r * 2.3) * smoothstep(0.05, 0.35, r);
          float spiralStructure = diskEnvelope * pow(arms, 1.6) * (0.45 + 0.55 * dust);

          vec3 bulgeCol = vec3(1.00, 0.84, 0.58);
          vec3 armCol   = vec3(0.42, 0.72, 1.00);
          vec3 nebCol   = vec3(0.68, 0.24, 0.88);

          return bulgeCol * coreBulge + mix(armCol, nebCol, dust * 0.45) * spiralStructure * 0.85;
        }

        vec3 computeLensedDeepField(vec2 rayUv, vec2 pointerUv, float time, float spin) {
          vec2 pKerr = rayUv - vec2(spin * 0.22, 0.0);
          float b = length(pKerr);

          // Analytical relativistic deflection: delta_theta = 4GM / (c^2 * b)
          float rEinstein = 2.05;
          float invBSq = 1.0 / max(b * b, 0.08);
          vec2 bhDeflection = pKerr * (rEinstein * rEinstein * invBSq);

          // Frame-dragging swirl azimuthally near ergosphere
          float frameDragAngle = (0.32 * spin) * invBSq;
          float cosD = cos(frameDragAngle);
          float sinD = sin(frameDragAngle);
          bhDeflection = mat2(cosD, -sinD, sinD, cosD) * bhDeflection;

          // Secondary Cursor Micro-Singularity
          vec2 dCursor = rayUv - pointerUv;
          float bCursor = length(dCursor);
          float rECursor = 0.32;
          vec2 cursorDeflection = dCursor * ((rECursor * rECursor) / max(bCursor * bCursor, 0.006));

          vec2 sourceUv = rayUv - bhDeflection - cursorDeflection;

          float ratioBH = (rEinstein * rEinstein) * invBSq;
          float magBH = clamp(1.0 / max(abs(1.0 - ratioBH * ratioBH), 0.28), 0.75, 2.65);

          float ratioCur = (rECursor * rECursor) / max(bCursor * bCursor, 0.01);
          float magCur = clamp(1.0 / max(abs(1.0 - ratioCur * ratioCur), 0.35), 1.0, 2.2);

          vec3 stars = vec3(0.0);
          stars += dfStarLayer(sourceUv, 2.8, 0.90, time) * 1.15;
          stars += dfStarLayer(sourceUv + vec2(17.3, 9.1), 5.6, 0.82, time * 0.8) * 0.65;
          stars += dfStarLayer(sourceUv - vec2(31.7, 24.4), 11.5, 0.72, time * 0.5) * 0.35;

          vec3 galaxy = dfDistantSpiralGalaxy(sourceUv);

          float nebulaDust = dfNoise(sourceUv * 1.35) * dfNoise(sourceUv * 2.9 - vec2(0.0, time * 0.02));
          vec3 deepNebula = mix(vec3(0.02, 0.03, 0.06), vec3(0.07, 0.14, 0.24), nebulaDust) * 0.45;

          vec3 skyColor = (deepNebula + galaxy * magBH + stars * magBH * magCur);

          // Localized cursor micro-singularity photon ring & shadow
          float cursorPhotonRing = exp(-abs(bCursor - rECursor * 0.58) * 36.0) * 0.65;
          float cursorShadow = smoothstep(rECursor * 0.48, rECursor * 0.56, bCursor);
          skyColor = skyColor * cursorShadow + vec3(0.55, 0.85, 1.00) * cursorPhotonRing;

          return skyColor;
        }

        // =========================================================================
        // 2. MASSIVE SWIRLING POLAR HELICAL MAGNETIC TORNADOES (BLANDFORD-ZNAJEK)
        // =========================================================================
        vec4 computePolarJets(vec2 uv, float time, float spin, float velocity) {
          vec2 p = vec2(uv.x + uv.y * velocity * 0.03, uv.y);
          float absY = abs(p.y);

          // Parabolic collimation boundary r(y) = r0 + k * sqrt(|y|)
          float rBase = 0.14;
          float rJet = rBase + 0.42 * sqrt(max(absY, 0.001));

          float radialNorm = abs(p.x) / rJet;
          if (radialNorm > 2.2) return vec4(0.0);

          float flowSpeed = (3.8 + abs(velocity) * 1.6) * (0.5 + 0.5 * spin);
          float axialCoord = absY * 2.4 - time * flowSpeed;

          // Twin Corkscrew Helical Vortices (m = 2 Kelvin-Helmholtz mode)
          float twistPhase = absY * 3.6 - time * (4.5 + spin * 3.0);
          float helixA = sin(twistPhase);
          float helixB = -helixA;

          float depthBoostA = 0.65 + 0.35 * cos(twistPhase);
          float depthBoostB = 0.65 - 0.35 * cos(twistPhase);

          float distA = abs(p.x / rJet - helixA * 0.62);
          float distB = abs(p.x / rJet - helixB * 0.62);

          float strandA = exp(-distA * distA * 18.0) * depthBoostA;
          float strandB = exp(-distB * distB * 18.0) * depthBoostB;
          float twinHelix = strandA + strandB;

          vec2 braidUv = vec2(p.x / rJet * 3.5 + sin(twistPhase * 0.5), axialCoord * 0.85);
          float filaments = bzNoise(braidUv * 2.5) * 0.65 + bzNoise(braidUv * 6.0 - vec2(0.0, time * 4.0)) * 0.35;
          float microBraids = pow(0.5 + 0.5 * sin(p.x / rJet * 10.0 + twistPhase * 2.0 + filaments * 3.0), 3.0);

          float spineCore = exp(-radialNorm * radialNorm * 14.0);
          float outerSheath = exp(-pow(radialNorm - 0.58, 2.0) * 9.5);
          float radialEnvelope = exp(-radialNorm * radialNorm * 2.4);

          float launchMask = smoothstep(0.45, 1.35, absY);
          float synchrotronDecay = exp(-absY * (0.28 / (1.0 + abs(velocity) * 0.25)));
          float bzPower = (0.25 + 0.75 * spin * spin) * (1.0 + abs(velocity) * 0.35);

          float structure = (
            spineCore * 1.35 +
            twinHelix * (0.65 + 0.75 * filaments) +
            outerSheath * microBraids * 0.8
          ) * radialEnvelope;

          float intensity = structure * launchMask * synchrotronDecay * bzPower;

          vec3 colCore   = vec3(0.82, 0.95, 1.00);
          vec3 colBlue   = vec3(0.14, 0.52, 1.00);
          vec3 colViolet = vec3(0.46, 0.12, 0.96);

          vec3 jetColor = mix(colViolet, colBlue, smoothstep(1.3, 0.35, radialNorm));
          jetColor = mix(jetColor, colCore, clamp(spineCore + twinHelix * filaments * 0.65, 0.0, 1.0));

          float poleDoppler = (p.y > 0.0) ? 1.18 : 0.86;
          vec3 finalRadiance = jetColor * intensity * poleDoppler * 1.65;

          return vec4(finalRadiance, clamp(intensity, 0.0, 1.0));
        }

        // =========================================================================
        // 3. MULTI-RING STRATIFIED ACCRETION DISK & 4 COLOR PALETTES
        // =========================================================================
        vec3 evaluateAccretionPalette(int palette, float thermalEnergy, float dopplerShift) {
          vec3 recedingCol;
          vec3 midCol;
          vec3 approachingCol;

          if (palette == 1) {
            // 1: Event Horizon Gold (Interstellar Gargantua)
            recedingCol    = vec3(0.48, 0.14, 0.02);
            midCol         = vec3(0.96, 0.68, 0.24);
            approachingCol = vec3(1.00, 0.96, 0.86);
          } else if (palette == 2) {
            // 2: Tachyon Violet & Emerald
            recedingCol    = vec3(0.45, 0.06, 0.62);
            midCol         = vec3(0.06, 0.82, 0.54);
            approachingCol = vec3(0.68, 0.95, 1.00);
          } else if (palette == 3) {
            // 3: Monochrome Starlight
            recedingCol    = vec3(0.22, 0.24, 0.28);
            midCol         = vec3(0.68, 0.72, 0.78);
            approachingCol = vec3(0.98, 0.99, 1.00);
          } else {
            // 0: Solar Amber & Cyan
            recedingCol    = vec3(0.86, 0.14, 0.03);
            midCol         = vec3(0.98, 0.64, 0.18);
            approachingCol = vec3(0.48, 0.86, 1.00);
          }

          float specCoord = clamp(thermalEnergy * 0.65 + (dopplerShift - 0.65) * 0.55, 0.0, 1.6);
          vec3 col = mix(recedingCol, midCol, smoothstep(0.05, 0.75, specCoord));
          col = mix(col, approachingCol, smoothstep(0.75, 1.45, specCoord));
          return col;
        }

        vec4 computeStratifiedAccretionDisk(
          vec2 diskCoord,
          float r,
          float phi,
          float time,
          float spin,
          float velocity,
          int palette
        ) {
          if (r < 1.15 || r > 6.15) return vec4(0.0);

          float omega = 1.0 / (pow(max(r, 1.0), 1.5) + 0.15 * (1.0 - spin));
          float timeFlow = time * (2.2 + abs(velocity) * 0.55);
          float shearedPhi = phi + timeFlow * omega;

          float innerMask = smoothstep(1.18, 1.28, r) * (1.0 - smoothstep(1.72, 1.92, r));
          float midMask   = smoothstep(1.72, 1.92, r) * (1.0 - smoothstep(3.65, 3.95, r));
          float outerMask = smoothstep(3.65, 3.95, r) * (1.0 - smoothstep(5.65, 6.05, r));

          // Inner ISCO Boundary
          vec2 iscoUv = vec2(r * 6.5, shearedPhi * 2.5 + r * 8.0);
          float iscoStreaks = adFbm4(iscoUv);
          float iscoRing = exp(-pow((r - 1.42) / 0.26, 2.0));
          float innerDensity = innerMask * (0.65 + 0.55 * iscoStreaks) * (0.8 + 0.6 * iscoRing);

          // Middle Vortex
          vec2 vortexBaseUv = vec2(r * 2.4, shearedPhi * 1.8 + r * 3.2);
          vec2 curlOffset = adCurl(vortexBaseUv * 0.85 - vec2(time * 0.35, 0.0));
          float vortexTurbulence = adFbm4(vortexBaseUv + curlOffset * 0.65);
          float zonalBands = 0.72 + 0.28 * sin(r * 16.0 - time * 3.0 + vortexTurbulence * 4.5);
          float midDensity = midMask * vortexTurbulence * zonalBands * 1.15;

          // Outer Spiral Filaments & Dust
          float logSpiral = phi * 2.0 + 7.5 * log(max(r, 1.0)) - time * 0.45;
          float spiralWave = 0.5 + 0.5 * cos(logSpiral);
          vec2 outerUv = vec2(r * 1.6, logSpiral * 0.75);
          float clumps = adFbm4(outerUv * 1.8);
          float dustOcclusion = smoothstep(0.32, 0.68, clumps * 0.7 + spiralWave * 0.3);
          float radialFade = exp(-(r - 3.8) * 0.65);
          float outerDensity = outerMask * dustOcclusion * (0.4 + 0.6 * spiralWave) * radialFade * 0.75;

          float totalDensity = clamp(innerDensity + midDensity + outerDensity, 0.0, 1.5);
          float thermalProfile = pow(1.25 / max(r, 1.2), 0.75) + innerMask * 0.45 - outerMask * 0.25;

          // Relativistic Doppler Beaming
          float beta = clamp(sqrt(0.68 / max(r, 1.15)) * (0.64 + 0.14 * spin + abs(velocity) * 0.04), 0.0, 0.78);
          float cosTheta = clamp(-diskCoord.x / max(r, 0.001), -1.0, 1.0);
          float dopplerBeaming = pow(max(1.0 - beta * cosTheta, 0.22), -3.0);
          float normalizedBeaming = dopplerBeaming * 0.38;
          float dopplerShiftRatio = 1.0 / max(1.0 - beta * cosTheta, 0.35);

          vec3 baseSpectrum = evaluateAccretionPalette(palette, thermalProfile * totalDensity, dopplerShiftRatio);

          float iscoHotspot = innerMask * smoothstep(1.15, 2.4, dopplerShiftRatio) * iscoStreaks;
          vec3 finalColor = baseSpectrum * totalDensity * normalizedBeaming;
          finalColor += vec3(0.75, 0.90, 1.00) * iscoHotspot * 0.85;

          float alpha = clamp(totalDensity * smoothstep(0.0, 0.35, normalizedBeaming), 0.0, 1.0);
          return vec4(finalColor, alpha);
        }

        // =========================================================================
        // 4. ETHEREAL HAWKING RADIATION SPARKLES AT PHOTON RING
        // =========================================================================
        vec4 computeHawkingSparkles(vec2 p, float r, float time, float spin) {
          if (r < 1.41 || r > 1.59) return vec4(0.0);

          float radialShell = smoothstep(1.45, 1.485, r) * (1.0 - smoothstep(1.515, 1.55, r));
          float razorCore   = exp(-pow((r - 1.50) / 0.022, 2.0));

          float theta = atan(p.y, p.x);
          float orbitalDrift = time * (1.8 + spin * 1.4);

          vec2 quantumGrid = vec2((theta + orbitalDrift) * 42.0, (r - 1.45) * 180.0);
          vec2 cellId = floor(quantumGrid);
          vec2 cellUv = fract(quantumGrid) - 0.5;
          vec2 seed = dfHash22(cellId);

          float flashPhase = time * (18.0 + seed.x * 24.0) + seed.y * 6.28318;
          float pairFlash = pow(max(0.0, sin(flashPhase)), 18.0) * step(0.62, seed.x);

          vec2 partnerOffset = vec2(cos(seed.y * 6.28), sin(seed.y * 6.28)) * 0.22;
          float sparkA = exp(-dot(cellUv - partnerOffset, cellUv - partnerOffset) * 28.0);
          float sparkB = exp(-dot(cellUv + partnerOffset, cellUv + partnerOffset) * 28.0);

          vec2 microGrid = vec2((theta - orbitalDrift * 0.6) * 96.0, (r - 1.45) * 320.0);
          float thermalFoam = dfNoise(microGrid + vec2(time * 14.0, -time * 9.0));
          float foamSparkle = pow(thermalFoam, 6.0) * razorCore * 0.85;

          vec3 particleCol     = vec3(0.72, 0.96, 1.00);
          vec3 antiparticleCol = vec3(0.78, 0.32, 1.00);

          float kerrBoost = 1.0 - 0.38 * spin * (p.x / max(r, 0.001));

          vec3 pairEmission = (particleCol * sparkA + antiparticleCol * sparkB) * pairFlash * 2.8;
          vec3 foamEmission = mix(antiparticleCol, particleCol, thermalFoam) * foamSparkle;

          vec3 finalColor = (pairEmission + foamEmission) * radialShell * kerrBoost;
          float alpha = clamp(( (sparkA + sparkB) * pairFlash + foamSparkle ) * radialShell, 0.0, 1.0);

          return vec4(finalColor, alpha);
        }

        // =========================================================================
        // MAIN FRAGMENT ENTRYPOINT
        // =========================================================================
        void main() {
          vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

          // Camera Dolly-In (Elastic Zoom): black hole expands slightly and recovers
          uv /= max(uCameraZoom, 0.1);

          // Dynamic inclination from scroll progress (Spiral orbital descent)
          float dynInc = uInclination - uScroll * 0.25;

          // Pointer coordinate in UV space
          vec2 pointerUv = (uPointer - 0.5 * uResolution.xy) / uResolution.y;
          pointerUv /= max(uCameraZoom, 0.1);

          // Compute warped deep field background with Einstein lensing and cursor micro-singularity
          vec3 color = computeLensedDeepField(uv * 3.2, pointerUv * 3.2, uTime, uSpin);

          // Polar Jets (Blandford-Znajek massive helical tornadoes)
          vec4 jets = computePolarJets(uv * 3.2, uTime, uSpin, uVelocity);
          color += jets.rgb;

          // Accretion Disk Raymarching Planes (Primary front + Secondary lensed back ring)
          float sinI = sin(dynInc);
          float cosI = cos(dynInc);

          // Primary Equatorial Plane
          vec2 diskCoordPrimary = vec2(uv.x, uv.y / max(abs(cosI), 0.001)) * 3.2;
          float rPrimary = length(diskCoordPrimary);
          float phiPrimary = atan(diskCoordPrimary.y, diskCoordPrimary.x);
          vec4 diskSamplePrimary = computeStratifiedAccretionDisk(diskCoordPrimary, rPrimary, phiPrimary, uTime, uSpin, uVelocity, uPalette);

          // Lensed Secondary Upper/Lower Arcs (gravitational bending over horizon)
          float lensedY = (uv.y > 0.0) ? (uv.y - 0.42 * sinI) : (uv.y + 0.42 * sinI);
          vec2 diskCoordLensed = vec2(uv.x * 1.35, lensedY * 2.8) * 3.2;
          float rLensed = length(diskCoordLensed);
          float phiLensed = atan(diskCoordLensed.y, diskCoordLensed.x);
          vec4 diskSampleLensed = computeStratifiedAccretionDisk(diskCoordLensed, rLensed, phiLensed, uTime, uSpin, uVelocity, uPalette);

          // Composite Accretion Disk
          color += diskSampleLensed.rgb * 0.72;
          color = mix(color, diskSamplePrimary.rgb, diskSamplePrimary.a);

          // Photon Sphere & Hawking Radiation Sparkles
          vec2 pShifted = (uv - vec2(uSpin * 0.06, 0.0)) * 3.2;
          float rHorizon = length(pShifted);
          vec4 hawking = computeHawkingSparkles(pShifted, rHorizon, uTime, uSpin);
          color += hawking.rgb;

          // Absolute Obsidian Abyss (Event Horizon r <= r_+ = 1.34 r_s)
          // Kerr event horizon r_+ = 1 + sqrt(1 - a*^2)
          float rEventHorizon = 1.34;
          float horizonMask = smoothstep(rEventHorizon - 0.02, rEventHorizon + 0.015, rHorizon);
          color *= horizonMask;

          // ACES Filmic Tone Mapping Curve
          color = (color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14);
          gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
        }
      `,
    });

    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material));

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('resize', this.onResize);

    this.animate(0);
  }

  private onPointerMove = (e: MouseEvent) => {
    // Invert Y for WebGL coordinates
    this.pointerTarget.set(e.clientX, window.innerHeight - e.clientY);
  };

  private onScroll = () => {
    const currentY = window.scrollY;
    const delta = currentY - this.lastScrollY;
    this.lastScrollY = currentY;

    // Scroll impulse velocity
    const rawVel = THREE.MathUtils.clamp(delta * 0.035, -4.0, 4.0);
    this.scrollVelocity = rawVel;

    const totalScrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    this.scrollProgress = Math.max(0, Math.min(1, currentY / totalScrollable));

    // Elastic Zoom impulse: Black hole expands elastically with scroll
    const impulse = Math.min(Math.abs(delta) * 0.0035, 0.35);
    this.zoomVelocity += impulse * 12.0;

    // Web Audio pitch shift on velocity
    if (this.isAudioPlaying && this.oscA && this.oscB && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      const targetFreq = 43.0 + Math.abs(this.scrollVelocity) * 14.0;
      this.oscA.frequency.setTargetAtTime(targetFreq, now, 0.08);
      this.oscB.frequency.setTargetAtTime(targetFreq + 0.35, now, 0.08);
    }
  };

  private onResize = () => {
    const parent = this.renderer.domElement.parentElement;
    if (!parent) return;
    this.renderer.setSize(parent.clientWidth, parent.clientHeight);
    this.material.uniforms.uResolution.value.set(parent.clientWidth, parent.clientHeight);
  };

  private lastTime = performance.now();

  private animate = (timestamp: number) => {
    this.rafId = requestAnimationFrame(this.animate);

    const now = performance.now();
    const dt = Math.min((now - this.lastTime) * 0.001, 0.06);
    this.lastTime = now;

    // 1. Damped Velocity Decay
    this.smoothedVelocity += (this.scrollVelocity - this.smoothedVelocity) * 0.08;
    this.scrollVelocity *= 0.92;

    // 2. Second-Order Hookean Spring-Mass for Elastic Zoom Expansion & Recovery
    // Force: F = -k * (x - 1.0) - c * v
    const zoomDisplacement = this.currentZoom - 1.0;
    const springForce = -this.springStiffness * zoomDisplacement - this.springDamping * this.zoomVelocity;
    this.zoomVelocity += springForce * dt;
    this.currentZoom += this.zoomVelocity * dt;

    // Clamp zoom bounds
    this.currentZoom = THREE.MathUtils.clamp(this.currentZoom, 0.96, 1.45);

    // 3. Pointer Lerp
    this.smoothedPointer.lerp(this.pointerTarget, 0.08);

    // 4. Update Uniforms
    this.material.uniforms.uTime.value = timestamp * 0.001;
    this.material.uniforms.uVelocity.value = this.smoothedVelocity;
    this.material.uniforms.uScroll.value = this.scrollProgress;
    this.material.uniforms.uCameraZoom.value = this.currentZoom;
    this.material.uniforms.uPointer.value.copy(this.smoothedPointer);
    this.material.uniforms.uPalette.value = this.currentPalette;

    this.renderer.render(this.scene, this.camera);
  };

  // =========================================================================
  // PUBLIC CONTROLS: PALETTE SWITCHING & WEB AUDIO
  // =========================================================================
  public setPalette(index: number) {
    this.currentPalette = THREE.MathUtils.clamp(index, 0, 3);
    this.material.uniforms.uPalette.value = this.currentPalette;
  }

  public getPalette(): number {
    return this.currentPalette;
  }

  public toggleAudio(): boolean {
    if (!this.audioCtx) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();

        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 64;

        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime);

        this.subFilter = this.audioCtx.createBiquadFilter();
        this.subFilter.type = 'lowpass';
        this.subFilter.frequency.setValueAtTime(120, this.audioCtx.currentTime);

        this.oscA = this.audioCtx.createOscillator();
        this.oscA.type = 'sine';
        this.oscA.frequency.setValueAtTime(43.0, this.audioCtx.currentTime);

        this.oscB = this.audioCtx.createOscillator();
        this.oscB.type = 'sine';
        this.oscB.frequency.setValueAtTime(43.35, this.audioCtx.currentTime); // 0.35 Hz binaural beat

        this.oscA.connect(this.subFilter);
        this.oscB.connect(this.subFilter);
        this.subFilter.connect(this.masterGain);
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);

        this.oscA.start();
        this.oscB.start();
      } catch (err) {
        console.warn('Web Audio initialization error:', err);
        return false;
      }
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (this.isAudioPlaying) {
      // Smooth fade out
      this.masterGain?.gain.setTargetAtTime(0.0001, this.audioCtx.currentTime, 0.15);
      this.isAudioPlaying = false;
    } else {
      // Smooth fade in
      this.masterGain?.gain.setTargetAtTime(0.18, this.audioCtx.currentTime, 0.25);
      this.isAudioPlaying = true;
    }

    return this.isAudioPlaying;
  }

  public isAudioActive(): boolean {
    return this.isAudioPlaying;
  }

  public getAudioFrequencyData(dataArray: Uint8Array): void {
    if (this.analyser && this.isAudioPlaying) {
      this.analyser.getByteFrequencyData(dataArray as unknown as Uint8Array<ArrayBuffer>);
    } else {
      dataArray.fill(0);
    }
  }

  public dispose() {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('resize', this.onResize);

    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch (e) {
        // ignore
      }
    }

    this.material.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
