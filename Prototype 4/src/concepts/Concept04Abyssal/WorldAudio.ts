/**
 * WorldAudio - Procedural Web Audio synthesizer for Ankush Malothia // Sirosiu.
 * Generates an ethereal tri-harmonic ambient celestial drone modulated by an LFO,
 * and surges with a bandpass-filtered noise generator during warp acceleration.
 */

export class WorldAudio {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private warpGain: GainNode | null = null
  private isEnabled = false

  public init(): void {
    if (this.ctx) return
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtxClass) return

      this.ctx = new AudioCtxClass()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime)
      this.masterGain.connect(this.ctx.destination)

      const lp = this.ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.setValueAtTime(420, this.ctx.currentTime)
      lp.connect(this.masterGain)

      // Tri-harmonic warm celestial drone (55Hz, 82.5Hz, 110.4Hz)
      const freqs = [55, 82.5, 110.4]
      freqs.forEach((f, i) => {
        if (!this.ctx) return
        const o = this.ctx.createOscillator()
        o.type = i === 0 ? 'triangle' : 'sine'
        o.frequency.setValueAtTime(f, this.ctx.currentTime)
        const g = this.ctx.createGain()
        g.gain.setValueAtTime(0.22 / (i + 1), this.ctx.currentTime)
        o.connect(g)
        g.connect(lp)
        o.start()
      })

      // Slow LFO for frequency breathing (0.07Hz)
      const lfo = this.ctx.createOscillator()
      const lfoGain = this.ctx.createGain()
      lfo.frequency.setValueAtTime(0.07, this.ctx.currentTime)
      lfoGain.gain.setValueAtTime(160, this.ctx.currentTime)
      lfo.connect(lfoGain)
      lfoGain.connect(lp.frequency)
      lfo.start()

      // Filtered noise generator for warp acceleration thrust
      const bufferSize = this.ctx.sampleRate * 2
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      const noiseSource = this.ctx.createBufferSource()
      noiseSource.buffer = noiseBuffer
      noiseSource.loop = true

      const bp = this.ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.setValueAtTime(900, this.ctx.currentTime)
      this.warpGain = this.ctx.createGain()
      this.warpGain.gain.setValueAtTime(0, this.ctx.currentTime)

      noiseSource.connect(bp)
      bp.connect(this.warpGain)
      this.warpGain.connect(this.masterGain)
      noiseSource.start()
    } catch (e) {
      console.warn('Web Audio initialization skipped:', e)
    }
  }

  public setSound(enabled: boolean): void {
    this.isEnabled = enabled
    if (enabled) {
      this.init()
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume()
      }
      if (this.ctx && this.masterGain) {
        this.masterGain.gain.setTargetAtTime(0.5, this.ctx.currentTime, 1.2)
      }
    } else if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4)
    }
  }

  public toggleSound(): boolean {
    this.setSound(!this.isEnabled)
    return this.isEnabled
  }

  public setWarp(intensity: number): void {
    if (!this.ctx || !this.warpGain) return
    this.warpGain.gain.setTargetAtTime(Math.min(0.6, intensity * 0.35), this.ctx.currentTime, 0.1)
  }

  public getSound(): boolean {
    return this.isEnabled
  }

  public dispose(): void {
    if (this.ctx) {
      this.ctx.close().catch(() => {})
      this.ctx = null
    }
  }
}
