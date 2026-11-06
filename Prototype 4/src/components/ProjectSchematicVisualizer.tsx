import React, { useEffect, useRef } from 'react';

export type ProjectSchematicId =
  | 'ave-agent'
  | 'fraudlens'
  | 'phased-array'
  | 'rv32i-core'
  | 'microstrip-patch'
  | 'portfolio-engine';

export interface ProjectSchematicVisualizerProps {
  id: ProjectSchematicId;
  scrollProgress?: number; // Optional external 0.0 -> 1.0 scrub override
  accentColor?: string;    // Default: Electric Cyan (#38bdf8)
  secondaryColor?: string; // Default: Amber Warning/Harmonic (#f59e0b)
  className?: string;
  style?: React.CSSProperties;
}

interface PointerState {
  x: number;       // Normalized -1.0 to 1.0
  y: number;       // Normalized -1.0 to 1.0
  smoothX: number;
  smoothY: number;
  hover: number;   // 0.0 -> 1.0 smoothed hover intensity
  isInside: boolean;
}

export const ProjectSchematicVisualizer: React.FC<ProjectSchematicVisualizerProps> = ({
  id,
  scrollProgress,
  accentColor = '#38bdf8',
  secondaryColor = '#f59e0b',
  className = '',
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollRef = useRef<number>(scrollProgress ?? 0);
  const velocityRef = useRef<number>(0);

  // Sync external scroll prop if provided
  useEffect(() => {
    if (typeof scrollProgress === 'number') {
      velocityRef.current = Math.min(Math.abs(scrollProgress - scrollRef.current) * 25, 2.5);
      scrollRef.current = scrollProgress;
    }
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let rafId = 0;
    let width = 0;
    let height = 0;
    let lastWindowY = window.scrollY;

    const pointer: PointerState = {
      x: 0,
      y: 0,
      smoothX: 0,
      smoothY: 0,
      hover: 0,
      isInside: false,
    };

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(canvas);
    updateSize();

    const onScroll = () => {
      if (typeof scrollProgress === 'number') return;
      const currentY = window.scrollY;
      const delta = currentY - lastWindowY;
      lastWindowY = currentY;
      velocityRef.current = Math.min(Math.abs(delta) * 0.04, 3.0);

      const rect = canvas.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const prog = (vh - rect.top) / (vh + rect.height);
      scrollRef.current = Math.max(0, Math.min(1, prog));
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
      pointer.y = ((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
      pointer.isInside = true;
    };

    const onPointerLeave = () => {
      pointer.isInside = false;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerleave', onPointerLeave);
    onScroll();

    // =========================================================================
    // SHARED HUD & GRID HELPERS
    // =========================================================================
    const drawBaseFrame = (title: string, metric: string) => {
      ctx.fillStyle = '#08080a';
      ctx.fillRect(0, 0, width, height);

      // Subtle CAD Dot Matrix
      ctx.fillStyle = 'rgba(148, 163, 184, 0.12)';
      const step = 24;
      for (let gx = step; gx < width; gx += step) {
        for (let gy = step; gy < height; gy += step) {
          ctx.fillRect(gx, gy, 1, 1);
        }
      }

      // Corner Fiducial Reticles
      const m = 10;
      const len = 6;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(m, m + len); ctx.lineTo(m, m); ctx.lineTo(m + len, m);
      ctx.moveTo(width - m - len, m); ctx.lineTo(width - m, m); ctx.lineTo(width - m, m + len);
      ctx.moveTo(m, height - m - len); ctx.lineTo(m, height - m); ctx.lineTo(m + len, height - m);
      ctx.moveTo(width - m - len, height - m); ctx.lineTo(width - m, height - m); ctx.lineTo(width - m, height - m - len);
      ctx.stroke();

      // Telemetry Header & Footer
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.65)';
      ctx.fillText(`SYS // ${title}`, 18, 22);
      ctx.fillStyle = accentColor;
      ctx.textAlign = 'right';
      ctx.fillText(metric, width - 18, 22);
      ctx.textAlign = 'left';
    };

    // =========================================================================
    // 1. AVE-AGENT: Neural Memory Nodes + Synaptic Links + Voice Waveform
    // =========================================================================
    const renderAveAgent = (t: number, scroll: number, vel: number) => {
      const cx = width * 0.5;
      const cy = height * 0.43;
      const radius = Math.min(width, height) * 0.27;
      const nodeCount = 9;

      drawBaseFrame('A.V.E. NEURAL MEMORY', `CTX_SYNC: ${(94 + pointer.hover * 5.9).toFixed(1)}%`);

      const nodes: { x: number; y: number; pulse: number }[] = [];
      // Central Executive Core Node
      nodes.push({
        x: cx + pointer.smoothX * 14,
        y: cy + pointer.smoothY * 14,
        pulse: 1.0,
      });

      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2 + t * 0.35 + scroll * 2.2;
        const rMod = radius * (0.78 + 0.22 * Math.sin(t * 1.4 + i * 1.7));
        const nx = cx + Math.cos(angle) * rMod + pointer.smoothX * (i % 2 === 0 ? 10 : -8);
        const ny = cy + Math.sin(angle) * (rMod * 0.72) + pointer.smoothY * 8;
        nodes.push({ x: nx, y: ny, pulse: 0.5 + 0.5 * Math.sin(t * 3 + i) });
      }

      // Synaptic Connections & Travelling Action Potentials
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dist = Math.hypot(n2.x - n1.x, n2.y - n1.y);
          if (i === 0 || dist < radius * 0.95) {
            ctx.strokeStyle = i === 0 ? 'rgba(56, 189, 248, 0.28)' : 'rgba(148, 163, 184, 0.14)';
            ctx.lineWidth = i === 0 ? 1.2 : 0.8;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();

            // Synaptic packet traveling along edge
            const packetT = (t * (0.8 + vel * 0.4) + (i * 0.19 + j * 0.31)) % 1;
            const px = n1.x + (n2.x - n1.x) * packetT;
            const py = n1.y + (n2.y - n1.y) * packetT;
            ctx.fillStyle = i === 0 ? accentColor : '#e2e8f0';
            ctx.beginPath();
            ctx.arc(px, py, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Render Memory Nodes
      nodes.forEach((n, idx) => {
        const isCore = idx === 0;
        const r = isCore ? 7 : 3.5 + n.pulse * 1.5;
        ctx.fillStyle = isCore ? accentColor : '#f8fafc';
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isCore ? accentColor : 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 4 + n.pulse * 3, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Bottom Speech Synthesis Formant Waveform
      const waveY = height * 0.83;
      const waveW = width * 0.76;
      const startX = (width - waveW) * 0.5;
      ctx.beginPath();
      for (let x = 0; x <= waveW; x += 3) {
        const u = x / waveW;
        const env = Math.sin(u * Math.PI); // Hann window envelope
        const carrier =
          Math.sin(u * 38 - t * 8) * 0.6 +
          Math.cos(u * 85 + t * 13) * 0.4;
        const amp = (8 + pointer.hover * 12 + vel * 8) * env;
        const y = waveY + carrier * amp;
        if (x === 0) ctx.moveTo(startX + x, y);
        else ctx.lineTo(startX + x, y);
      }
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    // =========================================================================
    // 2. FRAUDLENS: Bipartite Graph + Pulsing Anomalies + Risk Gauge
    // =========================================================================
    const renderFraudLens = (t: number, scroll: number, vel: number) => {
      const riskScore = Math.min(99.4, 78.2 + pointer.hover * 16.5 + Math.sin(t * 2) * 3.2);
      drawBaseFrame('FRAUDLENS // GNN_BIPARTITE', `RISK_P: ${riskScore.toFixed(1)}%`);

      const leftX = width * 0.22;
      const rightX = width * 0.58;
      const topY = height * 0.22;
      const spanY = height * 0.58;

      const leftNodes = 5;
      const rightNodes = 5;
      const anomalyPair = [2, 3]; // Flagged fraudulent accounts

      // Draw Bipartite Edges & Bezier Transaction Streams
      for (let i = 0; i < leftNodes; i++) {
        const y1 = topY + (i / (leftNodes - 1)) * spanY;
        for (let j = 0; j < rightNodes; j++) {
          if ((i + j) % 2 !== 0 && !(i === anomalyPair[0] && j === anomalyPair[1])) continue;
          const y2 = topY + (j / (rightNodes - 1)) * spanY;
          const isAnomaly = i === anomalyPair[0] && j === anomalyPair[1];

          const cp1x = leftX + (rightX - leftX) * 0.45;
          const cp1y = y1 + pointer.smoothY * 18;
          const cp2x = leftX + (rightX - leftX) * 0.55;
          const cp2y = y2 - pointer.smoothY * 18;

          ctx.beginPath();
          ctx.moveTo(leftX, y1);
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, rightX, y2);
          ctx.strokeStyle = isAnomaly ? secondaryColor : 'rgba(148, 163, 184, 0.18)';
          ctx.lineWidth = isAnomaly ? 1.8 : 1.0;
          ctx.stroke();

          // Transaction Flow Particle
          const prog = (t * (isAnomaly ? 1.35 : 0.55) + i * 0.2 + scroll) % 1;
          const inv = 1 - prog;
          const px =
            inv * inv * inv * leftX +
            3 * inv * inv * prog * cp1x +
            3 * inv * prog * prog * cp2x +
            prog * prog * prog * rightX;
          const py =
            inv * inv * inv * y1 +
            3 * inv * inv * prog * cp1y +
            3 * inv * prog * prog * cp2y +
            prog * prog * prog * y2;

          ctx.fillStyle = isAnomaly ? secondaryColor : accentColor;
          ctx.beginPath();
          ctx.arc(px, py, isAnomaly ? 2.6 : 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Render Source & Sink Partitions
      for (let i = 0; i < leftNodes; i++) {
        const y1 = topY + (i / (leftNodes - 1)) * spanY;
        const isFlag = i === anomalyPair[0];
        ctx.fillStyle = isFlag ? secondaryColor : '#e2e8f0';
        ctx.beginPath();
        ctx.arc(leftX, y1, isFlag ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let j = 0; j < rightNodes; j++) {
        const y2 = topY + (j / (rightNodes - 1)) * spanY;
        const isFlag = j === anomalyPair[1];
        ctx.fillStyle = isFlag ? secondaryColor : accentColor;
        ctx.beginPath();
        ctx.arc(rightX, y2, isFlag ? 5.5 : 3.5, 0, Math.PI * 2);
        ctx.fill();

        if (isFlag) {
          const pulseR = 9 + ((t * 18 + vel * 5) % 14);
          ctx.strokeStyle = secondaryColor;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(rightX, y2, pulseR, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Right-hand Risk Probability Ring
      const ringX = width * 0.82;
      const ringY = height * 0.51;
      const ringR = Math.min(width, height) * 0.16;

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(ringX, ringY, ringR, 0, Math.PI * 2);
      ctx.stroke();

      const endAngle = -Math.PI * 0.5 + (riskScore / 100) * Math.PI * 2;
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(ringX, ringY, ringR, -Math.PI * 0.5, endAngle);
      ctx.stroke();

      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText(`${riskScore.toFixed(0)}%`, ringX, ringY + 4);
      ctx.textAlign = 'left';
    };

    // =========================================================================
    // 3. PHASED-ARRAY: Steerable mmWave Polar Beam (-60° to +60°) & Sidelobes
    // =========================================================================
    const renderPhasedArray = (t: number, scroll: number) => {
      // Steer angle between -60 deg and +60 deg via pointer X or scroll/time
      const steerDeg = pointer.isInside
        ? pointer.smoothX * 60
        : Math.sin(t * 1.1 + scroll * Math.PI * 2) * 60;
      const steerRad = (steerDeg * Math.PI) / 180;

      drawBaseFrame('28GHZ PHASED ARRAY', `THETA_0: ${steerDeg >= 0 ? '+' : ''}${steerDeg.toFixed(1)}°`);

      const ox = width * 0.5;
      const oy = height * 0.82;
      const maxR = Math.min(width * 0.44, height * 0.64);

      // Polar Range Rings & Azimuth Radials (-60°, -30°, 0°, +30°, +60°)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.lineWidth = 1;
      for (const frac of [0.33, 0.66, 1.0]) {
        ctx.beginPath();
        ctx.arc(ox, oy, maxR * frac, Math.PI, Math.PI * 2);
        ctx.stroke();
      }
      for (let deg = -60; deg <= 60; deg += 30) {
        const rad = ((deg - 90) * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + Math.cos(rad) * maxR, oy + Math.sin(rad) * maxR);
        ctx.stroke();
      }

      // Compute 8-Element Uniform Linear Array (ULA) Factor:
      // AF(theta) = |sin(N * psi / 2) / (N * sin(psi / 2))|
      const N = 8;
      ctx.beginPath();
      for (let deg = -88; deg <= 88; deg += 1) {
        const theta = (deg * Math.PI) / 180;
        const psi = Math.PI * (Math.sin(theta) - Math.sin(steerRad));
        const denom = N * Math.sin(psi * 0.5);
        const af = Math.abs(denom) < 1e-4 ? 1.0 : Math.abs(Math.sin((N * psi) * 0.5) / denom);
        // Apply cosine element pattern envelope
        const gain = Math.pow(af, 0.85) * Math.cos(theta * 0.7);
        const r = gain * maxR;
        const canvasAngle = theta - Math.PI * 0.5;
        const px = ox + Math.cos(canvasAngle) * r;
        const py = oy + Math.sin(canvasAngle) * r;
        if (deg === -88) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      const grad = ctx.createRadialGradient(ox, oy, 8, ox, oy, maxR);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.42)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0.05)');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Main Boresight Vector Line
      const mainAngle = steerRad - Math.PI * 0.5;
      ctx.strokeStyle = secondaryColor;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + Math.cos(mainAngle) * maxR * 1.04, oy + Math.sin(mainAngle) * maxR * 1.04);
      ctx.stroke();
      ctx.setLineDash([]);

      // 8 Antenna Patch Feed Elements at Array Base
      const pitch = 14;
      const startX = ox - ((N - 1) * pitch) * 0.5;
      for (let n = 0; n < N; n++) {
        ctx.fillStyle = accentColor;
        ctx.fillRect(startX + n * pitch - 3, oy + 5, 6, 4);
      }
    };

    // =========================================================================
    // 4. RV32I-CORE: 5-Stage RISC-V Pipeline (IF, ID, EX, MEM, WB) + Hazards
    // =========================================================================
    const renderRv32iCore = (t: number, scroll: number, vel: number) => {
      const stages = ['IF', 'ID', 'EX', 'MEM', 'WB'];
      const clkCycle = Math.floor(t * 2.5 + scroll * 12);
      const activeIdx = pointer.isInside
        ? Math.min(4, Math.max(0, Math.floor(((pointer.x + 1) * 0.5) * 5)))
        : clkCycle % 5;

      drawBaseFrame('RV32I 5-STAGE DATAPATH', `CLK_CYC: 0x${(clkCycle + 1024).toString(16).toUpperCase()}`);

      const marginX = width * 0.08;
      const usableW = width - marginX * 2;
      const stageW = usableW / 5;
      const boxW = stageW * 0.68;
      const boxH = height * 0.34;
      const centerY = height * 0.48;

      // Forwarding & Hazard Bypass Paths (EX/MEM -> EX and MEM/WB -> EX)
      const exX = marginX + 2 * stageW + boxW * 0.5;
      const memX = marginX + 3 * stageW + boxW * 0.5;
      const wbX = marginX + 4 * stageW + boxW * 0.5;
      const bypassY = centerY + boxH * 0.5 + 22;

      ctx.strokeStyle = activeIdx === 2 || activeIdx === 3 ? secondaryColor : 'rgba(245, 158, 11, 0.28)';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(memX, centerY + boxH * 0.5);
      ctx.lineTo(memX, bypassY);
      ctx.lineTo(exX, bypassY);
      ctx.lineTo(exX, centerY + boxH * 0.5);
      ctx.stroke();

      // Hazard Detection Unit Arc (ID <-> EX)
      const idX = marginX + 1 * stageW + boxW * 0.5;
      const topHazardY = centerY - boxH * 0.5 - 18;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(idX, centerY - boxH * 0.5);
      ctx.lineTo(idX, topHazardY);
      ctx.lineTo(wbX, topHazardY);
      ctx.lineTo(wbX, centerY - boxH * 0.5);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Pipeline Stages & Inter-stage Latch Registers
      stages.forEach((label, i) => {
        const bx = marginX + i * stageW + (stageW - boxW) * 0.5;
        const by = centerY - boxH * 0.5;
        const isActive = i === activeIdx;

        // Bus Interconnect
        if (i < 4) {
          const nextBx = marginX + (i + 1) * stageW + (stageW - boxW) * 0.5;
          const busX1 = bx + boxW;
          const busX2 = nextBx;
          ctx.strokeStyle = isActive ? accentColor : 'rgba(148, 163, 184, 0.3)';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(busX1, centerY);
          ctx.lineTo(busX2, centerY);
          ctx.stroke();

          // Pipeline Latch Register Vertical Bar
          const latchX = (busX1 + busX2) * 0.5;
          ctx.fillStyle = '#0f172a';
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
          ctx.lineWidth = 1;
          ctx.fillRect(latchX - 2.5, by - 4, 5, boxH + 8);
          ctx.strokeRect(latchX - 2.5, by - 4, 5, boxH + 8);
        }

        // Stage Logic Block
        ctx.fillStyle = isActive ? 'rgba(56, 189, 248, 0.14)' : 'rgba(15, 23, 42, 0.75)';
        ctx.strokeStyle = isActive ? accentColor : 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = isActive ? 1.8 : 1;
        ctx.fillRect(bx, by, boxW, boxH);
        ctx.strokeRect(bx, by, boxW, boxH);

        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillStyle = isActive ? '#ffffff' : 'rgba(226, 232, 240, 0.75)';
        ctx.textAlign = 'center';
        ctx.fillText(label, bx + boxW * 0.5, centerY + 4);
      });

      // Bottom Square-Wave Clock Signal Trace
      const clkY = height * 0.87;
      ctx.beginPath();
      const period = 28;
      const phase = (t * (35 + vel * 15)) % period;
      for (let x = marginX; x < width - marginX; x += 2) {
        const high = ((x + phase) % period) < period * 0.5;
        const y = clkY + (high ? -4 : 4);
        if (x === marginX) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 1.1;
      ctx.stroke();
      ctx.textAlign = 'left';
    };

    // =========================================================================
    // 5. MICROSTRIP-PATCH: S11 Return Loss (-32dB @ 28GHz) + Smith Chart Locus
    // =========================================================================
    const renderMicrostripPatch = (t: number, scroll: number) => {
      // Center resonance at 28.0 GHz, slightly tunable on hover
      const f0 = 28.0 + pointer.smoothX * 0.45;
      drawBaseFrame('28GHZ MICROSTRIP PATCH', `S11: -32.4dB @ ${f0.toFixed(2)}GHz`);

      const plotLeft = width * 0.12;
      const plotRight = width * 0.90;
      const plotTop = height * 0.22;
      const plotBottom = height * 0.82;
      const plotW = plotRight - plotLeft;
      const plotH = plotBottom - plotTop;

      // Axes & -10dB Bandwidth Threshold Line
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(plotLeft, plotTop, plotW, plotH);

      const y10dB = plotTop + (10 / 40) * plotH;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(plotLeft, y10dB);
      ctx.lineTo(plotRight, y10dB);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.fillText('-10dB BW', plotLeft + 6, y10dB - 5);

      // S11 Return Loss Lorentzian Notch Curve (24 GHz to 32 GHz)
      ctx.beginPath();
      let notchX = 0;
      let notchY = 0;

      for (let i = 0; i <= 160; i++) {
        const u = i / 160;
        const freq = 24.0 + u * 8.0;
        const df = freq - f0;
        const bw = 0.42;
        const dip = -32.4 / (1 + Math.pow(df / bw, 2) * 4.2);
        const ripple = Math.sin(freq * 3.2 + t + scroll * 4) * 0.8 - 1.8;
        const s11 = Math.max(-38, dip + ripple * (Math.abs(df) / 4));

        const x = plotLeft + u * plotW;
        const y = plotTop + (Math.abs(s11) / 40) * plotH;

        if (Math.abs(freq - f0) < 0.03) {
          notchX = x;
          notchY = y;
        }
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Resonance Marker at -32.4 dB Minimum
      ctx.fillStyle = secondaryColor;
      ctx.beginPath();
      ctx.arc(notchX, notchY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Embedded Smith Chart Impedance Circle (Top-Right Inset)
      const scR = Math.min(width, height) * 0.13;
      const scX = plotRight - scR - 14;
      const scY = plotBottom - scR - 12;

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(scX, scY, scR, 0, Math.PI * 2);
      ctx.stroke();

      // R = 1 Constant Resistance Circle
      ctx.beginPath();
      ctx.arc(scX + scR * 0.5, scY, scR * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      // Tightly coupled 50-Ohm impedance locus loop
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.1) {
        const r = scR * 0.35 * (1 + 0.25 * Math.sin(a * 2 + t * 2));
        const lx = scX + Math.cos(a) * r;
        const ly = scY + Math.sin(a) * r;
        if (a === 0) ctx.moveTo(lx, ly);
        else ctx.lineTo(lx, ly);
      }
      ctx.closePath();
      ctx.stroke();
    };

    // =========================================================================
    // 6. PORTFOLIO-ENGINE: Kinetic Lissajous Phase Oscillator & Harmonic Trails
    // =========================================================================
    const renderPortfolioEngine = (t: number, scroll: number, vel: number) => {
      const freqX = 3;
      const freqY = 2;
      const delta = t * 0.85 + scroll * Math.PI * 2 + pointer.smoothX * 1.4;

      drawBaseFrame('KINETIC LISSAJOUS ENGINE', `PHASE_Δ: ${(delta % (Math.PI * 2)).toFixed(2)} rad`);

      const cx = width * 0.5;
      const cy = height * 0.53;
      const rx = width * 0.34;
      const ry = height * 0.31;

      // Multi-Harmonic Phase Echo Trails
      const echoes = 3;
      for (let e = echoes; e >= 0; e--) {
        const phaseLag = delta - e * 0.16;
        ctx.beginPath();
        const steps = 220;
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2;
          const x =
            cx +
            Math.sin(freqX * theta + phaseLag) * rx +
            Math.cos(theta * 5 - t) * (pointer.hover * 10);
          const y =
            cy +
            Math.sin(freqY * theta) * ry +
            Math.sin(theta * 4 + t) * (vel * 6);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();

        if (e === 0) {
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 1.9;
        } else {
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.28 / e})`;
          ctx.lineWidth = 1.0;
        }
        ctx.stroke();
      }

      // Live Phase Vector Tracking Node
      const leadTheta = t * 1.8;
      const px = cx + Math.sin(freqX * leadTheta + delta) * rx;
      const py = cy + Math.sin(freqY * leadTheta) * ry;

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.stroke();

      ctx.fillStyle = secondaryColor;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    };

    // =========================================================================
    // MASTER 60FPS ANIMATION LOOP
    // =========================================================================
    const animate = (timestamp: number) => {
      rafId = requestAnimationFrame(animate);
      const t = timestamp * 0.001;

      // Damped pointer & scroll velocity interpolation
      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.1;
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.1;
      pointer.hover += ((pointer.isInside ? 1 : 0) - pointer.hover) * 0.08;
      velocityRef.current *= 0.92;

      switch (id) {
        case 'ave-agent':
          renderAveAgent(t, scrollRef.current, velocityRef.current);
          break;
        case 'fraudlens':
          renderFraudLens(t, scrollRef.current, velocityRef.current);
          break;
        case 'phased-array':
          renderPhasedArray(t, scrollRef.current);
          break;
        case 'rv32i-core':
          renderRv32iCore(t, scrollRef.current, velocityRef.current);
          break;
        case 'microstrip-patch':
          renderMicrostripPatch(t, scrollRef.current);
          break;
        case 'portfolio-engine':
          renderPortfolioEngine(t, scrollRef.current, velocityRef.current);
          break;
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [id, accentColor, secondaryColor, scrollProgress]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        background: '#08080a',
        borderRadius: '8px',
        cursor: 'crosshair',
        ...style,
      }}
    />
  );
};

export default ProjectSchematicVisualizer;
