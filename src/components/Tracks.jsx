import { motion } from 'framer-motion';

const tracks = [
  { icon: '🎮', title: 'AR/VR Gaming', desc: 'Create immersive gaming experiences that push the boundaries of interactive entertainment.', color: '#a855f7', tag: 'Most Popular' },
  { icon: '🏥', title: 'Healthcare & Wellness', desc: 'Revolutionize patient care, medical training, and mental health through immersive simulations.', color: '#3b82f6', tag: '' },
  { icon: '🎓', title: 'Education & Training', desc: 'Transform learning with virtual classrooms, interactive simulations, and spatial education tools.', color: '#22d3ee', tag: '' },
  { icon: '🏙️', title: 'Smart Cities', desc: 'Visualize urban planning, infrastructure, and city management through AR/VR overlays.', color: '#ec4899', tag: '' },
  { icon: '🛒', title: 'Retail & Commerce', desc: 'Build virtual try-on, immersive shopping, and AR product visualization experiences.', color: '#f59e0b', tag: '' },
  { icon: '🌍', title: 'Social Impact', desc: 'Use immersive tech to address climate change, accessibility, and humanitarian challenges.', color: '#10b981', tag: '' },
];

export default function Tracks() {
  return (
    <section id="tracks" className="relative py-32 px-4">
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)' }} />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-cyan-400 text-sm tracking-[0.3em] uppercase font-medium">Challenge Areas</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mt-3">
            Hack <span className="gradient-text">Tracks</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track, i) => (
            <motion.div
              key={track.title}
              className="relative glass rounded-2xl p-7 group overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              {/* Glow bg on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(circle at 50% 0%, ${track.color}20 0%, transparent 70%)` }}
              />
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-opacity-50 transition-all duration-500"
                style={{ borderColor: track.color + '40' }} />

              {track.tag && (
                <span className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-medium"
                  style={{ background: track.color + '20', color: track.color, border: `1px solid ${track.color}40` }}>
                  {track.tag}
                </span>
              )}

              <motion.div
                className="text-4xl mb-4"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
                whileHover={{ scale: 1.3, rotate: 15 }}
              >
                {track.icon}
              </motion.div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
                style={{ backgroundImage: `linear-gradient(135deg, ${track.color}, #fff)`, WebkitBackgroundClip: 'text' }}>
                {track.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{track.desc}</p>

              <div className="mt-5 flex items-center gap-2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ color: track.color }}>
                <span>Explore Track</span>
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1, repeat: Infinity }}>→</motion.span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
