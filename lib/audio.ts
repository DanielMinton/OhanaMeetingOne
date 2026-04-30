export function playWarningChime() {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 523.25;

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 783.99;

    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.12, now + 0.08);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, now + 0.15);
    gain2.gain.linearRampToValueAtTime(0.08, now + 0.23);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    osc1.connect(gain1).connect(ctx.destination);
    osc2.connect(gain2).connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.15);
    osc1.stop(now + 2);
    osc2.stop(now + 2.5);
  } catch {
    // AudioContext may be unavailable in some environments
  }
}

export function playCompletionTone() {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      const delay = i * 0.1;
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.09, now + delay + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 1.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 1.5);
    });
  } catch {
    // AudioContext unavailable
  }
}
