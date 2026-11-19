import type { GameSoundEvent } from './types';

class ChiptuneAudio {
  private ctx: AudioContext | null = null;
  private muted = false;

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted && this.ctx && this.ctx.state === 'running') {
      void this.ctx.suspend();
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  unlock(): void {
    if (this.muted || typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  suspend(): void {
    if (this.ctx && this.ctx.state === 'running') {
      void this.ctx.suspend();
    }
  }

  play(event: GameSoundEvent, combo = 0): void {
    if (this.muted || typeof window === 'undefined') return;
    if (!this.ctx) this.unlock();
    const ctx = this.ctx;
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }

    const now = ctx.currentTime;
    const pitchJitter = 0.94 + Math.random() * 0.12;

    switch (event) {
      case 'move':
        this.tone(ctx, 'square', 280 * pitchJitter, 390 * pitchJitter, now, 0.045, 0.06);
        break;
      case 'pickup': {
        const semitone = Math.min(combo, 8);
        const base = 440 * Math.pow(1.05946, semitone);
        this.tone(ctx, 'square', base, base * 1.25, now, 0.075, 0.08);
        this.tone(ctx, 'triangle', base * 1.5, base * 1.5, now + 0.045, 0.065, 0.07);
        break;
      }
      case 'star':
        this.tone(ctx, 'square', 587, 587, now, 0.06, 0.09);
        this.tone(ctx, 'square', 784, 784, now + 0.055, 0.06, 0.09);
        this.tone(ctx, 'square', 1046, 1174, now + 0.11, 0.12, 0.1);
        break;
      case 'graze':
        this.tone(ctx, 'triangle', 980, 1420, now, 0.07, 0.08);
        break;
      case 'hit':
        this.tone(ctx, 'sawtooth', 190, 68, now, 0.18, 0.14);
        this.tone(ctx, 'square', 120, 52, now + 0.04, 0.16, 0.1);
        break;
      case 'unlockSecret':
        [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, idx) => {
          this.tone(ctx, 'square', freq, freq, now + idx * 0.07, 0.14, 0.1);
        });
        break;
      case 'gameover':
        this.tone(ctx, 'square', 330, 310, now, 0.11, 0.1);
        this.tone(ctx, 'square', 262, 240, now + 0.11, 0.12, 0.1);
        this.tone(ctx, 'sawtooth', 196, 130, now + 0.23, 0.24, 0.11);
        break;
    }
  }

  private tone(
    ctx: AudioContext,
    type: OscillatorType,
    startFreq: number,
    endFreq: number,
    startTime: number,
    duration: number,
    gainPeak: number
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, startTime);
    if (startFreq !== endFreq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), startTime + duration);
    }

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  }
}

export const chiptuneAudio = new ChiptuneAudio();
