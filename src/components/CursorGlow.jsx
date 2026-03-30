import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorGlow() {
  const canvasRef = useRef(null);
  const trailRef  = useRef([]);       // [{x, y, t, color}]
  const animRef   = useRef(null);

  /* spring cursor ring */
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const rx = useSpring(mx, { stiffness: 180, damping: 22 });
  const ry = useSpring(my, { stiffness: 180, damping: 22 });
  const dx = useSpring(mx, { stiffness: 900, damping: 32 });
  const dy = useSpring(my, { stiffness: 900, damping: 32 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const FADE   = 2400;   // ms until fully invisible
    const colors = ['#a855f7', '#3b82f6', '#22d3ee', '#ec4899'];
    let colorIdx = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = e => {
      mx.set(e.clientX);
      my.set(e.clientY);
      trailRef.current.push({
        x: e.clientX,
        y: e.clientY,
        t: performance.now(),
        color: colors[colorIdx % colors.length],
      });
      colorIdx++;
    };
    window.addEventListener('mousemove', onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now    = performance.now();
      const points = trailRef.current;

      /* remove fully faded points */
      trailRef.current = points.filter(p => now - p.t < FADE);

      /* draw connected segments */
      for (let i = 1; i < trailRef.current.length; i++) {
        const a    = trailRef.current[i - 1];
        const b    = trailRef.current[i];
        const ageA = (now - a.t) / FADE;   // 0 = fresh, 1 = gone
        const ageB = (now - b.t) / FADE;
        const alpha = Math.max(0, 1 - Math.max(ageA, ageB));

        /* skip if gap is too large (mouse jumped) */
        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        if (dist > 80) continue;

        /* glow outer stroke */
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = b.color + Math.floor(alpha * 60).toString(16).padStart(2, '0');
        ctx.lineWidth   = 8;
        ctx.lineCap     = 'round';
        ctx.shadowColor = b.color;
        ctx.shadowBlur  = 18;
        ctx.stroke();

        /* sharp inner stroke */
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = b.color + Math.floor(alpha * 220).toString(16).padStart(2, '0');
        ctx.lineWidth   = 1.8;
        ctx.shadowBlur  = 6;
        ctx.stroke();

        ctx.shadowBlur = 0;
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [mx, my]);

  return (
    <>
      {/* Trail canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9996 }}
      />

      {/* Outer glow ring */}
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          zIndex: 9997,
          width: 36, height: 36,
          x: rx, y: ry,
          translateX: '-50%', translateY: '-50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)',
          border: '1px solid rgba(139,92,246,0.55)',
          boxShadow: '0 0 12px rgba(139,92,246,0.4)',
        }}
      />

      {/* Center dot */}
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          zIndex: 9998,
          width: 5, height: 5,
          x: dx, y: dy,
          translateX: '-50%', translateY: '-50%',
          background: '#a855f7',
          boxShadow: '0 0 8px #a855f7, 0 0 16px #a855f7',
        }}
      />
    </>
  );
}
