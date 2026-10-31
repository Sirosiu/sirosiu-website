interface WordToken {
  el: HTMLSpanElement;
  start: number;
  end: number;
  lastProgress: number;
}

interface TextBlockTrack {
  container: HTMLElement;
  words: WordToken[];
  currentProgress: number;
}

interface PlateTrack {
  container: HTMLElement;
  innerMedia: HTMLElement | null;
  currentProgress: number;
  lastRendered: number;
}

export class SwissCurtainEngine {
  private textTracks: TextBlockTrack[] = [];
  private plateTracks: PlateTrack[] = [];
  private rafId = 0;
  private lerpFactor = 0.11; // Sub-pixel damping factor

  constructor(root: HTMLElement = document.body) {
    this.initTextBlocks(root);
    this.initPlates(root);
    this.animate();
  }

  private initTextBlocks(root: HTMLElement) {
    const blocks = Array.from(root.querySelectorAll<HTMLElement>('[data-swiss-text]'));

    for (const block of blocks) {
      const rawWords = (block.textContent || '').trim().split(/\s+/);
      block.textContent = '';

      const total = rawWords.length;
      const overlapWindow = 0.28; // Words overlap across 28% of the scrub timeline
      const tokens: WordToken[] = [];

      rawWords.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word;
        span.style.display = 'inline-block';
        span.style.willChange = 'opacity, filter, transform';
        span.style.opacity = '0.06';
        span.style.filter = 'blur(5.5px)';
        span.style.transform = 'translate3d(0, 6px, 0)';

        block.appendChild(span);
        if (index < total - 1) block.appendChild(document.createTextNode(' '));

        const normalizedIndex = index / Math.max(total - 1, 1);
        const start = normalizedIndex * (1.0 - overlapWindow);
        tokens.push({
          el: span,
          start,
          end: start + overlapWindow,
          lastProgress: -1,
        });
      });

      this.textTracks.push({ container: block, words: tokens, currentProgress: 0 });
    }
  }

  private initPlates(root: HTMLElement) {
    const plates = Array.from(root.querySelectorAll<HTMLElement>('[data-swiss-plate]'));

    for (const plate of plates) {
      plate.style.willChange = 'clip-path';
      plate.style.clipPath = 'inset(0% 0% 100% 0%)';

      const innerMedia = plate.firstElementChild as HTMLElement | null;
      if (innerMedia) {
        innerMedia.style.willChange = 'transform, filter';
        innerMedia.style.transform = 'scale(1.16)';
      }

      this.plateTracks.push({
        container: plate,
        innerMedia,
        currentProgress: 0,
        lastRendered: -1,
      });
    }
  }

  /**
   * Computes normalized viewport scrub progress [0..1]
   * Starts when element top enters at 85% viewport height, completes at 25%
   */
  private computeViewportProgress(el: HTMLElement, enterRatio = 0.86, exitRatio = 0.24): number {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const enterY = vh * enterRatio;
    const exitY = vh * exitRatio;
    const raw = (enterY - rect.top) / Math.max(enterY - exitY, 1);
    return Math.max(0, Math.min(1, raw));
  }

  private smoothstep(min: number, max: number, value: number): number {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  }

  private animate = () => {
    this.rafId = requestAnimationFrame(this.animate);

    // 1. Update Word-by-Word Editorial Scrubbers
    for (const track of this.textTracks) {
      const target = this.computeViewportProgress(track.container, 0.85, 0.28);
      track.currentProgress += (target - track.currentProgress) * this.lerpFactor;

      for (const word of track.words) {
        const wProg = this.smoothstep(word.start, word.end, track.currentProgress);
        // Dirty-check culling: skip DOM style writes if delta < 0.001
        if (Math.abs(wProg - word.lastProgress) < 0.001) continue;
        word.lastProgress = wProg;

        // Opacity: 0.06 -> 1.0 | Sub-pixel Blur: 5.5px -> 0.0px | Y-drift: 6px -> 0px
        const opacity = 0.06 + wProg * 0.94;
        const blur = (1.0 - wProg) * 5.5;
        const yOffset = (1.0 - wProg) * 6.0;

        word.el.style.opacity = opacity.toFixed(3);
        word.el.style.filter = blur < 0.08 ? 'none' : `blur(${blur.toFixed(2)}px)`;
        word.el.style.transform = `translate3d(0, ${yOffset.toFixed(2)}px, 0)`;
      }
    }

    // 2. Update Vertical Swiss Curtain Plates
    for (const plate of this.plateTracks) {
      const target = this.computeViewportProgress(plate.container, 0.92, 0.20);
      plate.currentProgress += (target - plate.currentProgress) * (this.lerpFactor * 0.85);

      if (Math.abs(plate.currentProgress - plate.lastRendered) < 0.0005) continue;
      plate.lastRendered = plate.currentProgress;

      // Cubic ease-out for architectural curtain snap
      const eased = 1 - Math.pow(1 - plate.currentProgress, 3);
      const bottomInset = ((1 - eased) * 100).toFixed(2);
      plate.container.style.clipPath = `inset(0% 0% ${bottomInset}% 0%)`;

      if (plate.innerMedia) {
        const scale = (1.16 - eased * 0.16).toFixed(4);
        plate.innerMedia.style.transform = `scale(${scale})`;
      }
    }
  };

  public dispose() {
    cancelAnimationFrame(this.rafId);
  }
}
