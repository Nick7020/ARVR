import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const DOTS = 10;

const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

export default function CursorGlow() {
  // Don't render on mobile/touch devices
  if (isTouchDevice) return null;

  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const cx = useSpring(mx, { stiffness: 500, damping: 28 });
  const cy = useSpring(my, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const move = e => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mx, my]);

  return (
    <>
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
          boxShadow: '0 0 8px #a855f7',
        }}
      />
    </>
  );
}
