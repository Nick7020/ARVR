import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const GameController = ({ className }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none">
    <defs>
      <radialGradient id="glowPink" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8">
          <animate attributeName="stopOpacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
        </stop>
        <stop offset="50%" stopColor="#ec4899" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#ec4899" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="glowBlue" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.8">
          <animate attributeName="stopOpacity" values="0.8;1;0.8" dur="2.5s" repeatCount="indefinite"/>
        </stop>
        <stop offset="50%" stopColor="#00f5ff" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#00f5ff" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <motion.g animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
      {/* Body */}
      <motion.rect rx="25" ry="25" width="160" height="120" fill="url(#glowBlue)" opacity="0.9" stroke="#00f5ff" strokeWidth="2">
        <animate attributeName="opacity" values="0.9;1;0.9" dur="3s" repeatCount="indefinite"/>
      </motion.rect>
      {/* Buttons */}
      <circle cx="65" cy="55" r="12" fill="url(#glowPink)" stroke="#ec4899" strokeWidth="2"/>
      <circle cx="95" cy="55" r="12" fill="#00f5ff" stroke="#00f5ff" strokeWidth="1.5"/>
      <circle cx="65" cy="85" r="12" fill="#00f5ff" stroke="#00f5ff" strokeWidth="1.5"/>
      <circle cx="95" cy="85" r="12" fill="url(#glowPink)" stroke="#ec4899" strokeWidth="2"/>
      {/* D-pad */}
      <motion.path d="M45 90 L45 110 L35 110 L35 100 M45 100 L55 100 L55 110 L65 110 L65 90" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <animateTransform attributeName="transform" type="rotate" values="0 50 100; 10 50 100; -10 50 100; 0 50 100" dur="5s" repeatCount="indefinite"/>
      </motion.path>
      {/* Joystick */}
      <motion.g transformOrigin="75 130">
        <circle cx="75" cy="130" r="15" fill="url(#glowPink)" opacity="0.9"/>
        <circle cx="75" cy="130" r="8" fill="#ec4899"/>
        <animateTransform attributeName="transform" type="rotate" values="0 75 130; 360 75 130" dur="10s" repeatCount="indefinite"/>
      </motion.g>
    </motion.g>
  </svg>
);

export default function GameOThonLanding() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col overflow-hidden pt-24 pb-20 bg-[#020010]">
      {/* Circuit Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-10" style={{ backgroundSize: '80px 80px' }} />
      
      {/* Floating Glow Orbs */}
      <motion.div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-pink-400/20 to-blue-400/20 blur-3xl" 
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }} transition={{ duration: 5, repeat: Infinity }} />
      <motion.div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-gradient-to-r from-blue-400/20 via-pink-400/20 to-blue-400/20 blur-3xl" 
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 6, repeat: Infinity, delay: 2 }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex-1">
        
        {/* 1. Hero Section */}
        <motion.div className="text-center mb-20" style={{ y }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
          <motion.div className="inline-flex items-center gap-3 glass neon-border rounded-full px-6 py-3 mb-8 mx-auto max-w-max" 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-blue-500 rounded-full animate-pulse-glow" />
            <span className="text-blue-300 text-sm uppercase tracking-widest font-bold">Open Theme Game Dev</span>
          </motion.div>
          
          <GameController className="w-48 h-48 mx-auto mb-8 drop-shadow-2xl filter neon-border" />
          
          <motion.h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-4 leading-[0.9] bg-gradient-to-r from-pink-400 via-blue-400 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl glow-text"
            initial={{ y: 50 }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            GAME-O-THON
          </motion.h1>
          <motion.p className="text-xl sm:text-2xl md:text-3xl text-blue-300 font-light tracking-[0.1em] uppercase mb-12 glow-cyan"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            Build the Game, Break the Limit
          </motion.p>
          
          <motion.button className="group relative px-12 py-6 rounded-3xl font-bold text-xl bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-2xl btn-glow overflow-hidden"
            whileHover={{ scale: 1.1, y: -4 }} whileTap={{ scale: 0.98 }} onClick={() => console.log('Register clicked!')}>
            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">🎮 Register Now</span>
          </motion.button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">

          {/* 2. Event Info Card */}
          <motion.div className="glass neon-border rounded-2xl p-8 text-center card-hover" 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-2xl font-black mb-6 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">📌 Event Info</h3>
            <ul className="space-y-4 text-blue-200">
              <li><strong>Theme:</strong> Open Theme</li>
              <li><strong>Team Size:</strong> 1–4 Students</li>
              <li><strong>Technology:</strong> 2D / 3D / Mobile / Web</li>
            </ul>
          </motion.div>

          {/* 3. Prize Section */}
          <motion.div className="glass neon-border rounded-2xl p-8 md:col-span-2 lg:col-span-1 card-hover" 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}>
            <h3 className="text-2xl font-black mb-6 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent mb-4">🏆 Prizes</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-lg font-bold text-pink-300">
                <span>🥇 1st Prize</span> <span>₹21,000</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-blue-300">
                <span>🥈 2nd Prize</span> <span>₹11,000</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-cyan-300">
                <span>🥉 3rd Prize</span> <span>₹7,000</span>
              </div>
            </div>
          </motion.div>

          {/* 4. Registration */}
          <motion.div className="glass neon-border rounded-2xl p-8 card-hover" 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-2xl font-black mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">💳 Registration</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex justify-between text-lg"><span>Individual:</span> <strong>₹50</strong></li>
              <li className="flex justify-between text-lg"><span>Group (2-4):</span> <strong>₹150</strong></li>
            </ul>
            <motion.button className="w-full px-6 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-green-500 to-blue-500 text-white btn-glow"
              whileHover={{ scale: 1.05 }} onClick={() => console.log('Register clicked!')}>
              Join the Game Dev Revolution
            </motion.button>
          </motion.div>

        </div>

        {/* 5. Date Banner */}
        <motion.div className="glass neon-border rounded-3xl p-8 text-center max-w-2xl mx-auto mb-20 card-hover"
          initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          <h3 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">📅 Final Presentation</h3>
          <p className="text-2xl md:text-3xl font-mono tracking-widest text-blue-300 glow-cyan">22 April 2026</p>
        </motion.div>

        {/* 6. Footer Organizers */}
        <motion.footer className="glass neon-border rounded-3xl p-12 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h3 className="text-2xl font-black mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">🤝 Organized By</h3>
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <div>
              <p className="text-lg font-bold text-white mb-2">Zeal Education Society</p>
            </div>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-pink-400 to-blue-400" />
            <div>
              <p className="text-sm text-blue-300">In Collaboration With:</p>
              <p className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">IIT Mandi iHub & HCI Foundation</p>
            </div>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-pink-400 to-blue-400" />
            <div>
              <p className="text-lg font-bold text-yellow-300">Sponsored By: Vinsys</p>
            </div>
          </div>
        </motion.footer>
      </div>
    </section>
  );
}

