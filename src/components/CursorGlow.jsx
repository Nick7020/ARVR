import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const DOTS = 10;

export default function CursorGlow() {
  const [pos, setPos] = useState(() =>
    Array.from({ length: DOTS }, () => ({ x: -300, y: -300 }))
  );
  const history = useRef(Array.from({ length: DOTS }, () => ({ x: -300, y: -300 })));

  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const cx = useSpring(mx, { stiffness: 500, damping: 28 });
  const cy = useSpring(my, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const move = e => {
      mx.set(e.clientX);
      my.set(e.clientY);
      history.current = [
        { x: e.clientX, y: e.clientY },
        ...history.current.slice(0, DOTS - 1),
      ];
      setPos([...history.current]);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mx, my]);

  return (
    <>
      {pos.map((p, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none rounded-full"
          animate={{ x: p.x, y: p.y }}
          transition={{
            type: 'spring',
            stiffness: 200 - i * 14,
            damping: 22,
            mass: 0.3 + i * 0.07,
          }}
          style={{
            zIndex: 9994,
            width:  Math.max(3, 13 - i * 1.0),
            height: Math.max(3, 13 - i * 1.0),
            translateX: '-50%',
            translateY: '-50%',
            background: `radial-gradient(circle, rgba(168,85,247,${Math.max(0.05, 0.8 - i * 0.07)}) 0%, transparent 70%)`,
            boxShadow: i < 3 ? `0 0 ${8 - i * 2}px rgba(168,85,247,0.5)` : 'none',
            filter: `blur(${i * 0.25}px)`,
          }}
        />
      ))}

      {/* Ring */}
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          zIndex: 9997,
          width: 34, height: 34,
          x: cx, y: cy,
          translateX: '-50%', translateY: '-50%',
          border: '1.5px solid rgba(168,85,247,0.65)',
          boxShadow: '0 0 12px rgba(168,85,247,0.35)',
        }}
      />

      {/* Dot */}
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          zIndex: 9998,
          width: 6, height: 6,
          x: mx, y: my,
          translateX: '-50%', translateY: '-50%',
          background: '#e9d5ff',
          boxShadow: '0 0 8px #a855f7, 0 0 18px #a855f7',
        }}
      />
    </>
  );
}
