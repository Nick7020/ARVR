import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, Suspense } from 'react';
import VRModel from './VRModel';

const FloatingCube = ({ style, delay = 0 }) => (
  <motion.div
    className="absolute rounded-lg border border-purple-500/20"
    style={{ background: 'rgba(139,92,246,0.04)', ...style }}
    animate={{ y: [-12, 12, -12], rotate: [0, 180, 360] }}
    transition={{ duration: 7 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const titleWords = ['AR/VR', 'Hackathon', '2026'];

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden pt-24">
      {/* Animated grid */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Background orbs */}
      <motion.div className="absolute w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(139,92,246,0.12)', top: '-15%', left: '-10%' }}
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
      <motion.div className="absolute w-[350px] h-[350px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(34,211,238,0.1)', bottom: '5%', right: '-5%' }}
        animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 5, repeat: Infinity, delay: 2 }} />

      {/* Floating cubes */}
      <FloatingCube style={{ width: 50, height: 50, top: '18%', left: '3%' }} delay={0} />
      <FloatingCube style={{ width: 30, height: 30, top: '65%', left: '6%' }} delay={1.5} />
      <FloatingCube style={{ width: 25, height: 25, bottom: '20%', left: '18%' }} delay={1} />

      <motion.div style={{ y, opacity }} className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 min-h-[80vh]">

          {/* ── LEFT: Text content ── */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            {/* Collaboration badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 glass neon-border rounded-full px-5 py-2 mb-8"
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-cyan-400"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-cyan-300 text-sm tracking-widest uppercase font-medium">
                In Collaboration with IIT Mandi
              </span>
            </motion.div>

            {/* Main title */}
            <div className="mb-5">
              {titleWords.map((word, i) => (
                <motion.div
                  key={word}
                  className="overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <motion.span
                    className="block text-6xl sm:text-7xl md:text-8xl font-black leading-[0.95]"
                    initial={{ y: 80, skewY: 6 }}
                    animate={{ y: 0, skewY: 0 }}
                    transition={{ duration: 0.9, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {i === 0 && (
                      <span className="text-white tracking-tight">{word}</span>
                    )}
                    {i === 1 && (
                      <span className="gradient-text">{word}</span>
                    )}
                    {i === 2 && (
                      <span className="gradient-text glow-text">{word}</span>
                    )}
                  </motion.span>
                </motion.div>
              ))}
            </div>

            {/* Subtitle */}
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-cyan-300 font-light tracking-[0.18em] uppercase mb-5 glow-cyan"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85, duration: 0.8 }}
            >
              Innovation Meets Immersion
            </motion.p>

            {/* Description */}
            <motion.p
              className="text-gray-400 text-base sm:text-lg max-w-xl mb-10 leading-relaxed lg:mx-0 mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.8 }}
            >
              Dive into the future of immersive technologies. Build groundbreaking AR/VR solutions with peers, mentors, and industry experts.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.25, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center items-center"
            >
              <motion.button
                className="relative px-10 py-4 rounded-2xl font-bold text-lg text-white overflow-hidden group"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Shimmer */}
                <motion.span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)' }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 2 }}
                />
                {/* Corner accents */}
                <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/40 rounded-tl-2xl" />
                <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/40 rounded-br-2xl" />
                <span className="relative z-10 flex items-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>⬡</motion.span>
                  Register Now
                </span>
                <motion.span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: '0 0 25px rgba(139,92,246,0.7), 0 0 50px rgba(59,130,246,0.3)' }} />
              </motion.button>

              <motion.button
                className="px-10 py-4 rounded-2xl font-bold text-lg text-purple-300 glass neon-border relative group overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: 'rgba(139,92,246,0.08)' }} />
                <span className="relative z-10">Learn More ↓</span>
              </motion.button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              className="flex gap-8 mt-12 lg:justify-start justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {[['48h', 'Hackathon'], ['₹1L+', 'Prizes'], ['200+', 'Hackers']].map(([val, label]) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-black gradient-text">{val}</div>
                  <div className="text-gray-500 text-xs tracking-widest uppercase mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: 3D VR Model ── */}
          <motion.div
            className="flex-1 w-full lg:max-w-[560px] h-[420px] sm:h-[500px] lg:h-[620px] relative"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Glow behind model */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)' }} />

            {/* HUD corner decorations */}
            {[
              'top-3 left-3 border-t-2 border-l-2 rounded-tl-xl',
              'top-3 right-3 border-t-2 border-r-2 rounded-tr-xl',
              'bottom-3 left-3 border-b-2 border-l-2 rounded-bl-xl',
              'bottom-3 right-3 border-b-2 border-r-2 rounded-br-xl',
            ].map((cls, i) => (
              <motion.div key={i} className={`absolute w-6 h-6 border-purple-500/60 ${cls}`}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
            ))}

            {/* Scanning line */}
            <motion.div
              className="absolute left-3 right-3 h-px pointer-events-none z-10"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.6), transparent)' }}
              animate={{ top: ['10%', '90%', '10%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* HUD labels */}
            <motion.div
              className="absolute top-5 left-5 z-10 font-mono text-[10px] text-cyan-400/60 leading-5"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div>SYS: ONLINE</div>
              <div>XR_CORE: v4.2.1</div>
              <div>RENDER: 120fps</div>
            </motion.div>
            <motion.div
              className="absolute bottom-5 right-5 z-10 font-mono text-[10px] text-purple-400/60 leading-5 text-right"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              <div>FOV: 120°</div>
              <div>LATENCY: 2ms</div>
              <div>STATUS: READY</div>
            </motion.div>

            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <motion.div className="w-16 h-16 rounded-full border-2 border-purple-500 border-t-transparent"
                  animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
              </div>
            }>
              <VRModel />
            </Suspense>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="flex flex-col items-center gap-2 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
        >
          <span className="text-purple-400/40 text-[10px] tracking-[0.4em] uppercase">Scroll to explore</span>
          <motion.div className="w-px h-10 bg-gradient-to-b from-purple-500 to-transparent"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
