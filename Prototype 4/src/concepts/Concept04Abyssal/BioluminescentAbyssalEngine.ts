export type OceanDepthZone =
  | 'EPIPELAGIC'
  | 'MESOPELAGIC'
  | 'BATHYPELAGIC'
  | 'ABYSSOPELAGIC';

interface MarineSnowParticle {
  x: number;
  y: number;
  z: number;       // Parallax depth scalar (0.25 -> 1.4)
  radius: number;
  alpha: number;
  phase: number;
  driftSpeed: number;
  isCyan: boolean;
}

interface TentacleStrand {
  offsetRatio: number; // -1.0 to 1.0 across bell margin
  length: number;
  segments: number;
  freq: number;
  phaseOffset: number;
  isOralArm: boolean;  // Central frilled siphonophore zooid chain vs outer filament
  isEmerald: boolean;
}

export class BioluminescentAbyssalEngine {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private rafId = 0;

  private width = 0;
  private height = 0;

  // Scroll & Hydrodynamic Telemetry
  private lastScrollY = window.scrollY;
  private targetScrollProgress = 0;
  private smoothScrollProgress = 0;
  private scrollVelocity = 0;
  private smoothVelocity = 0;

  // Interactive Pointer Sway
  private pointerX = 0;
  private pointerY = 0;
  private smoothPointerX = 0;
  private smoothPointerY = 0;

  // Scene Entities
  private snow: MarineSnowParticle[] = [];
  private tentacles: TentacleStrand[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    this.canvas.style.background = '#030712';

    const ctx = this.canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      throw new Error('BioluminescentAbyssalEngine: 2D Canvas context unavailable');
    }
    this.ctx = ctx;
    this.container.appendChild(this.canvas);

    this.resize();
    this.initMarineSnow(135);
    this.initTentacles();
    this.onScroll();

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.resize);
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });

    this.rafId = requestAnimationFrame(this.animate);
  }

  private initMarineSnow(count: number) {
    this.snow = [];
    for (let i = 0; i < count; i++) {
      const z = 0.25 + Math.random() * 1.15;
      this.snow.push({
        x: Math.random() * Math.max(this.width, 1200),
        y: Math.random() * Math.max(this.height, 900),
        z,
        radius: (0.6 + Math.random() * 1.6) * z,
        alpha: (0.12 + Math.random() * 0.48) * Math.min(z, 1),
        phase: Math.random() * Math.PI * 2,
        driftSpeed: 0.18 + Math.random() * 0.45,
        isCyan: Math.random() > 0.38,
      });
    }
  }

  private initTentacles() {
    this.tentacles = [];
    const filamentCount = 16;

    // 1. Outer Filiform Bioluminescent Tentacles
    for (let i = 0; i < filamentCount; i++) {
      const norm = (i / (filamentCount - 1)) * 2 - 1; // -1.0 to 1.0
      const bellCurve = Math.cos(norm * Math.PI * 0.42);
      this.tentacles.push({
        offsetRatio: norm * 0.88,
        length: (170 + bellCurve * 130) + (i % 3) * 28,
        segments: 28,
        freq: 2.1 + (i % 4) * 0.35,
        phaseOffset: i * 0.65,
        isOralArm: false,
        isEmerald: i % 3 === 0,
      });
    }

    // 2. Central Siphonophore Gastrozooid / Oral Arm Chains
    const oralCount = 5;
    for (let j = 0; j < oralCount; j++) {
      const norm = (j / (oralCount - 1)) * 2 - 1;
      this.tentacles.push({
        offsetRatio: norm * 0.36,
        length: 250 + (1 - Math.abs(norm)) * 95,
        segments: 34,
        freq: 1.55 + j * 0.2,
        phaseOffset: j * 1.1,
        isOralArm: true,
        isEmerald: j % 2 === 0,
      });
    }
  }

  private onScroll = () => {
    const currentY = window.scrollY;
    const delta = currentY - this.lastScrollY;
    this.lastScrollY = currentY;

    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    this.targetScrollProgress = Math.max(0, Math.min(1, currentY / maxScroll));
    this.scrollVelocity = Math.max(-28, Math.min(28, delta * 0.35));
  };

  private onPointerMove = (e: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.pointerX = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    this.pointerY = ((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
  };

  private resize = () => {
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = Math.max(rect.width, 1);
    this.height = Math.max(rect.height, 1);

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  private getDepthZone(progress: number): {
    zone: OceanDepthZone;
    depthMeters: number;
    pressureAtm: number;
  } {
    const depthMeters = Math.round(progress * 6000);
    const pressureAtm = +(1 + depthMeters / 10).toFixed(1);

    if (progress < 0.25) {
      return { zone: 'EPIPELAGIC', depthMeters, pressureAtm };
    } else if (progress < 0.5) {
      return { zone: 'MESOPELAGIC', depthMeters, pressureAtm };
    } else if (progress < 0.75) {
      return { zone: 'BATHYPELAGIC', depthMeters, pressureAtm };
    }
    return { zone: 'ABYSSOPELAGIC', depthMeters, pressureAtm };
  }

  private renderAbyssBackground(progress: number) {
    const ctx = this.ctx;

    // Base midnight abyssal fill (#030712) modulated by depth zone
    const topLight = Math.max(0, 1 - progress * 1.65); // Fades out past Mesopelagic
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);

    const rTop = Math.round(3 + topLight * 6);
    const gTop = Math.round(7 + topLight * 24);
    const bTop = Math.round(18 + topLight * 38);

    bgGrad.addColorStop(0, `rgb(${rTop}, ${gTop}, ${bTop})`);
    bgGrad.addColorStop(0.55, '#030712');
    bgGrad.addColorStop(1, '#010308');

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Subtle Epipelagic/Mesopelagic Photic God-Ray Cone at shallow depths
    if (topLight > 0.02) {
      const rayGrad = ctx.createRadialGradient(
        this.width * 0.5,
        -this.height * 0.2,
        10,
        this.width * 0.5,
        this.height * 0.55,
        Math.max(this.width, this.height) * 0.75
      );
      rayGrad.addColorStop(0, `rgba(56, 189, 248, ${topLight * 0.14})`);
      rayGrad.addColorStop(0.5, `rgba(16, 185, 129, ${topLight * 0.05})`);
      rayGrad.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = rayGrad;
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  private renderMarineSnow(t: number) {
    const ctx = this.ctx;
    ctx.save();

    for (const p of this.snow) {
      // Buoyant harmonic curl + scroll velocity advection
      const vx = Math.sin(t * 0.7 + p.phase) * 0.35 * p.z - this.smoothPointerX * 0.4 * p.z;
      const vy = (-p.driftSpeed - this.smoothVelocity * 0.65) * p.z;

      p.x += vx;
      p.y += vy;

      // Toroidal viewport wrap
      if (p.y < -12) p.y = this.height + 10;
      if (p.y > this.height + 12) p.y = -10;
      if (p.x < -12) p.x = this.width + 10;
      if (p.x > this.width + 12) p.x = -10;

      const shimmer = 0.65 + 0.35 * Math.sin(t * 2.2 + p.phase);
      const alpha = p.alpha * shimmer;

      ctx.fillStyle = p.isCyan
        ? `rgba(56, 189, 248, ${alpha.toFixed(3)})`
        : `rgba(52, 211, 153, ${alpha.toFixed(3)})`;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  private renderMedusaAndSiphonophore(t: number, progress: number) {
    const ctx = this.ctx;
    const scale = Math.min(this.width, this.height) / 900;
    const bellRadius = Math.max(68, Math.min(130, 108 * scale));

    // Asymmetric systolic/diastolic propulsion wave:
    // Sharp contraction squeeze followed by smooth hydrodynamic glide
    const rawCycle = Math.sin(t * 2.1);
    const pulse = Math.pow(rawCycle * 0.5 + 0.5, 1.8); // 0.0 -> 1.0
    const bellWidthMod = 1.0 - pulse * 0.22 + Math.sin(t * 4.2) * 0.03;
    const bellHeightMod = 0.88 + pulse * 0.24;

    // Vertical bathymetric traversal + buoyant surge
    const minY = this.height * 0.24;
    const maxY = this.height * 0.58;
    const depthY = minY + (maxY - minY) * progress;
    const cx =
      this.width * 0.5 +
      Math.sin(t * 0.55) * 26 +
      this.smoothPointerX * 42;
    const cy =
      depthY -
      pulse * 14 +
      Math.cos(t * 0.8) * 10 +
      this.smoothPointerY * 24;

    // Subtle body tilt into pointer / scroll current
    const tiltAngle =
      Math.sin(t * 0.55) * 0.08 +
      this.smoothPointerX * 0.14 -
      this.smoothVelocity * 0.004;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(tiltAngle);
    ctx.globalCompositeOperation = 'lighter';

    const rx = bellRadius * bellWidthMod;
    const ry = bellRadius * 0.78 * bellHeightMod;

    // =========================================================================
    // 1. AMBIENT BIOLUMINESCENT CORONA BLOOM
    // =========================================================================
    const haloGrad = ctx.createRadialGradient(0, 0, rx * 0.15, 0, ry * 0.3, rx * 2.4);
    haloGrad.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
    haloGrad.addColorStop(0.45, 'rgba(16, 185, 129, 0.09)');
    haloGrad.addColorStop(1, 'rgba(3, 7, 18, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(0, ry * 0.2, rx * 2.4, 0, Math.PI * 2);
    ctx.fill();

    // =========================================================================
    // 2. FLOWING TENTACLES & SIPHONOPHORE ZOOID CHAINS
    // =========================================================================
    // Hydrodynamic drag stretches tentacles when scrolling or pulsing
    const dragStretch = Math.max(0.65, Math.min(1.55, 1.0 + this.smoothVelocity * 0.025 + pulse * 0.18));

    for (const strand of this.tentacles) {
      const anchorX = strand.offsetRatio * rx * 0.92;
      const marginWave = Math.sin(strand.offsetRatio * Math.PI * 4 + t * 3.5) * 4;
      const anchorY = ry * 0.28 + Math.cos(strand.offsetRatio * Math.PI * 0.5) * 10 + marginWave;

      ctx.beginPath();
      ctx.moveTo(anchorX, anchorY);

      const segLen = (strand.length * scale * dragStretch) / strand.segments;
      let px = anchorX;
      let py = anchorY;

      // Store coordinates for photophore node pass
      const pts: [number, number][] = [[px, py]];

      for (let s = 1; s <= strand.segments; s++) {
        const u = s / strand.segments; // 0.0 -> 1.0 down tentacle

        // Multi-harmonic transverse wave + scroll wake turbulence
        const harmonic1 = Math.sin(u * 4.5 - t * strand.freq + strand.phaseOffset);
        const harmonic2 = Math.cos(u * 8.2 - t * (strand.freq * 1.6) + strand.offsetRatio * 3.0);
        const lateralSway =
          (harmonic1 * 18 + harmonic2 * 6) * Math.pow(u, 1.15) +
          strand.offsetRatio * u * 22 * (1 - pulse * 0.45) -
          this.smoothPointerX * u * 28;

        px = anchorX + lateralSway;
        py = anchorY + s * segLen;
        pts.push([px, py]);
        ctx.lineTo(px, py);
      }

      const strokeGrad = ctx.createLinearGradient(anchorX, anchorY, px, py);
      if (strand.isEmerald) {
        strokeGrad.addColorStop(0, 'rgba(52, 211, 153, 0.72)');
        strokeGrad.addColorStop(0.55, 'rgba(56, 189, 248, 0.38)');
        strokeGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
      } else {
        strokeGrad.addColorStop(0, 'rgba(56, 189, 248, 0.78)');
        strokeGrad.addColorStop(0.6, 'rgba(16, 185, 129, 0.34)');
        strokeGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
      }

      ctx.strokeStyle = strokeGrad;
      ctx.lineWidth = strand.isOralArm ? 2.1 : 1.1;
      ctx.stroke();

      // Traveling bioluminescent photophore cascade along siphonophore zooids
      const pulseIndex = Math.floor(((t * 10 + strand.phaseOffset * 4) % strand.segments));
      for (let s = 2; s < pts.length; s += strand.isOralArm ? 3 : 5) {
        const [nx, ny] = pts[s];
        const distToWave = Math.abs(s - pulseIndex);
        const nodeGlow = Math.max(0.18, Math.exp(-distToWave * 0.45)) * (1 - s / pts.length);

        ctx.fillStyle = strand.isEmerald
          ? `rgba(110, 231, 183, ${nodeGlow.toFixed(3)})`
          : `rgba(125, 211, 252, ${nodeGlow.toFixed(3)})`;

        ctx.beginPath();
        ctx.arc(nx, ny, strand.isOralArm ? 2.2 : 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // =========================================================================
    // 3. TRANSLUCENT UMBRELLA BELL & UNDULATING LAPPET MARGINS
    // =========================================================================
    ctx.beginPath();
    const domeSteps = 64;
    // Upper Exumbrella Dome (-PI to 0)
    for (let i = 0; i <= domeSteps; i++) {
      const theta = Math.PI + (i / domeSteps) * Math.PI;
      const ripple = Math.sin(theta * 10 + t * 3.0) * 1.8;
      const x = Math.cos(theta) * (rx + ripple);
      const y = Math.sin(theta) * (ry + ripple) + ry * 0.28;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    // Scalloped Undulating Bell Margin (Right +rx to Left -rx)
    const marginSteps = 48;
    const lobes = 12;
    for (let j = 0; j <= marginSteps; j++) {
      const u = j / marginSteps; // 0 -> 1 (right to left)
      const normX = 1 - u * 2;   // +1 -> -1
      const x = normX * rx;
      const scallop = Math.cos(u * Math.PI * lobes + t * 4.2) * 5.5;
      const arch = Math.sin(u * Math.PI) * 14 * (1 - pulse * 0.5);
      const y = ry * 0.28 + scallop - arch;
      ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Translucent Mesoglea Radial Gradient Fill (Cyan Rim + Emerald Core)
    const bellGrad = ctx.createRadialGradient(0, -ry * 0.25, rx * 0.05, 0, 0, rx * 1.08);
    bellGrad.addColorStop(0, 'rgba(224, 242, 254, 0.88)');   // Specular apex core
    bellGrad.addColorStop(0.28, 'rgba(56, 189, 248, 0.48)'); // Cyan mesoglea
    bellGrad.addColorStop(0.68, 'rgba(16, 185, 129, 0.28)'); // Emerald gastrovascular cavity
    bellGrad.addColorStop(0.92, 'rgba(56, 189, 248, 0.62)'); // Glowing rim margin
    bellGrad.addColorStop(1, 'rgba(56, 189, 248, 0.05)');

    ctx.fillStyle = bellGrad;
    ctx.fill();

    ctx.strokeStyle = 'rgba(125, 211, 252, 0.78)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // =========================================================================
    // 4. INTERNAL RADIAL CANALS & COMB-ROW PHOTOPHORE RIBS
    // =========================================================================
    const ribCount = 9;
    for (let r = 0; r < ribCount; r++) {
      const ribRatio = (r / (ribCount - 1)) * 2 - 1; // -1 to 1
      ctx.beginPath();
      ctx.moveTo(0, -ry * 0.68);
      ctx.quadraticCurveTo(
        ribRatio * rx * 0.55,
        -ry * 0.15,
        ribRatio * rx * 0.92,
        ry * 0.26
      );
      ctx.strokeStyle =
        r % 2 === 0
          ? 'rgba(52, 211, 153, 0.36)'
          : 'rgba(56, 189, 248, 0.42)';
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }

    // Inner Manubrium / Specular Bioluminescent Nucleus
    const coreGrad = ctx.createRadialGradient(0, -ry * 0.18, 0, 0, -ry * 0.18, rx * 0.38);
    coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    coreGrad.addColorStop(0.35, 'rgba(52, 211, 153, 0.65)');
    coreGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(0, -ry * 0.18, rx * 0.38, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private renderBathymetricHUD(progress: number) {
    const ctx = this.ctx;
    const { zone, depthMeters, pressureAtm } = this.getDepthZone(progress);

    const rightX = this.width - 24;
    const topY = this.height * 0.18;
    const trackH = this.height * 0.64;

    ctx.save();

    // Vertical Depth Scale Tick Marks
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(rightX, topY);
    ctx.lineTo(rightX, topY + trackH);

    const ticks = 24;
    for (let i = 0; i <= ticks; i++) {
      const ty = topY + (i / ticks) * trackH;
      const tickLen = i % 6 === 0 ? 10 : 4;
      ctx.moveTo(rightX - tickLen, ty);
      ctx.lineTo(rightX, ty);
    }
    ctx.stroke();

    // Active Depth Marker Reticle
    const markerY = topY + progress * trackH;
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(rightX, markerY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Telemetry Readout Next to Marker
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`-${depthMeters}m // ${zone}`, rightX - 16, markerY - 3);
    ctx.fillStyle = 'rgba(148, 163, 184, 0.68)';
    ctx.fillText(`HYDRO_P: ${pressureAtm} ATM`, rightX - 16, markerY + 10);

    ctx.restore();
  }

  private animate = (timestamp: number) => {
    this.rafId = requestAnimationFrame(this.animate);
    const t = timestamp * 0.001;

    // Damped scroll & pointer kinematics
    this.smoothScrollProgress +=
      (this.targetScrollProgress - this.smoothScrollProgress) * 0.075;
    this.smoothVelocity += (this.scrollVelocity - this.smoothVelocity) * 0.1;
    this.scrollVelocity *= 0.9;

    this.smoothPointerX += (this.pointerX - this.smoothPointerX) * 0.08;
    this.smoothPointerY += (this.pointerY - this.smoothPointerY) * 0.08;

    this.renderAbyssBackground(this.smoothScrollProgress);
    this.renderMarineSnow(t);
    this.renderMedusaAndSiphonophore(t, this.smoothScrollProgress);
    this.renderBathymetricHUD(this.smoothScrollProgress);
  };

  public dispose(): void {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('pointermove', this.onPointerMove);
    if (this.canvas.parentElement === this.container) {
      this.container.removeChild(this.canvas);
    }
  }
}
