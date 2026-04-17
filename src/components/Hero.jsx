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

export default function Hero({ onRegister }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const titleWords = ['Game-o-thon', '2K26'];

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden pt-24">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <motion.div className="absolute rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(139,92,246,0.12)', top: '-15%', left: '-10%', width: 'min(500px,80vw)', height: 'min(500px,80vw)' }}
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
      <motion.div className="absolute rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(34,211,238,0.1)', bottom: '5%', right: '-5%', width: 'min(350px,60vw)', height: 'min(350px,60vw)' }}
        animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 5, repeat: Infinity, delay: 2 }} />

      <FloatingCube style={{ width: 40, height: 40, top: '18%', left: '3%' }} delay={0} />
      <FloatingCube style={{ width: 25, height: 25, top: '65%', left: '6%' }} delay={1.5} />

      <motion.div style={{ y, opacity }} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* College Banner */}
        <motion.div
          className="w-full flex flex-col items-center justify-center gap-3 mb-6 pt-2"
          initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-3xl">
            {/* Logo */}
            <motion.div className="relative flex-shrink-0">
              <motion.div className="absolute inset-0 rounded-full"
                style={{ border: '2px dashed rgba(139,92,246,0.5)', margin: -6 }}
                animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
              <motion.div className="absolute inset-0 rounded-full blur-xl"
                style={{ background: 'rgba(139,92,246,0.6)', margin: -4 }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }} />
              <img src="/logo.webp" alt="ZIBACAR Logo"
                className="relative z-10 rounded-full object-contain"
                style={{ width: 70, height: 70, border: '2px solid rgba(139,92,246,0.8)', boxShadow: '0 0 25px rgba(139,92,246,0.7)' }} />
            </motion.div>

            {/* College name */}
            <div className="text-center sm:text-left min-w-0 flex-1">
              <motion.p className="text-purple-400/80 text-[10px] tracking-[0.2em] uppercase font-semibold mb-1"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                ✦ Zeal Education Society's ✦
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8 }}>
                <div className="overflow-hidden w-full relative">
                  <motion.h2
                    className="font-black whitespace-nowrap inline-block"
                    style={{
                      fontSize: 'clamp(13px, 2.2vw, 30px)',
                      background: 'linear-gradient(135deg, #ffffff 0%, #c084fc 40%, #22d3ee 100%)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 12px rgba(139,92,246,0.8))',
                    }}
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                  >
                    Zeal Institute of Business Administration, Computer Application and Research &nbsp;&nbsp;&nbsp;&nbsp; Zeal Institute of Business Administration, Computer Application and Research &nbsp;&nbsp;&nbsp;&nbsp;
                  </motion.h2>
                </div>
              </motion.div>
              <motion.div className="mt-2 flex items-center gap-3 justify-center sm:justify-start flex-wrap"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: 'spring' }}>
                <motion.span className="font-black tracking-[0.3em] text-xs px-3 py-1 rounded-full"
                  style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(34,211,238,0.15))', border: '1px solid rgba(139,92,246,0.6)', color: '#22d3ee' }}
                  animate={{ boxShadow: ['0 0 10px rgba(139,92,246,0.3)', '0 0 25px rgba(139,92,246,0.7)', '0 0 10px rgba(139,92,246,0.3)'] }}
                  transition={{ duration: 2, repeat: Infinity }}>ZIBACAR</motion.span>
                <span className="text-purple-400/60 text-xs tracking-widest uppercase">Presents</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div className="w-full h-px mb-6"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(34,211,238,0.3), transparent)' }}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6, duration: 1 }} />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

          {/* LEFT */}
          <div className="flex-1 text-center lg:text-left w-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 glass neon-border rounded-full px-4 py-2 mb-6"
            >
              <motion.span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              <span className="text-cyan-300 text-xs sm:text-sm tracking-widest uppercase font-medium">
                In Collaboration with IIT Mandi
              </span>
            </motion.div>

            <div className="mb-4">
              {titleWords.map((word, i) => (
                <motion.div key={word} className="overflow-hidden"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.1 }}>
                  <motion.span
                    className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95]"
                    initial={{ y: 80, skewY: 6 }} animate={{ y: 0, skewY: 0 }}
                    transition={{ duration: 0.9, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {i === 0 && <span className="text-white tracking-tight">{word}</span>}
                    {i === 1 && <span className="gradient-text glow-text">{word}</span>}
                  </motion.span>
                </motion.div>
              ))}
            </div>

            <motion.p className="text-base sm:text-xl md:text-2xl text-cyan-300 font-light tracking-[0.15em] uppercase mb-4 glow-cyan"
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.85, duration: 0.8 }}>
              Build The Game · Break The Limit
            </motion.p>

            <motion.p className="text-gray-400 text-sm sm:text-base max-w-xl mb-8 leading-relaxed lg:mx-0 mx-auto"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.8 }}>
              Dive into the future of immersive technologies. Build groundbreaking games with peers, mentors, and industry experts.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 lg:justify-start justify-center items-center"
            >
              <motion.button
                className="relative w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-base text-white overflow-hidden group"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onRegister}
              >
                <motion.span className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)' }}
                  animate={{ x: ['-100%', '200%'] }} transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 2 }} />
                <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/40 rounded-tl-2xl" />
                <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/40 rounded-br-2xl" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>⬡</motion.span>
                  Register Now
                </span>
              </motion.button>
              <motion.button
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-base text-purple-300 glass neon-border"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Learn More ↓
              </motion.button>
            </motion.div>


          </div>

          {/* RIGHT: 3D Model */}
          <motion.div
            className="w-full lg:flex-1 lg:max-w-[520px] relative"
            style={{ height: 'clamp(260px, 42vw, 580px)' }}
            initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)' }} />
            {['top-3 left-3 border-t-2 border-l-2 rounded-tl-xl', 'top-3 right-3 border-t-2 border-r-2 rounded-tr-xl',
              'bottom-3 left-3 border-b-2 border-l-2 rounded-bl-xl', 'bottom-3 right-3 border-b-2 border-r-2 rounded-br-xl'
            ].map((cls, i) => (
              <motion.div key={i} className={`absolute w-5 h-5 border-purple-500/60 ${cls}`}
                animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
            ))}
            <motion.div className="absolute left-3 right-3 h-px pointer-events-none z-10"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.6), transparent)' }}
              animate={{ top: ['10%', '90%', '10%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div className="hidden sm:block absolute top-5 left-5 z-10 font-mono text-[10px] text-cyan-400/60 leading-5"
              animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 3, repeat: Infinity }}>
              <div>SYS: ONLINE</div><div>XR_CORE: v4.2.1</div><div>RENDER: 120fps</div>
            </motion.div>
            <motion.div className="hidden sm:block absolute bottom-5 right-5 z-10 font-mono text-[10px] text-purple-400/60 leading-5 text-right"
              animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }}>
              <div>FOV: 120°</div><div>LATENCY: 2ms</div><div>STATUS: READY</div>
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

        <motion.div className="flex flex-col items-center gap-2 py-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
          <span className="text-purple-400/40 text-[10px] tracking-[0.4em] uppercase">Scroll to explore</span>
          <motion.div className="w-px h-10 bg-gradient-to-b from-purple-500 to-transparent"
            animate={{ scaleY: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

