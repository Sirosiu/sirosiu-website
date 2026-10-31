export interface DendriteSegment {
  id: number;
  x1: number;
  y1: number;
  cx: number; // Quadratic Bezier control X for organic neurite curvature
  cy: number;
  x2: number;
  y2: number;
  diameter: number;
  conductionSpeed: number;
  children: number[];
  isSynapse: boolean;
  vesicleGlow: number;
}

export interface ActionPotential {
  segmentId: number;
  progress: number; // 0.0 -> 1.0 along segment
  amplitude: number;
}

export class SynapticArborEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private segments: DendriteSegment[] = [];
  private spikes: ActionPotential[] = [];
  private rafId = 0;

  // Scroll & membrane potential telemetry
  private lastScrollY = window.scrollY;
  private scrollAccumulator = 0;
  private scrollVelocity = 0;

  // Web Audio Binaural Engine
  private audioCtx: AudioContext | null = null;
  private oscLeft: OscillatorNode | null = null;
  private oscRight: OscillatorNode | null = null;
  private masterGain: GainNode | null = null;
  private baseCarrierHz = 180; // Warm sub-cerebral carrier

  constructor(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('2D Canvas context unavailable');
    this.ctx = ctx;
    container.appendChild(this.canvas);

    this.resize();
    this.buildArbor();

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.resize);
    // Unlock Web Audio on first user interaction
    window.addEventListener('pointerdown', this.initBinauralAudio, { once: true });
    window.addEventListener('wheel', this.initBinauralAudio, { once: true, passive: true });

    this.animate();
  }

  /**
   * Initializes stereo-isolated oscillators:
   * Left ear = 180 Hz, Right ear = 180 Hz + deltaHz (8 Hz Alpha -> 40 Hz Gamma on scroll)
   */
  public initBinauralAudio = () => {
    if (this.audioCtx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.audioCtx = new AudioCtx();

    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.value = 0.0; // Silent until scroll activity
    this.masterGain.connect(this.audioCtx.destination);

    const panLeft = this.audioCtx.createStereoPanner();
    const panRight = this.audioCtx.createStereoPanner();
    panLeft.pan.value = -0.85;
    panRight.pan.value = 0.85;
    panLeft.connect(this.masterGain);
    panRight.connect(this.masterGain);

    this.oscLeft = this.audioCtx.createOscillator();
    this.oscRight = this.audioCtx.createOscillator();
    this.oscLeft.type = 'sine';
    this.oscRight.type = 'sine';
    this.oscLeft.frequency.value = this.baseCarrierHz;
    this.oscRight.frequency.value = this.baseCarrierHz + 8.0; // Base 8 Hz Alpha beat

    this.oscLeft.connect(panLeft);
    this.oscRight.connect(panRight);
    this.oscLeft.start();
    this.oscRight.start();
  };

  private buildArbor() {
    this.segments = [];
    const w = this.canvas.width / window.devicePixelRatio;
    const h = this.canvas.height / window.devicePixelRatio;
    const cx = w * 0.5;
    const cy = h * 0.5;

    // Seed 5 primary apical/basal trunks from the central soma
    const trunkCount = 5;
    for (let i = 0; i < trunkCount; i++) {
      const angle = (i / trunkCount) * Math.PI * 2 - Math.PI * 0.5;
      this.growBranch(cx, cy, angle, Math.min(w, h) * 0.14, 4.2, 0, 6);
    }
  }

  /**
   * Recursive arborization obeying Rall's 3/2 Power Law: d_p^1.5 = d_1^1.5 + d_2^1.5
   */
  private growBranch(
    x: number,
    y: number,
    angle: number,
    length: number,
    diameter: number,
    depth: number,
    maxDepth: number
  ): number {
    const id = this.segments.length;
    const x2 = x + Math.cos(angle) * length;
    const y2 = y + Math.sin(angle) * length;

    // Orthogonal midpoint displacement for organic axonal curvature
    const jitter = (Math.random() - 0.5) * length * 0.35;
    const cx = (x + x2) * 0.5 - Math.sin(angle) * jitter;
    const cy = (y + y2) * 0.5 + Math.cos(angle) * jitter;

    const isSynapse = depth >= maxDepth || (depth > 3 && Math.random() < 0.22);
    const segment: DendriteSegment = {
      id,
      x1: x,
      y1: y,
      cx,
      cy,
      x2,
      y2,
      diameter,
      // Cable theory: conduction velocity scales with sqrt(diameter)
      conductionSpeed: 0.028 * Math.sqrt(diameter),
      children: [],
      isSynapse,
      vesicleGlow: 0,
    };
    this.segments.push(segment);

    if (!isSynapse) {
      // Split ratio r in [0.4, 0.6], solve d_child = d_parent * r^(2/3)
      const split = 0.42 + Math.random() * 0.16;
      const d1 = diameter * Math.pow(split, 2 / 3);
      const d2 = diameter * Math.pow(1 - split, 2 / 3);

      const spread = 0.32 + Math.random() * 0.28;
      const lenDecay = 0.76 + Math.random() * 0.12;

      segment.children.push(
        this.growBranch(x2, y2, angle - spread, length * lenDecay, d1, depth + 1, maxDepth),
        this.growBranch(x2, y2, angle + spread, length * lenDecay, d2, depth + 1, maxDepth)
      );
    }

    return id;
  }

  private fireSomaActionPotentials(intensity: number) {
    // Trigger spikes at primary trunks (segments where diameter > 3.8)
    for (const seg of this.segments) {
      if (seg.diameter > 3.8 && Math.random() < 0.65) {
        this.spikes.push({
          segmentId: seg.id,
          progress: 0,
          amplitude: Math.min(1.5, 0.75 + intensity * 0.4),
        });
      }
    }
  }

  private onScroll = () => {
    const currentY = window.scrollY;
    const delta = Math.abs(currentY - this.lastScrollY);
    this.lastScrollY = currentY;

    this.scrollVelocity = Math.min(this.scrollVelocity + delta * 0.06, 12.0);
    this.scrollAccumulator += delta;

    // All-or-none depolarization threshold every 28px of scroll
    if (this.scrollAccumulator > 28) {
      this.fireSomaActionPotentials(this.scrollVelocity * 0.2);
      this.scrollAccumulator = 0;
    }
  };

  private resize = () => {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    this.canvas.width = parent.clientWidth * dpr;
    this.canvas.height = parent.clientHeight * dpr;
    this.canvas.style.width = `${parent.clientWidth}px`;
    this.canvas.style.height = `${parent.clientHeight}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.buildArbor();
  };

  private sampleBezier(seg: DendriteSegment, t: number): [number, number] {
    const inv = 1 - t;
    const x = inv * inv * seg.x1 + 2 * inv * t * seg.cx + t * t * seg.x2;
    const y = inv * inv * seg.y1 + 2 * inv * t * seg.cy + t * t * seg.y2;
    return [x, y];
  }

  private updateBinauralResonance() {
    if (!this.audioCtx || !this.oscRight || !this.masterGain) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const now = this.audioCtx.currentTime;
    // Map scroll velocity + active spike density from 8 Hz (Alpha) to 40 Hz (Gamma)
    const activity = Math.min(1.0, (this.scrollVelocity * 0.08) + (this.spikes.length / 65));
    const beatFrequency = 8.0 + activity * 32.0;

    this.oscRight.frequency.setTargetAtTime(this.baseCarrierHz + beatFrequency, now, 0.06);
    const targetGain = activity > 0.02 ? Math.min(0.08, 0.015 + activity * 0.065) : 0.0;
    this.masterGain.gain.setTargetAtTime(targetGain, now, 0.12);
  }

  private animate = () => {
    this.rafId = requestAnimationFrame(this.animate);
    const w = this.canvas.width / window.devicePixelRatio;
    const h = this.canvas.height / window.devicePixelRatio;

    this.scrollVelocity *= 0.91;
    this.updateBinauralResonance();

    // Phosphor trail clear on matte charcoal (#08080a)
    this.ctx.fillStyle = 'rgba(8, 8, 10, 0.26)';
    this.ctx.fillRect(0, 0, w, h);

    // 1. Render passive dendritic baseline structure
    this.ctx.lineCap = 'round';
    for (const seg of this.segments) {
      this.ctx.beginPath();
      this.ctx.moveTo(seg.x1, seg.y1);
      this.ctx.quadraticCurveTo(seg.cx, seg.cy, seg.x2, seg.y2);
      this.ctx.lineWidth = seg.diameter * 0.45;
      this.ctx.strokeStyle = 'rgba(130, 145, 165, 0.12)';
      this.ctx.stroke();

      // Render synaptic terminal boutons when depolarized
      if (seg.isSynapse && seg.vesicleGlow > 0.01) {
        this.ctx.beginPath();
        this.ctx.arc(seg.x2, seg.y2, 2.2 + seg.vesicleGlow * 4.5, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(110, 231, 255, ${seg.vesicleGlow * 0.85})`;
        this.ctx.fill();
        seg.vesicleGlow *= 0.92;
      }
    }

    // 2. Propagate & render Hodgkin-Huxley action potential spikes
    const nextSpikes: ActionPotential[] = [];
    const speedBoost = 1.0 + this.scrollVelocity * 0.25;

    for (const spike of this.spikes) {
      const seg = this.segments[spike.segmentId];
      spike.progress += seg.conductionSpeed * speedBoost;

      if (spike.progress >= 1.0) {
        if (seg.isSynapse) {
          // Trigger neurotransmitter vesicle release at terminal bouton
          seg.vesicleGlow = Math.min(1.0, seg.vesicleGlow + spike.amplitude);
        } else {
          // Cascade into child branches
          for (const childId of seg.children) {
            nextSpikes.push({
              segmentId: childId,
              progress: 0,
              amplitude: spike.amplitude * 0.94,
            });
          }
        }
      } else {
        nextSpikes.push(spike);
        const [sx, sy] = this.sampleBezier(seg, spike.progress);
        const [tx, ty] = this.sampleBezier(seg, Math.max(0, spike.progress - 0.18));

        // Draw axonal depolarization wave tail
        const grad = this.ctx.createLinearGradient(tx, ty, sx, sy);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.0)');
        grad.addColorStop(1, `rgba(224, 242, 254, ${spike.amplitude})`);

        this.ctx.beginPath();
        this.ctx.moveTo(tx, ty);
        this.ctx.lineTo(sx, sy);
        this.ctx.lineWidth = seg.diameter * 0.85;
        this.ctx.strokeStyle = grad;
        this.ctx.stroke();

        // Leading ion-channel spike node
        this.ctx.beginPath();
        this.ctx.arc(sx, sy, 1.4 + seg.diameter * 0.3, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
      }
    }

    // Cap maximum active spikes to keep frame times under 2ms
    this.spikes = nextSpikes.slice(-240);
  };

  public dispose() {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('pointerdown', this.initBinauralAudio);
    window.removeEventListener('wheel', this.initBinauralAudio);
    if (this.audioCtx) this.audioCtx.close();
    if (this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
  }
}
