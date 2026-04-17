import { useRef, useMemo, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

const isMobile = window.innerWidth < 768;

// Lazy load Three.js only on desktop
const DesktopModel = lazy(() => import('./VRModelDesktop'));

export default function VRModel() {
  if (isMobile) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <motion.div className="absolute rounded-full"
            style={{ width: 220, height: 220, background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', filter: 'blur(20px)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }} />
          <motion.div
            className="relative z-10 text-center"
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="text-8xl mb-3" style={{ filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.9))' }}>🥽</div>
            <p className="text-purple-400/60 text-xs tracking-widest uppercase">AR / VR</p>
            <p className="text-cyan-400/40 text-[10px] tracking-widest mt-1">2K26</p>
          </motion.div>
          {/* Orbit rings CSS only */}
          {[80, 110, 140].map((size, i) => (
            <motion.div key={i}
              className="absolute rounded-full border border-purple-500/20"
              style={{ width: size, height: size }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'linear' }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center">
        <motion.div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent"
          animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
      </div>
    }>
      <DesktopModel />
    </Suspense>
  );
}

