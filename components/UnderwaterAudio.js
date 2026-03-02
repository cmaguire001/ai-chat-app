import { useEffect, useRef } from 'react';

let audioCtx = null;

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

// ── Ambient ocean hum ─────────────────────────────────────
function startAmbient() {
  const ctx = getCtx();

  // Low rumble
  const bufferSize = ctx.sampleRate * 3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.015;

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 180;
  lowpass.Q.value = 0.8;

  const gain = ctx.createGain();
  gain.gain.value = 0.4;

  source.connect(lowpass);
  lowpass.connect(gain);
  gain.connect(ctx.destination);
  source.start();

  return () => { try { source.stop(); } catch(e) {} };
}

// ── Single bubble pop ─────────────────────────────────────
function playBubble() {
  const ctx = getCtx();
  const t = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(300 + Math.random() * 400, t);
  osc.frequency.exponentialRampToValueAtTime(80 + Math.random() * 100, t + 0.15);

  filter.type = 'bandpass';
  filter.frequency.value = 800;
  filter.Q.value = 2;

  gain.gain.setValueAtTime(0.12, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(t);
  osc.stop(t + 0.2);
}

// ── Message send "blub" ───────────────────────────────────
export function playMessageSend() {
  const ctx = getCtx();
  const t = ctx.currentTime;

  [0, 0.08, 0.16].forEach((delay, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500 - i * 80, t + delay);
    osc.frequency.exponentialRampToValueAtTime(100, t + delay + 0.12);
    gain.gain.setValueAtTime(0.08, t + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t + delay);
    osc.stop(t + delay + 0.2);
  });
}

// ── AI reply sonar ping ───────────────────────────────────
export function playReply() {
  const ctx = getCtx();
  const t = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const reverb = ctx.createConvolver();

  // Simple reverb buffer
  const revBuf = ctx.createBuffer(2, ctx.sampleRate * 1.5, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = revBuf.getChannelData(c);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
  }
  reverb.buffer = revBuf;

  osc.type = 'sine';
  osc.frequency.setValueAtTime(660, t);
  osc.frequency.exponentialRampToValueAtTime(440, t + 0.4);

  gain.gain.setValueAtTime(0.15, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

  osc.connect(gain);
  gain.connect(reverb);
  reverb.connect(ctx.destination);
  gain.connect(ctx.destination);

  osc.start(t);
  osc.stop(t + 0.7);
}

// ── Main component ────────────────────────────────────────
export default function UnderwaterAudio({ active }) {
  const stopAmbient = useRef(null);
  const bubbleTimer = useRef(null);

  useEffect(() => {
    if (!active) {
      stopAmbient.current?.();
      clearInterval(bubbleTimer.current);
      return;
    }

    // Start ambient after user interaction (browser autoplay policy)
    const start = () => {
      stopAmbient.current = startAmbient();

      // Random bubble sounds every 2-6 seconds
      bubbleTimer.current = setInterval(() => {
        const count = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < count; i++) {
          setTimeout(playBubble, i * 120);
        }
      }, 2000 + Math.random() * 4000);

      window.removeEventListener('click', start);
    };

    window.addEventListener('click', start);

    return () => {
      stopAmbient.current?.();
      clearInterval(bubbleTimer.current);
      window.removeEventListener('click', start);
    };
  }, [active]);

  return null;
}