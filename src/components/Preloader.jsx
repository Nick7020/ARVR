import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setPhase('done'); return 100; }
        return p + Math.random() * 6 + 2;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase === 'done') setTimeout(onComplete, 900);
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at center, #0d0025 0%, #020010 100%)' }}
        >
          {/* Rotating rings */}
          {[140, 200, 270].map((size, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: size, height: size,
                border: `1px solid rgba(139,92,246,${0.15 - i * 0.03})`,
              }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 4 + i * 2, repeat: Infinity, ease: 'linear' }}
            />
          ))}

          {/* Glow orb */}
          <motion.div
            className="absolute w-40 h-40 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />

          {/* ── COLLEGE LOGO ── */}
          <motion.div
            className="relative z-10 mb-4"
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              {/* Glow ring behind logo */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)', filter: 'blur(12px)' }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <img
                src="/logo.webp"
                alt="ZIBACAR Logo"
                className="relative z-10 rounded-full object-contain"
                style={{
                  width: 90, height: 90,
                  border: '2px solid rgba(139,92,246,0.6)',
                  boxShadow: '0 0 20px rgba(139,92,246,0.5), 0 0 40px rgba(139,92,246,0.2)',
                }}
              />
            </div>
          </motion.div>

          {/* ── COLLEGE FULL NAME ── */}
          <motion.div
            className="relative z-10 text-center mb-1 px-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <p className="text-purple-300/70 text-[11px] tracking-[0.25em] uppercase font-medium leading-5">
              Zeal Education Society's
            </p>
            <p className="text-white/80 text-[12px] tracking-[0.15em] uppercase font-semibold leading-5 mt-0.5">
              Zeal Institute of Business Administration
            </p>
            <p className="text-white/80 text-[12px] tracking-[0.15em] uppercase font-semibold leading-5">
              Computer Application and Research
            </p>
          </motion.div>

          {/* ── ZIBACAR badge ── */}
          <motion.div
            className="relative z-10 mb-6 mt-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div
              className="px-5 py-1.5 rounded-full text-sm font-black tracking-[0.3em]"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(34,211,238,0.1))',
                border: '1px solid rgba(139,92,246,0.5)',
                color: '#22d3ee',
                boxShadow: '0 0 16px rgba(139,92,246,0.3)',
              }}
            >
              ZIBACAR
            </div>
          </motion.div>

          {/* Divider line */}
          <motion.div
            className="relative z-10 mb-6 h-px w-48"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(34,211,238,0.4), transparent)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          />

          {/* ── Game-o-thon letters ── */}
          <div className="relative z-10 flex gap-1.5 mb-2">
            {'Game-o-thon'.split('').map((l, i) => (
              <motion.span
                key={i}
                className="text-3xl font-black gradient-text"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.06, duration: 0.5 }}
              >
                {l}
              </motion.span>
            ))}
          </div>

          <motion.p
            className="relative z-10 text-purple-300/60 text-xs tracking-[0.35em] uppercase mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            2K26
          </motion.p>

          {/* ── Progress bar ── */}
          <div className="relative z-10 w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #a855f7, #3b82f6, #22d3ee)',
                width: `${Math.min(progress, 100)}%`,
              }}
            />
          </div>

          {/* Percentage */}
          <motion.p
            className="relative z-10 text-purple-400/50 text-xs mt-3 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.min(Math.round(progress), 100)}%
          </motion.p>

          {/* Presents text */}
          <motion.p
            className="relative z-10 text-purple-400/30 text-[10px] tracking-widest uppercase mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            Presents
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

