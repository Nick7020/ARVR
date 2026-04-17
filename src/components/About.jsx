import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const cards = [
  {
    icon: '💡',
    title: 'Innovation',
    desc: 'Push the boundaries of what\'s possible with cutting-edge AR/VR technologies and creative problem-solving.',
    color: 'from-purple-500/20 to-purple-900/10',
    glow: 'rgba(168,85,247,0.3)',
  },
  {
    icon: '⚡',
    title: 'Technology',
    desc: 'Leverage the latest immersive tech stack — WebXR, Unity, Unreal Engine, and spatial computing platforms.',
    color: 'from-blue-500/20 to-blue-900/10',
    glow: 'rgba(59,130,246,0.3)',
  },
  {
    icon: '🤝',
    title: 'Collaboration',
    desc: 'Work alongside brilliant minds, industry mentors, and fellow innovators to create something extraordinary.',
    color: 'from-cyan-500/20 to-cyan-900/10',
    glow: 'rgba(34,211,238,0.3)',
  },
];

function TiltCard({ card, index }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouse = e => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={`relative glass rounded-2xl p-8 cursor-pointer group`}
      whileHover={{ boxShadow: `0 20px 60px ${card.glow}` }}
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative z-10">
        <motion.div
          className="text-5xl mb-5"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
        >
          {card.icon}
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-3 gradient-text">{card.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[1px] rounded-b-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${card.glow}, transparent)` }} />
    </motion.div>
  );
}

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} className="relative py-16 sm:py-24 md:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-purple-400 text-sm tracking-[0.3em] uppercase font-medium">Who We Are</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mt-3 mb-6">
            About the <span className="gradient-text">Hackathon</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            The <span className="text-purple-300 font-semibold">Game Designing Hackathon</span> is organized by Zeal College in collaboration with <span className="text-cyan-300 font-semibold">IIT Mandi iHub</span> and <span className="text-cyan-300 font-semibold">HCI Foundation</span>. Students develop original games and present them to expert judges.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => <TiltCard key={card.title} card={card} index={i} />)}
        </div>


      </div>
    </section>
  );
}

