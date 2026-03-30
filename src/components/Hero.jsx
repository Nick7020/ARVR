import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const FloatingCube = ({ style, delay = 0 }) => (
  <motion.div
    className="absolute rounded-lg border border-purple-500/30"
    style={{ background: 'rgba(139,92,246,0.05)', ...style }}
    animate={{ y: [-15, 15, -15], rotate: [0, 180, 360] }}
    transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

const FloatingOrb = ({ style, color, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full blur-xl"
    style={{ background: color, ...style }}
    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
    transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const titleWords = ['AR/VR', 'Hackathon', '2026'];

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated grid */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Orbs */}
      <FloatingOrb style={{ width: 400, height: 400, top: '-10%', left: '-10%' }} color="rgba(139,92,246,0.15)" delay={0} />
      <FloatingOrb style={{ width: 300, height: 300, bottom: '10%', right: '-5%' }} color="rgba(34,211,238,0.12)" delay={2} />
      <FloatingOrb style={{ width: 200, height: 200, top: '30%', right: '20%' }} color="rgba(59,130,246,0.15)" delay={1} />

      {/* Floating cubes */}
      <FloatingCube style={{ width: 60, height: 60, top: '15%', left: '8%' }} delay={0} />
      <FloatingCube style={{ width: 40, height: 40, top: '60%', left: '5%' }} delay={1.5} />
      <FloatingCube style={{ width: 80, height: 80, top: '20%', right: '10%' }} delay={0.8} />
      <FloatingCube style={{ width: 30, height: 30, bottom: '25%', right: '15%' }} delay={2} />
      <FloatingCube style={{ width: 50, height: 50, bottom: '15%', left: '20%' }} delay={1} />

      {/* VR Headset SVG */}
      <motion.div
        className="absolute top-16 right-[8%] opacity-20"
        animate={{ y: [-10, 10, -10], rotateY: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
          <rect x="10" y="20" width="100" height="45" rx="22" fill="rgba(139,92,246,0.3)" stroke="rgba(139,92,246,0.8)" strokeWidth="1.5"/>
          <circle cx="38" cy="42" r="14" fill="rgba(59,130,246,0.2)" stroke="rgba(59,130,246,0.6)" strokeWidth="1"/>
          <circle cx="82" cy="42" r="14" fill="rgba(59,130,246,0.2)" stroke="rgba(59,130,246,0.6)" strokeWidth="1"/>
          <rect x="48" y="38" width="24" height="8" rx="4" fill="rgba(139,92,246,0.4)"/>
          <line x1="0" y1="42" x2="10" y2="42" stroke="rgba(139,92,246,0.5)" strokeWidth="2"/>
          <line x1="110" y1="42" x2="120" y2="42" stroke="rgba(139,92,246,0.5)" strokeWidth="2"/>
        </svg>
      </motion.div>

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Collaboration badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 glass neon-border rounded-full px-5 py-2 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-300 text-sm tracking-widest uppercase font-medium">
            In Collaboration with IIT Mandi
          </span>
        </motion.div>

        {/* Main title */}
        <div className="mb-4">
          {titleWords.map((word, i) => (
            <motion.span
              key={word}
              className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none"
              initial={{ opacity: 0, y: 60, skewY: 5 }}
              animate={{ opacity: 1, y: 0, skewY: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={i === 2 ? 'gradient-text glow-text' : i === 0 ? 'text-white' : 'gradient-text'}>
                {word}
              </span>
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          className="text-xl sm:text-2xl md:text-3xl text-cyan-300 font-light tracking-[0.2em] uppercase mb-6 glow-cyan"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Innovation Meets Immersion
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Dive into the future of immersive technologies. Build groundbreaking AR/VR solutions with peers, mentors, and industry experts.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.6, type: 'spring' }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            className="relative px-10 py-4 rounded-full font-bold text-lg text-white btn-glow overflow-hidden group"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Register Now</span>
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ background: 'linear-gradient(135deg, #a855f7, #3b82f6, #22d3ee)' }}
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)' }} />
          </motion.button>

          <motion.button
            className="px-10 py-4 rounded-full font-bold text-lg text-purple-300 glass neon-border"
            whileHover={{ scale: 1.05, borderColor: 'rgba(139,92,246,0.8)' }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span className="text-purple-400/50 text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            className="w-[1px] h-12 bg-gradient-to-b from-purple-500 to-transparent"
            animate={{ scaleY: [0, 1, 0], originY: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
