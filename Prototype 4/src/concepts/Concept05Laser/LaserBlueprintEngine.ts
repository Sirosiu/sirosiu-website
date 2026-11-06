export type LayerType = 'DIE_SEAL' | 'POLY_GATE' | 'RF_CPW_50OHM' | 'VIA_FENCE';

interface CADPolyline {
  layer: LayerType;
  points: [number, number][];
  segmentLengths: number[];
  totalLength: number;
  cumulativeStart: number; // Global arc-length offset
}

export class ASMLLithographyEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private paths: CADPolyline[] = [];
  private totalCircuitLength = 0;
  private rafId = 0;

  private targetScroll = 0;
  private smoothedScroll = 0.08; // Start slightly revealed on load
  private laserHead: [number, number] = [0, 0];
  private activeLayer: LayerType = 'DIE_SEAL';

  constructor(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('2D Canvas context unavailable');
    this.ctx = ctx;
    container.appendChild(this.canvas);

    this.resize();
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.resize);
    this.onScroll();
    this.animate();
  }

  private addPolyline(layer: LayerType, pts: [number, number][]) {
    if (pts.length < 2) return;
    const segmentLengths: number[] = [];
    let totalLength = 0;

    for (let i = 0; i < pts.length - 1; i++) {
      const dx = pts[i + 1][0] - pts[i][0];
      const dy = pts[i + 1][1] - pts[i][1];
      const len = Math.hypot(dx, dy);
      segmentLengths.push(len);
      totalLength += len;
    }

    this.paths.push({
      layer,
      points: pts,
      segmentLengths,
      totalLength,
      cumulativeStart: this.totalCircuitLength,
    });
    this.totalCircuitLength += totalLength;
  }

  /**
   * Procedurally synthesizes the IC Die, Poly-Si Gate Arrays, and 50-Ohm Coplanar Waveguides
   */
  private buildWaferCAD() {
    this.paths = [];
    this.totalCircuitLength = 0;

    const w = this.canvas.width / window.devicePixelRatio;
    const h = this.canvas.height / window.devicePixelRatio;
    const cx = w * 0.5;
    const cy = h * 0.5;
    const s = Math.min(w, h) * 0.38; // Half-die scale

    // 1. Outer Chamfered Die Seal Ring & Reticle Bus
    const c = s * 0.08;
    this.addPolyline('DIE_SEAL', [
      [cx - s + c, cy - s], [cx + s - c, cy - s], [cx + s, cy - s + c],
      [cx + s, cy + s - c], [cx + s - c, cy + s], [cx - s + c, cy + s],
      [cx - s, cy + s - c], [cx - s, cy - s + c], [cx - s + c, cy - s],
    ]);

    // 2. Quad Core FinFET Poly Gate Finger Arrays (4 quadrants)
    const quadrants = [[-0.52, -0.52], [0.16, -0.52], [-0.52, 0.16], [0.16, 0.16]];
    for (const [qx, qy] of quadrants) {
      const bx = cx + qx * s;
      const by = cy + qy * s;
      const bw = s * 0.36;
      const bh = s * 0.36;

      this.addPolyline('DIE_SEAL', [
        [bx, by], [bx + bw, by], [bx + bw, by + bh], [bx, by + bh], [bx, by],
      ]);

      // Interdigitated poly-Si transistor gates
      const fingers = 11;
      for (let i = 1; i < fingers; i++) {
        const fx = bx + (i / fingers) * bw;
        const pad = bh * 0.12;
        if (i % 2 === 0) {
          this.addPolyline('POLY_GATE', [[fx, by], [fx, by + bh - pad]]);
        } else {
          this.addPolyline('POLY_GATE', [[fx, by + bh], [fx, by + pad]]);
        }
      }
    }

    // 3. 50-Ohm RF Coplanar Waveguides (G-S-G differential serpentine & 45-deg mitered bus)
    const rfSpine: [number, number][] = [
      [cx - s, cy],
      [cx - s * 0.45, cy],
      [cx - s * 0.30, cy - s * 0.15],
      [cx + s * 0.30, cy - s * 0.15],
      [cx + s * 0.45, cy],
      [cx + s, cy],
    ];
    this.addPolyline('RF_CPW_50OHM', rfSpine);

    // Parallel Ground Return Planes (Coplanar Waveguide G-S-G spacing)
    for (const offset of [-12, 12]) {
      const gndPath = rfSpine.map(([px, py]): [number, number] => [px, py + offset]);
      this.addPolyline('DIE_SEAL', gndPath);
    }

    // Vertical Orthogonal Clock Tree & Serpentine Delay Line
    const serpPts: [number, number][] = [[cx, cy - s], [cx, cy - s * 0.25]];
    const loops = 6;
    const amp = s * 0.11;
    for (let i = 0; i < loops; i++) {
      const y0 = cy - s * 0.1 + (i / loops) * (s * 0.85);
      const y1 = cy - s * 0.1 + ((i + 0.5) / loops) * (s * 0.85);
      const dir = i % 2 === 0 ? 1 : -1;
      serpPts.push([cx + amp * dir, y0], [cx + amp * dir, y1]);
    }
    serpPts.push([cx, cy + s]);
    this.addPolyline('RF_CPW_50OHM', serpPts);
  }

  private onScroll = () => {
    const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    this.targetScroll = Math.max(0.04, Math.min(1.0, window.scrollY / maxScroll));
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
    this.buildWaferCAD();
  };

  private getLayerStyle(layer: LayerType): { color: string; width: number } {
    switch (layer) {
      case 'RF_CPW_50OHM':
        return { color: '#38bdf8', width: 1.8 }; // High-frequency EUV Cyan
      case 'POLY_GATE':
        return { color: '#f59e0b', width: 1.0 }; // Doped Poly-Si Amber
      case 'DIE_SEAL':
      default:
        return { color: 'rgba(148, 163, 184, 0.55)', width: 1.1 };
    }
  }

  private drawOpticalHUD(w: number, h: number) {
    const [lx, ly] = this.laserHead;
    const ctx = this.ctx;

    // 1. Full-viewport sub-micron laser alignment hairlines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
    ctx.lineWidth = 0.75;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(lx, 0); ctx.lineTo(lx, h);
    ctx.moveTo(0, ly); ctx.lineTo(w, ly);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Concentric ASML Twinscan fiducial reticle at active laser head
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.arc(lx, ly, 14, 0, Math.PI * 2);
    ctx.stroke();

    // Vernier corner brackets
    const b = 22;
    const c = 6;
    ctx.beginPath();
    ctx.moveTo(lx - b, ly - b + c); ctx.lineTo(lx - b, ly - b); ctx.lineTo(lx - b + c, ly - b);
    ctx.moveTo(lx + b - c, ly - b); ctx.lineTo(lx + b, ly - b); ctx.lineTo(lx + b, ly - b + c);
    ctx.moveTo(lx - b, ly + b - c); ctx.lineTo(lx - b, ly + b); ctx.lineTo(lx - b + c, ly + b);
    ctx.moveTo(lx + b - c, ly + b); ctx.lineTo(lx + b, ly + b); ctx.lineTo(lx + b, ly + b - c);
    ctx.stroke();

    // Active EUV plasma point bloom
    const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, 18);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.3, 'rgba(56, 189, 248, 0.85)');
    grad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(lx, ly, 18, 0, Math.PI * 2);
    ctx.fill();

    // 3. Real-time Wafer Stage Telemetry Readout
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(226, 232, 240, 0.85)';
    const umX = ((lx - w * 0.5) * 14.2).toFixed(1);
    const umY = ((ly - h * 0.5) * 14.2).toFixed(1);
    const pct = (this.smoothedScroll * 100).toFixed(1);

    ctx.fillText(`STAGE XY: [${umX} μm, ${umY} μm]`, lx + 28, ly - 10);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`LAYER: ${this.activeLayer} | Z0: 50.0Ω | EUV 13.5nm (${pct}%)`, lx + 28, ly + 4);
  }

  private animate = () => {
    this.rafId = requestAnimationFrame(this.animate);
    const w = this.canvas.width / window.devicePixelRatio;
    const h = this.canvas.height / window.devicePixelRatio;

    this.smoothedScroll += (this.targetScroll - this.smoothedScroll) * 0.09;
    const activeBudget = this.smoothedScroll * this.totalCircuitLength;

    // Clear with matte silicon substrate charcoal (#08080a)
    this.ctx.fillStyle = '#08080a';
    this.ctx.fillRect(0, 0, w, h);

    // Subtle 32px lithography stepper grid
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    this.ctx.lineWidth = 1;
    const grid = 32;
    this.ctx.beginPath();
    for (let x = (w * 0.5) % grid; x < w; x += grid) {
      this.ctx.moveTo(x, 0); this.ctx.lineTo(x, h);
    }
    for (let y = (h * 0.5) % grid; y < h; y += grid) {
      this.ctx.moveTo(0, y); this.ctx.lineTo(w, y);
    }
    this.ctx.stroke();

    // 1. Render faint unexposed photoresist blueprint ghost
    for (const path of this.paths) {
      this.ctx.beginPath();
      this.ctx.moveTo(path.points[0][0], path.points[0][1]);
      for (let i = 1; i < path.points.length; i++) {
        this.ctx.lineTo(path.points[i][0], path.points[i][1]);
      }
      this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    // 2. Trace active laser toolpath up to current scroll arc-length budget
    for (const path of this.paths) {
      if (activeBudget <= path.cumulativeStart) break;

      const pathBudget = Math.min(activeBudget - path.cumulativeStart, path.totalLength);
      const style = this.getLayerStyle(path.layer);

      this.ctx.beginPath();
      this.ctx.moveTo(path.points[0][0], path.points[0][1]);

      let traversed = 0;
      for (let i = 0; i < path.segmentLengths.length; i++) {
        const segLen = path.segmentLengths[i];
        const [x1, y1] = path.points[i];
        const [x2, y2] = path.points[i + 1];

        if (traversed + segLen <= pathBudget) {
          this.ctx.lineTo(x2, y2);
          traversed += segLen;
          this.laserHead = [x2, y2];
          this.activeLayer = path.layer;
        } else {
          const rem = pathBudget - traversed;
          const t = segLen > 0 ? rem / segLen : 0;
          const hx = x1 + (x2 - x1) * t;
          const hy = y1 + (y2 - y1) * t;
          this.ctx.lineTo(hx, hy);
          this.laserHead = [hx, hy];
          this.activeLayer = path.layer;
          break;
        }
      }

      this.ctx.strokeStyle = style.color;
      this.ctx.lineWidth = style.width;
      this.ctx.stroke();
    }

    this.drawOpticalHUD(w, h);
  };

  public dispose() {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.resize);
    if (this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
  }
}
