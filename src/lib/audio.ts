let audioCtx: AudioContext | null = null;
let muted = localStorage.getItem('pianinni_muted') === 'true';

let bgm: HTMLAudioElement | null = null;
let bgmFadeTimer: ReturnType<typeof setInterval> | null = null;

export function startBgm(): void {
  if (muted) return;
  if (bgm) {
    if (bgm.paused) fadeBgmIn();
    return;
  }
  bgm = new Audio('/audio/bgm.mp3');
  bgm.loop = true;
  bgm.volume = 0;
  bgm.play().then(() => fadeBgmIn()).catch(() => {});
}

export function stopBgm(): void {
  if (!bgm || bgm.paused) return;
  fadeBgmOut(() => {
    bgm?.pause();
  });
}

function fadeBgmIn(): void {
  if (!bgm) return;
  clearBgmFade();
  const target = 0.35;
  bgmFadeTimer = setInterval(() => {
    if (!bgm) return;
    bgm.volume = Math.min(bgm.volume + 0.02, target);
    if (bgm.volume >= target) clearBgmFade();
  }, 30);
}

function fadeBgmOut(onDone?: () => void): void {
  if (!bgm) return;
  clearBgmFade();
  bgmFadeTimer = setInterval(() => {
    if (!bgm) return;
    bgm.volume = Math.max(bgm.volume - 0.02, 0);
    if (bgm.volume <= 0) {
      clearBgmFade();
      onDone?.();
    }
  }, 30);
}

function clearBgmFade(): void {
  if (bgmFadeTimer !== null) {
    clearInterval(bgmFadeTimer);
    bgmFadeTimer = null;
  }
}

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(val: boolean): void {
  muted = val;
  localStorage.setItem('pianinni_muted', String(val));
  if (bgm) {
    if (muted) {
      fadeBgmOut(() => { bgm?.pause(); });
    } else if (bgm.paused) {
      bgm.play().then(() => fadeBgmIn()).catch(() => {});
    }
  }
}

export function toggleMute(): boolean {
  setMuted(!muted);
  return muted;
}

function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function playNote(midi: number): void {
  if (muted) return;

  const ctx = getContext();
  const freq = midiToFrequency(midi);
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, now);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(freq * 4, now);
  filter.Q.setValueAtTime(1, now);

  const volume = 0.3;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(volume * 0.6, now + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq, now);

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0, now);
  gain2.gain.linearRampToValueAtTime(volume * 0.5, now + 0.01);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);

  osc.start(now);
  osc2.start(now);
  osc.stop(now + 1.5);
  osc2.stop(now + 1.2);
}
