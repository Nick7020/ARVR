import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';

const links = ['About', 'Tracks', 'Timeline', 'Prizes', 'Rules'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(2,0,16,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(139,92,246,0.15)' : 'none',
      }}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <motion.div className="text-xl font-black gradient-text glow-text" whileHover={{ scale: 1.05 }}>
          AR/VR 2026
        </motion.div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link, i) => (
            <motion.a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-300 relative group"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.5 }}
            >
              {link}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-purple-500 to-cyan-400 group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
          <motion.button
            className="px-5 py-2 rounded-full text-sm font-bold text-white btn-glow"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Register
          </motion.button>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setOpen(!open)}>
          <div className="w-6 flex flex-col gap-1.5">
            <motion.span className="h-px bg-current block" animate={{ rotate: open ? 45 : 0, y: open ? 8 : 0 }} />
            <motion.span className="h-px bg-current block" animate={{ opacity: open ? 0 : 1 }} />
            <motion.span className="h-px bg-current block" animate={{ rotate: open ? -45 : 0, y: open ? -8 : 0 }} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <motion.div
        className="md:hidden overflow-hidden"
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="pt-4 pb-2 flex flex-col gap-3">
          {links.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`}
              className="text-gray-400 hover:text-white text-sm py-2 px-2 transition-colors"
              onClick={() => setOpen(false)}>
              {link}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
}
