const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;

let ctx: AudioContext | null = null;

function getCtx() {
  if (!ctx) ctx = new AudioCtx();
  return ctx;
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", gain = 0.15) {
  const c = getCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export function playSpinSound() {
  // Ascending whoosh
  const c = getCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(200, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, c.currentTime + 0.3);
  g.gain.setValueAtTime(0.08, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.5);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + 0.5);
}

export function playWinSound() {
  // Happy ascending arpeggio
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => {
    setTimeout(() => playTone(f, 0.3, "sine", 0.12), i * 120);
  });
}

export function playLoseSound() {
  // Descending sad tone
  playTone(400, 0.15, "triangle", 0.1);
  setTimeout(() => playTone(300, 0.3, "triangle", 0.08), 150);
}

export function playTickSound() {
  playTone(1200, 0.03, "square", 0.04);
}
