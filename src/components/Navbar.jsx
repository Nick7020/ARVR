import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useRef } from 'react';

const links = [
  { label: 'About', href: '#about', icon: '◈' },
  { label: 'Tracks', href: '#tracks', icon: '◉' },
  { label: 'Timeline', href: '#timeline', icon: '◎' },
  { label: 'Prizes', href: '#prizes', icon: '◆' },
  { label: 'Rules', href: '#rules', icon: '◇' },
];

function HoloLogo() {
  return (
    <motion.a
      href="#"
      className="relative flex items-center gap-3 group"
      whileHover="hover"
    >
      {/* Animated hexagon icon */}
      <div className="relative w-9 h-9">
        <motion.svg viewBox="0 0 40 40" className="w-full h-full absolute inset-0"
          animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
          <polygon points="20,2 36,11 36,29 20,38 4,29 4,11"
            fill="none" stroke="url(#logoGrad)" strokeWidth="1.5" strokeDasharray="4 2" />
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
        </motion.svg>
        <motion.svg viewBox="0 0 40 40" className="w-full h-full absolute inset-0"
          animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}>
          <polygon points="20,6 33,13 33,27 20,34 7,27 7,13"
            fill="rgba(139,92,246,0.15)" stroke="rgba(34,211,238,0.5)" strokeWidth="1" />
        </motion.svg>
        {/* Center dot */}
        <motion.div className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-2 h-2 rounded-full bg-cyan-400"
            style={{ boxShadow: '0 0 8px #22d3ee, 0 0 16px #22d3ee' }} />
        </motion.div>
      </div>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <motion.span
          className="text-base font-black tracking-wider"
          style={{ background: 'linear-gradient(135deg, #fff 0%, #a855f7 50%, #22d3ee 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Game-o-thon
        </motion.span>
        <span className="text-[10px] tracking-[0.35em] text-purple-400/70 uppercase font-medium">Game-o-thon 2K26</span>
      </div>

      {/* Scan line on hover */}
      <motion.div
        className="absolute inset-0 overflow-hidden rounded pointer-events-none"
        variants={{ hover: {} }}
      >
        <motion.div
          className="absolute left-0 right-0 h-px opacity-0"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.8), transparent)' }}
          variants={{ hover: { opacity: [0, 1, 0], y: [0, 36, 36] } }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </motion.a>
  );
}

function NavLink({ link, index, active }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={link.href}
      className="relative flex items-center gap-1.5 px-1 py-1 group"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index + 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Icon */}
      <motion.span
        className="text-[10px] text-purple-500"
        animate={{ opacity: hovered ? 1 : 0.3, scale: hovered ? 1.2 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {link.icon}
      </motion.span>

      {/* Label */}
      <span className={`text-sm font-medium transition-colors duration-200 ${hovered ? 'text-white' : 'text-gray-400'}`}>
        {link.label}
      </span>

      {/* Hover underline with glow */}
      <motion.span
        className="absolute bottom-0 left-0 right-0 h-px rounded-full"
        style={{ background: 'linear-gradient(90deg, #a855f7, #22d3ee)' }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      />

      {/* Glow dot on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{ boxShadow: '0 0 6px #22d3ee' }}
          />
        )}
      </AnimatePresence>
    </motion.a>
  );
}

export default function Navbar({ onRegister }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', v => setScrolled(v > 60));

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top scan line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #a855f7 30%, #22d3ee 70%, transparent 100%)' }}
        animate={{ opacity: scrolled ? 0.8 : 0.3 }}
      />

      <div
        className="mx-2 sm:mx-4 mt-3 rounded-2xl px-4 sm:px-6 py-3 transition-all duration-500"
        style={{
          background: scrolled
            ? 'rgba(2,0,16,0.88)'
            : 'rgba(2,0,16,0.4)',
          backdropFilter: 'blur(24px)',
          border: scrolled
            ? '1px solid rgba(139,92,246,0.25)'
            : '1px solid rgba(139,92,246,0.1)',
          boxShadow: scrolled
            ? '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.05), inset 0 1px 0 rgba(255,255,255,0.04)'
            : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <HoloLogo />

          {/* Center: nav links with pill indicator */}
          <div className="hidden md:flex items-center gap-1 relative">
            {/* Background pill */}
            <div className="absolute inset-0 rounded-xl"
              style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.08)' }} />
            <div className="relative flex items-center gap-1 px-3 py-1">
              {links.map((link, i) => (
                <NavLink key={link.label} link={link} index={i} />
              ))}
            </div>
          </div>

          {/* Right: CTA + status */}
          <div className="hidden md:flex items-center gap-4">
            {/* Live badge */}
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', color: '#22d3ee' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              Registrations Open
            </motion.div>

            {/* Register button */}
            <motion.button
              className="relative px-6 py-2.5 rounded-xl text-sm font-bold text-white overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onRegister}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              {/* Shimmer sweep */}
              <motion.span
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)' }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }}
              />
              {/* Corner accents */}
              <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30 rounded-tl-xl" />
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30 rounded-br-xl" />
              <span className="relative z-10 flex items-center gap-2">
                <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                  ⬡
                </motion.span>
                Register Now
              </span>
              {/* Outer glow */}
              <motion.span
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: '0 0 20px rgba(139,92,246,0.6), 0 0 40px rgba(59,130,246,0.3)' }}
              />
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <motion.button
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg"
            style={{ border: '1px solid rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.08)' }}
            onClick={() => setOpen(!open)}
            whileTap={{ scale: 0.9 }}
          >
            {[0, 1, 2].map(i => (
              <motion.span key={i} className="block h-px w-5 bg-purple-300"
                animate={{
                  rotate: open ? (i === 0 ? 45 : i === 2 ? -45 : 0) : 0,
                  y: open ? (i === 0 ? 6 : i === 2 ? -6 : 0) : 0,
                  opacity: open && i === 1 ? 0 : 1,
                }}
                transition={{ duration: 0.25 }}
              />
            ))}
          </motion.button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden mx-4 mt-1 rounded-2xl overflow-hidden"
            style={{ background: 'rgba(2,0,16,0.95)', backdropFilter: 'blur(24px)', border: '1px solid rgba(139,92,246,0.2)' }}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="p-4 flex flex-col gap-1">
              {links.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-4 rounded-xl text-gray-300 active:text-white active:bg-purple-500/10 transition-all duration-200"
                  onClick={() => {
                    setOpen(false);
                    setTimeout(() => {
                      const el = document.querySelector(link.href);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <span className="text-purple-400 text-sm">{link.icon}</span>
                  <span className="text-base font-semibold">{link.label}</span>
                </motion.a>
              ))}
              <div className="mt-2 pt-3" style={{ borderTop: '1px solid rgba(139,92,246,0.15)' }}>
                <button
                  className="w-full py-3 rounded-xl text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
                  onClick={() => { setOpen(false); onRegister(); }}
                >
                  🚀 Register Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

