/**
 * WorldAudio - Ambient reverie sound engine for the Continuous World Entrance.
 * Plays high-fidelity reverie soundtrack with seamless looping,
 * accompanied by an emergency Web Audio synthesized harmonic drone fallback.
 */

export class WorldAudio {
  private audioCtx: AudioContext | null = null
  private audioElement: HTMLAudioElement | null = null
  private mediaSource: MediaElementAudioSourceNode | null = null
  private masterGain: GainNode | null = null

  // Fallback Synthesizer Nodes
  private synthGain: GainNode | null = null
  private synthOscillators: OscillatorNode[] = []

  private isEnabled = false
  private isSynthesizing = false

  constructor() {
    try {
      this.audioElement = new Audio('/audio/reverie-journey.mp3')
      this.audioElement.loop = true
      this.audioElement.preload = 'auto'
      this.audioElement.volume = 0.75
    } catch (e) {
      console.warn('Audio element initialization skipped:', e)
    }
  }

  private initContext(): AudioContext | null {
    if (this.audioCtx) {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume()
      }
      return this.audioCtx
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtxClass) return null
      this.audioCtx = new AudioCtxClass()

      this.masterGain = this.audioCtx.createGain()
      this.masterGain.gain.setValueAtTime(0.01, this.audioCtx.currentTime)
      this.masterGain.connect(this.audioCtx.destination)

      if (this.audioElement && !this.mediaSource) {
        try {
          this.mediaSource = this.audioCtx.createMediaElementSource(this.audioElement)
          this.mediaSource.connect(this.masterGain)
        } catch (err) {
          console.warn('Media element source attach warning:', err)
        }
      }

      return this.audioCtx
    } catch (e) {
      console.warn('Web Audio Context initialization warning:', e)
      return null
    }
  }

  public async play(): Promise<boolean> {
    this.isEnabled = true
    const ctx = this.initContext()

    if (this.audioElement) {
      try {
        this.audioElement.muted = false
        await this.audioElement.play()

        if (this.masterGain && ctx) {
          this.masterGain.gain.cancelScheduledValues(ctx.currentTime)
          this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, ctx.currentTime)
          this.masterGain.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 1.8)
        }
        return true
      } catch (err) {
        console.warn('HTMLAudio play blocked, falling back to WebAudio Synth Drone:', err)
        this.startSynthDrone()
        return true
      }
    } else {
      this.startSynthDrone()
      return true
    }
  }

  public pause(): void {
    this.isEnabled = false
    if (this.audioElement) {
      try {
        this.audioElement.pause()
      } catch (e) {
        // ignore
      }
    }
    if (this.masterGain && this.audioCtx) {
      try {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.audioCtx.currentTime)
        this.masterGain.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.4)
      } catch (e) {
        // ignore
      }
    }
    this.stopSynthDrone()
  }

  public toggle(): boolean {
    if (this.isEnabled) {
      this.pause()
      return false
    } else {
      this.play()
      return true
    }
  }

  public get playing(): boolean {
    return this.isEnabled
  }

  /**
   * Warm harmonic ambient drone fallback (F# minor / C# / G# reverie)
   */
  private startSynthDrone(): void {
    if (this.isSynthesizing || !this.audioCtx) return
    this.isSynthesizing = true

    const ctx = this.audioCtx
    this.synthGain = ctx.createGain()
    this.synthGain.gain.setValueAtTime(0.001, ctx.currentTime)
    this.synthGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 2.5)

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(320, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 6.0)
    filter.Q.value = 2.0

    this.synthGain.connect(filter)
    filter.connect(ctx.destination)

    // F#2 (92.5Hz), C#3 (138.6Hz), G#3 (207.65Hz), C#4 (277.2Hz)
    const freqs = [92.5, 92.8, 138.6, 139.1, 207.65, 277.2]
    this.synthOscillators = freqs.map((f, i) => {
      const osc = ctx.createOscillator()
      osc.type = i % 2 === 0 ? 'sawtooth' : 'sine'
      osc.frequency.setValueAtTime(f, ctx.currentTime)
      const oscGain = ctx.createGain()
      oscGain.gain.value = 0.15 / freqs.length
      osc.connect(oscGain)
      oscGain.connect(this.synthGain!)
      osc.start()
      return osc
    })
  }

  private stopSynthDrone(): void {
    if (!this.isSynthesizing) return
    this.isSynthesizing = false
    if (this.synthGain && this.audioCtx) {
      this.synthGain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.5)
    }
    setTimeout(() => {
      this.synthOscillators.forEach((osc) => {
        try {
          osc.stop()
          osc.disconnect()
        } catch (e) {
          // ignore
        }
      })
      this.synthOscillators = []
    }, 600)
  }

  public dispose(): void {
    this.pause()
    if (this.audioElement) {
      this.audioElement.src = ''
      this.audioElement = null
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      try {
        this.audioCtx.close()
      } catch (e) {
        // ignore
      }
    }
  }
}
