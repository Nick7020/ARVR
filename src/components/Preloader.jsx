import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setPhase('done'); return 100; }
        return p + Math.random() * 8 + 2;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase === 'done') setTimeout(onComplete, 800);
  }, [phase, onComplete]);

  const letters = 'AR/VR'.split('');

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'radial-gradient(ellipse at center, #0d0025 0%, #020010 100%)' }}
        >
          {/* Rotating rings */}
          {[120, 180, 240].map((size, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-purple-500/20"
              style={{ width: size, height: size }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: 'linear' }}
            />
          ))}

          {/* Glowing orb */}
          <motion.div
            className="absolute w-32 h-32 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Letters */}
          <div className="flex gap-2 mb-8 z-10">
            {letters.map((l, i) => (
              <motion.span
                key={i}
                className="text-5xl font-black gradient-text"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                {l}
              </motion.span>
            ))}
          </div>

          <motion.p
            className="text-purple-300/60 text-sm tracking-[0.3em] uppercase mb-10 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Hackathon 2026
          </motion.p>

          {/* Progress bar */}
          <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden z-10">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #a855f7, #3b82f6, #22d3ee)', width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <motion.p className="text-purple-400/50 text-xs mt-3 z-10 font-mono">
            {Math.min(Math.round(progress), 100)}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
