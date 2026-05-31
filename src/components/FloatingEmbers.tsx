import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

export default function FloatingEmbers() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];
    const colors = ['#ff6b2b', '#f5a623', '#ff4757', '#00d4aa', '#ffffff'];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function createParticle(): Particle {
      return {
        x: Math.random() * canvas!.width,
        y: canvas!.height + Math.random() * 60,
        size: Math.random() * 2.2 + 0.4,
        speedY: -(Math.random() * 0.9 + 0.25),
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.45 + 0.08,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * 350 + 180,
      };
    }

    for (let i = 0; i < 55; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas!.height;
      particles.push(p);
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.speedX;
        p.y += p.speedY;

        const lifeRatio = p.life / p.maxLife;
        const currentOpacity = p.opacity * (1 - lifeRatio);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentOpacity;
        ctx.fill();

        if (p.life >= p.maxLife || p.y < -10) {
          particles.splice(i, 1);
          particles.push(createParticle());
        }
      }
      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
}
