export interface Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface ProjectedNode {
  sx: number;
  sy: number;
  depth: number;
  scale: number;
  ketLabel: string;
  phase: number;
  isInnerCore: boolean;
}

export interface EntanglementEdge {
  a: number;
  b: number;
  pulseOffset: number;
  isCoreBridge: boolean;
}

export class QuantumTerminalEngine {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private rafId = 0;

  private width = 0;
  private height = 0;

  // Scroll & Velocity Inertia (v = dy/dt)
  private lastScrollY = window.scrollY;
  private targetScroll = 0;
  private smoothScroll = 0;
  private scrollVelocity = 0;
  private smoothVelocity = 0;

  // Pointer Hologram Tilt
  private pointerX = 0;
  private pointerY = 0;
  private smoothPointerX = 0;
  private smoothPointerY = 0;

  // 4D Quantum Lattice Topology
  private vertices: Vec4[] = [];
  private ketLabels: string[] = [];
  private edges: EntanglementEdge[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    this.canvas.style.background = '#040608';

    const ctx = this.canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      throw new Error('QuantumTerminalEngine: 2D Canvas context unavailable');
    }
    this.ctx = ctx;
    this.container.appendChild(this.canvas);

    this.initQuantumLattice();
    this.resize();
    this.onScroll();

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.resize);
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });

    this.rafId = requestAnimationFrame(this.animate);
  }

  /**
   * Builds a 16-vertex 4D Hypercube (Tesseract) + 8-vertex Inner Bloch Octahedron
   */
  private initQuantumLattice() {
    this.vertices = [];
    this.ketLabels = [];
    this.edges = [];

    const basisStates = [
      '|0000⟩', '|0001⟩', '|0010⟩', '|0011⟩',
      '|0100⟩', '|0101⟩', '|0110⟩', '|0111⟩',
      '|1000⟩', '|1001⟩', '|1010⟩', '|1011⟩',
      '|1100⟩', '|1101⟩', '|1110⟩', '|1111⟩',
    ];

    // 1. Outer 16-Qubit Tesseract Vertices: (+/-1, +/-1, +/-1, +/-1)
    for (let i = 0; i < 16; i++) {
      this.vertices.push({
        x: (i & 1) ? 1 : -1,
        y: (i & 2) ? 1 : -1,
        z: (i & 4) ? 1 : -1,
        w: (i & 8) ? 1 : -1,
      });
      this.ketLabels.push(basisStates[i]);
    }

    // Connect outer hypercube edges where Hamming distance == 1 (32 edges)
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        const xor = i ^ j;
        if ((xor & (xor - 1)) === 0) {
          this.edges.push({
            a: i,
            b: j,
            pulseOffset: (i * 0.17 + j * 0.31) % 1,
            isCoreBridge: false,
          });
        }
      }
    }

    // 2. Inner 8-Node Bell-State Entanglement Core (indices 16..23)
    const bellStates = ['|Φ⁺⟩', '|Φ⁻⟩', '|Ψ⁺⟩', '|Ψ⁻⟩', '|GHZ⟩', '|W⟩', '|+⟩', '|-⟩'];
    const r = 0.52;
    const axes: Vec4[] = [
      { x: r, y: 0, z: 0, w: 0 }, { x: -r, y: 0, z: 0, w: 0 },
      { x: 0, y: r, z: 0, w: 0 }, { x: 0, y: -r, z: 0, w: 0 },
      { x: 0, y: 0, z: r, w: 0 }, { x: 0, y: 0, z: -r, w: 0 },
      { x: 0, y: 0, z: 0, w: r }, { x: 0, y: 0, z: 0, w: -r },
    ];

    axes.forEach((v, idx) => {
      const coreIdx = this.vertices.length;
      this.vertices.push(v);
      this.ketLabels.push(bellStates[idx]);

      // Bridge inner core nodes to corresponding outer tesseract corners
      this.edges.push({
        a: coreIdx,
        b: (idx * 2) % 16,
        pulseOffset: idx * 0.125,
        isCoreBridge: true,
      });
      this.edges.push({
        a: coreIdx,
        b: (idx * 2 + 7) % 16,
        pulseOffset: (idx * 0.125 + 0.5) % 1,
        isCoreBridge: true,
      });
    });
  }

  private onScroll = () => {
    const currentY = window.scrollY;
    const delta = currentY - this.lastScrollY;
    this.lastScrollY = currentY;

    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    this.targetScroll = Math.max(0, Math.min(1, currentY / maxScroll));
    this.scrollVelocity = Math.max(-32, Math.min(32, delta * 0.35));
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

  /**
   * Rotates a 4D vector across XW, YW, ZW (Clifford Torus rotations) and 3D XYZ planes
   */
  private transformAndProject(
    v: Vec4,
    idx: number,
    t: number,
    scroll: number
  ): ProjectedNode {
    let { x, y, z, w } = v;

    // 4D Hyperspace Rotations (XW & ZW planes driven by time + scroll scrub)
    const angleXW = t * 0.42 + scroll * Math.PI * 1.6;
    const cosXW = Math.cos(angleXW);
    const sinXW = Math.sin(angleXW);
    const nx1 = x * cosXW - w * sinXW;
    const nw1 = x * sinXW + w * cosXW;
    x = nx1;
    w = nw1;

    const angleYW = t * 0.28 - scroll * Math.PI * 1.1;
    const cosYW = Math.cos(angleYW);
    const sinYW = Math.sin(angleYW);
    const ny1 = y * cosYW - w * sinYW;
    const nw2 = y * sinYW + w * cosYW;
    y = ny1;
    w = nw2;

    // 3D Euclidean Rotations (driven by pointer tilt & scroll inertia)
    const rotY = t * 0.35 + this.smoothPointerX * 0.85 + scroll * Math.PI;
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const rx = x * cosY - z * sinY;
    let rz = x * sinY + z * cosY;
    x = rx;

    const rotX = 0.38 + this.smoothPointerY * 0.65 + this.smoothVelocity * 0.015;
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const ry = y * cosX - rz * sinX;
    rz = y * sinX + rz * cosX;
    y = ry;

    // 4D -> 3D Stereographic Perspective Projection
    const wCamera = 2.65;
    const wScale = 1 / Math.max(0.35, wCamera - w * 0.68);
    const x3 = x * wScale;
    const y3 = y * wScale;
    const z3 = rz * wScale;

    // 3D -> 2D Camera Zoom Scrub (zooms into the quantum lattice as scroll -> 1.0)
    const cameraZ = 2.85 - scroll * 1.15;
    const depth = Math.max(0.25, cameraZ - z3);
    const fov = Math.min(this.width, this.height) * 0.68;
    const scale = fov / depth;

    return {
      sx: this.width * 0.5 + x3 * scale,
      sy: this.height * 0.5 + y3 * scale,
      depth,
      scale,
      ketLabel: this.ketLabels[idx],
      phase: (t * 2.4 + idx * 0.45 + scroll * 6.28) % (Math.PI * 2),
      isInnerCore: idx >= 16,
    };
  }

  private renderQuantumVoidAndGrid(t: number) {
    const ctx = this.ctx;

    // Base cybernetic quantum void (#040608)
    ctx.fillStyle = '#040608';
    ctx.fillRect(0, 0, this.width, this.height);

    // Subtle radial optical vignette
    const radGrad = ctx.createRadialGradient(
      this.width * 0.5,
      this.height * 0.5,
      20,
      this.width * 0.5,
      this.height * 0.5,
      Math.max(this.width, this.height) * 0.65
    );
    radGrad.addColorStop(0, 'rgba(6, 182, 212, 0.06)');
    radGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.025)');
    radGrad.addColorStop(1, 'rgba(4, 6, 8, 0)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Sub-micron Isometric Calibration Grid
    const spacing = 44;
    const driftY = (t * 12 + this.smoothScroll * 180) % spacing;
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.045)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = (this.width * 0.5) % spacing; x < this.width; x += spacing) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }
    for (let y = driftY; y < this.height; y += spacing) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }
    ctx.stroke();
  }

  private renderHologramLattice(t: number) {
    const ctx = this.ctx;
    const projected = this.vertices.map((v, i) =>
      this.transformAndProject(v, i, t, this.smoothScroll)
    );

    // Chromatic Dispersion Offset (amplified by scroll velocity inertia)
    const dispMag = 1.6 + Math.abs(this.smoothVelocity) * 0.32;
    const dx = dispMag + this.smoothPointerX * 1.5;
    const dy = (this.smoothVelocity * 0.14);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // =========================================================================
    // 1. DUAL-PASS HOLOGRAPHIC CHROMATIC DISPERSION EDGES
    // =========================================================================
    for (const edge of this.edges) {
      const p1 = projected[edge.a];
      const p2 = projected[edge.b];

      const avgDepth = (p1.depth + p2.depth) * 0.5;
      const alpha = Math.max(0.08, Math.min(0.68, 1.35 / avgDepth));
      const lineW = edge.isCoreBridge ? 1.0 : Math.max(0.8, 2.2 / avgDepth);

      // Channel A: Laser Emerald (#10b981) shifted -dx, -dy
      ctx.strokeStyle = `rgba(16, 185, 129, ${(alpha * 0.78).toFixed(3)})`;
      ctx.lineWidth = lineW;
      ctx.beginPath();
      ctx.moveTo(p1.sx - dx, p1.sy - dy);
      ctx.lineTo(p2.sx - dx, p2.sy - dy);
      ctx.stroke();

      // Channel B: Holographic Cyan (#06b6d4) shifted +dx, +dy
      ctx.strokeStyle = `rgba(6, 182, 212, ${(alpha * 0.82).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(p1.sx + dx, p1.sy + dy);
      ctx.lineTo(p2.sx + dx, p2.sy + dy);
      ctx.stroke();

      // Traveling Quantum Entanglement Wave Packet
      const speed = 0.55 + Math.abs(this.smoothVelocity) * 0.05;
      const u = (t * speed + edge.pulseOffset) % 1;
      const px = p1.sx + (p2.sx - p1.sx) * u;
      const py = p1.sy + (p2.sy - p1.sy) * u;

      ctx.fillStyle = edge.isCoreBridge ? '#10b981' : '#a5f3fc';
      ctx.beginPath();
      ctx.arc(px, py, edge.isCoreBridge ? 1.8 : 2.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // =========================================================================
    // 2. COHERENT QUBIT NODES & BLOCH PHASE RINGS
    // =========================================================================
    // Sort back-to-front for crisp optical layering
    const sortedIndices = projected
      .map((_, idx) => idx)
      .sort((a, b) => projected[b].depth - projected[a].depth);

    ctx.font = '10px "JetBrains Mono", monospace';

    for (const idx of sortedIndices) {
      const node = projected[idx];
      const proximity = Math.max(0.15, Math.min(1.2, 1.9 / node.depth));
      const r = (node.isInnerCore ? 3.2 : 4.4) * proximity;

      // Outer Holographic Phase Ring
      ctx.strokeStyle = node.isInnerCore
        ? `rgba(16, 185, 129, ${(proximity * 0.7).toFixed(3)})`
        : `rgba(6, 182, 212, ${(proximity * 0.75).toFixed(3)})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(node.sx, node.sy, r * 2.3, node.phase, node.phase + Math.PI * 1.35);
      ctx.stroke();

      // Qubit Specular Core
      ctx.fillStyle = node.isInnerCore ? '#34d399' : '#ecfeff';
      ctx.beginPath();
      ctx.arc(node.sx, node.sy, r * 0.75, 0, Math.PI * 2);
      ctx.fill();

      // Render Ket State & Hadamard Phase Telemetry on Foreground Nodes
      if (node.depth < 2.25) {
        const textAlpha = Math.min(0.92, (2.25 - node.depth) * 1.1);
        ctx.fillStyle = `rgba(167, 243, 208, ${textAlpha.toFixed(3)})`;
        ctx.fillText(node.ketLabel, node.sx + r * 2.8, node.sy + 3);
      }
    }

    ctx.restore();
  }

  private renderInterferenceFringesAndHUD(t: number) {
    const ctx = this.ctx;
    ctx.save();

    // =========================================================================
    // 1. INTERFERENCE FRINGE SCANNING LINES
    // =========================================================================
    // Horizontal CRT/Laser Interference Grating
    ctx.fillStyle = 'rgba(6, 182, 212, 0.025)';
    for (let y = 0; y < this.height; y += 4) {
      ctx.fillRect(0, y, this.width, 1);
    }

    // Active Sweeping Laser Scanbar
    const scanY = ((t * 110 + this.smoothScroll * this.height * 2) % (this.height + 120)) - 60;
    const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
    scanGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
    scanGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.11)');
    scanGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = scanGrad;
    ctx.fillRect(0, scanY - 40, this.width, 80);

    // =========================================================================
    // 2. CYBERNETIC QUANTUM TELEMETRY TERMINAL OVERLAY
    // =========================================================================
    const pad = 22;
    const coherence = (99.98 - Math.abs(this.smoothVelocity) * 0.012).toFixed(3);
    const fidelity = (99.941 + Math.sin(t * 1.7) * 0.025).toFixed(3);
    const hadamardRad = ((this.smoothScroll * Math.PI * 2 + t * 0.4) % (Math.PI * 2)).toFixed(3);
    const tempMk = (12.4 + Math.abs(this.smoothVelocity) * 0.15).toFixed(1);

    ctx.font = '11px "JetBrains Mono", monospace';

    // Top-Left System Telemetry Block
    ctx.fillStyle = '#10b981';
    ctx.fillText(`SYS // QPU_TESSERACT_24Q [ONLINE]`, pad, pad + 10);
    ctx.fillStyle = 'rgba(207, 250, 254, 0.82)';
    ctx.fillText(`Q-COHERENCE : ${coherence}%`, pad, pad + 28);
    ctx.fillText(`BELL_FIDELITY: ${fidelity}%`, pad, pad + 44);
    ctx.fillStyle = '#06b6d4';
    ctx.fillText(`HADAMARD_Φ   : ${hadamardRad} rad (H⊗n)`, pad, pad + 60);

    // Top-Right Cryogenic & Scroll Depth Readout
    ctx.textAlign = 'right';
    ctx.fillStyle = '#06b6d4';
    ctx.fillText(`CRYO_STAGE: ${tempMk} mK`, this.width - pad, pad + 10);
    ctx.fillStyle = 'rgba(167, 243, 208, 0.75)';
    ctx.fillText(
      `HILBERT_DEPTH: ${(this.smoothScroll * 100).toFixed(1)}%`,
      this.width - pad,
      pad + 28
    );
    ctx.fillText(
      `dΨ/dt INERTIA: ${this.smoothVelocity >= 0 ? '+' : ''}${this.smoothVelocity.toFixed(2)}`,
      this.width - pad,
      pad + 44
    );
    ctx.textAlign = 'left';

    // Bottom Interference Phase Wave Oscilloscope
    const waveW = Math.min(280, this.width * 0.42);
    const waveX = pad;
    const waveY = this.height - pad - 18;

    ctx.strokeStyle = 'rgba(16, 185, 129, 0.75)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    for (let x = 0; x <= waveW; x += 3) {
      const u = x / waveW;
      const env = Math.sin(u * Math.PI);
      const y =
        waveY +
        (Math.sin(u * 28 - t * 7) * Math.cos(u * 12 + this.smoothScroll * 10)) *
          (7 + Math.abs(this.smoothVelocity) * 0.6) *
          env;
      if (x === 0) ctx.moveTo(waveX + x, y);
      else ctx.lineTo(waveX + x, y);
    }
    ctx.stroke();

    // Terminal Corner Fiducial Reticles
    const bLen = 12;
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.55)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    // Top-Left
    ctx.moveTo(10, 10 + bLen); ctx.lineTo(10, 10); ctx.lineTo(10 + bLen, 10);
    // Top-Right
    ctx.moveTo(this.width - 10 - bLen, 10); ctx.lineTo(this.width - 10, 10); ctx.lineTo(this.width - 10, 10 + bLen);
    // Bottom-Left
    ctx.moveTo(10, this.height - 10 - bLen); ctx.lineTo(10, this.height - 10); ctx.lineTo(10 + bLen, this.height - 10);
    // Bottom-Right
    ctx.moveTo(this.width - 10 - bLen, this.height - 10); ctx.lineTo(this.width - 10, this.height - 10); ctx.lineTo(this.width - 10, this.height - 10 - bLen);
    ctx.stroke();

    ctx.restore();
  }

  private animate = (timestamp: number) => {
    this.rafId = requestAnimationFrame(this.animate);
    const t = timestamp * 0.001;

    // Damped scroll & pointer inertia (v = dy/dt)
    this.smoothScroll += (this.targetScroll - this.smoothScroll) * 0.085;
    this.smoothVelocity += (this.scrollVelocity - this.smoothVelocity) * 0.12;
    this.scrollVelocity *= 0.89;

    this.smoothPointerX += (this.pointerX - this.smoothPointerX) * 0.09;
    this.smoothPointerY += (this.pointerY - this.smoothPointerY) * 0.09;

    this.renderQuantumVoidAndGrid(t);
    this.renderHologramLattice(t);
    this.renderInterferenceFringesAndHUD(t);
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
