import { useEffect, useRef } from 'react';

export default function ParticlesBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let animId;

    const isMobile = window.innerWidth < 768;
    const COUNT    = isMobile ? 20 : 50; // Reduced count

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const particles = Array.from({ length: COUNT }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.5 + 0.5,
      vx:    (Math.random() - 0.5) * 0.2,
      vy:    (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.4 + 0.1,
      color: ['#a855f7','#3b82f6','#22d3ee','#ec4899'][Math.floor(Math.random() * 4)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Simplified glow effect per particle
        if (!isMobile) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
        }
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
