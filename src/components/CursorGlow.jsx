import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorGlow() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
  const dotX = useSpring(x, { stiffness: 800, damping: 30 });
  const dotY = useSpring(y, { stiffness: 800, damping: 30 });

  useEffect(() => {
    const move = e => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  return (
    <>
      <motion.div
        className="fixed z-[9998] pointer-events-none rounded-full"
        style={{
          width: 40, height: 40,
          x: sx, y: sy,
          translateX: '-50%', translateY: '-50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
          border: '1px solid rgba(139,92,246,0.5)',
        }}
      />
      <motion.div
        className="fixed z-[9998] pointer-events-none rounded-full bg-purple-400"
        style={{ width: 6, height: 6, x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
      />
    </>
  );
}
