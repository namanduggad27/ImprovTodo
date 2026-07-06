// Zero-dependency Web Audio API Sound Synthesizer
// Provides offline-first, instant audio feedback for timers, swipes, and task completion.

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /** Play a short lofi tick for countdown timers */
  public playTick() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {
      console.error('Audio tick error:', e);
    }
  }

  /** Play a pleasant chime (e.g., when starting a sprint or spinning wheel) */
  public playChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch (e) {
      console.error('Audio chime error:', e);
    }
  }

  /** Play a triumphant victory fanfare when finishing a task or sprint */
  public playVictoryFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Triumphant chord: C5, E5, G5, C6
      const notes = [
        { freq: 523.25, start: 0, duration: 0.15 },
        { freq: 659.25, start: 0.1, duration: 0.15 },
        { freq: 783.99, start: 0.2, duration: 0.15 },
        { freq: 1046.50, start: 0.3, duration: 0.6 }
      ];

      notes.forEach(note => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, now + note.start);

        gain.gain.setValueAtTime(0, now + note.start);
        gain.gain.linearRampToValueAtTime(0.2, now + note.start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.start + note.duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + note.start);
        osc.stop(now + note.start + note.duration);
      });
    } catch (e) {
      console.error('Audio victory error:', e);
    }
  }

  /** Play a subtle pop/whoosh when completing via swipe */
  public playPop() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.error('Audio pop error:', e);
    }
  }
}

export const sound = new SoundSynthesizer();
