import { useMemo, useEffect, useRef } from 'react';

export default function Bubbles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Bubble class ─────────────────────────────────────────
    class Bubble {
      constructor() { this.reset(true); }

      reset(initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : canvas.height + 30;
        this.r = Math.random() * 14 + 4;
        this.speedY = Math.random() * 0.6 + 0.3;
        this.wobbleX = 0;
        this.wobbleSpeed = Math.random() * 0.03 + 0.01;
        this.wobbleAmp = Math.random() * 18 + 6;
        this.wobbleOffset = Math.random() * Math.PI * 2;
        this.opacity = Math.random() * 0.5 + 0.25;
        this.shimmerOffset = Math.random() * Math.PI * 2;
      }

      update(t) {
        this.y -= this.speedY;
        this.wobbleX = Math.sin(t * this.wobbleSpeed + this.wobbleOffset) * this.wobbleAmp;
        if (this.y < -this.r * 2) this.reset();
      }

      draw(ctx, t) {
        const x = this.x + this.wobbleX;
        const y = this.y;
        const r = this.r;

        // Outer glow
        const glow = ctx.createRadialGradient(x, y, r * 0.1, x, y, r * 2);
        glow.addColorStop(0, `rgba(100, 220, 255, 0.04)`);
        glow.addColorStop(1, `rgba(0, 100, 180, 0)`);
        ctx.beginPath();
        ctx.arc(x, y, r * 2, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Bubble body
        const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.05, x, y, r);
        grad.addColorStop(0, `rgba(200, 245, 255, ${this.opacity * 0.9})`);
        grad.addColorStop(0.4, `rgba(80, 190, 230, ${this.opacity * 0.4})`);
        grad.addColorStop(1, `rgba(20, 100, 180, ${this.opacity * 0.15})`);

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Rim
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(150, 230, 255, ${this.opacity * 0.6})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Specular highlight (top-left)
        ctx.beginPath();
        ctx.arc(x - r * 0.32, y - r * 0.32, r * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + 0.3 * Math.sin(t * 0.05 + this.shimmerOffset)})`;
        ctx.fill();

        // Secondary smaller highlight
        ctx.beginPath();
        ctx.arc(x + r * 0.2, y - r * 0.5, r * 0.08, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, 0.4)`;
        ctx.fill();
      }
    }

    // ── Light rays ────────────────────────────────────────────
    class LightRay {
      constructor(i) {
        this.x = (canvas.width / 7) * i + Math.random() * 60;
        this.width = 30 + Math.random() * 50;
        this.speed = 0.008 + Math.random() * 0.006;
        this.offset = Math.random() * Math.PI * 2;
        this.opacity = 0.02 + Math.random() * 0.04;
      }

      draw(ctx, t) {
        const sway = Math.sin(t * this.speed + this.offset) * 30;
        const grad = ctx.createLinearGradient(this.x + sway, 0, this.x + sway, canvas.height * 0.75);
        grad.addColorStop(0, `rgba(80, 200, 255, ${this.opacity})`);
        grad.addColorStop(0.5, `rgba(40, 150, 220, ${this.opacity * 0.5})`);
        grad.addColorStop(1, `rgba(0, 80, 160, 0)`);

        ctx.beginPath();
        ctx.moveTo(this.x + sway - this.width / 2, 0);
        ctx.lineTo(this.x + sway + this.width / 2, 0);
        ctx.lineTo(this.x + sway + this.width * 0.8, canvas.height * 0.75);
        ctx.lineTo(this.x + sway - this.width * 0.8, canvas.height * 0.75);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }

    // ── Caustic patches ───────────────────────────────────────
    class Caustic {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height * 0.75 + Math.random() * canvas.height * 0.25;
        this.rx = 20 + Math.random() * 40;
        this.ry = 8 + Math.random() * 15;
        this.speed = 0.02 + Math.random() * 0.02;
        this.offset = Math.random() * Math.PI * 2;
        this.opacity = 0.04 + Math.random() * 0.06;
      }

      draw(ctx, t) {
        const scale = 0.8 + 0.4 * Math.sin(t * this.speed + this.offset);
        const op = this.opacity * (0.5 + 0.5 * Math.sin(t * this.speed * 1.3 + this.offset));
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.rx * scale, this.ry * scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 220, 255, ${op})`;
        ctx.fill();
      }
    }

    // ── Particles (tiny floating specks) ─────────────────────
    class Particle {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : canvas.height + 5;
        this.size = Math.random() * 2 + 0.5;
        this.speed = Math.random() * 0.3 + 0.1;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.drift = (Math.random() - 0.5) * 0.3;
      }
      update() {
        this.y -= this.speed;
        this.x += this.drift;
        if (this.y < -5) this.reset();
      }
      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 220, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    // ── Init objects ──────────────────────────────────────────
    const bubbles = Array.from({ length: 25 }, () => new Bubble());
    const rays = Array.from({ length: 7 }, (_, i) => new LightRay(i));
    const caustics = Array.from({ length: 10 }, () => new Caustic());
    const particles = Array.from({ length: 40 }, () => new Particle());

    let t = 0;
    let animId;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bg.addColorStop(0, '#011824');
      bg.addColorStop(0.4, '#010d1a');
      bg.addColorStop(1, '#00080f');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Light rays
      rays.forEach(r => r.draw(ctx, t));

      // Caustics
      caustics.forEach(c => c.draw(ctx, t));

      // Particles
      particles.forEach(p => { p.update(); p.draw(ctx); });

      // Bubbles
      bubbles.forEach(b => { b.update(t); b.draw(ctx, t); });

      // Vignette
      const vig = ctx.createRadialGradient(canvas.width/2, canvas.height/2, canvas.height * 0.2, canvas.width/2, canvas.height/2, canvas.width * 0.9);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,5,15,0.75)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      t++;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}