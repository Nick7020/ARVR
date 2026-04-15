import { motion } from 'framer-motion';

const tracks = [
  { icon: '🎮', title: 'Game Development', desc: 'Create immersive gaming experiences that push the boundaries of interactive entertainment using any platform or technology.', color: '#a855f7', tag: 'Open Theme' },
];

export default function Tracks() {
  return (
    <section id="tracks" className="relative py-16 sm:py-24 md:py-32 px-4">
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
          <span className="text-cyan-400 text-sm tracking-[0.3em] uppercase font-medium">Challenge Area</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mt-3">
            Hack <span className="gradient-text">Track</span>
          </h2>
        </motion.div>

        <motion.div
          className="relative glass rounded-2xl p-8 group overflow-hidden cursor-pointer w-full"
          style={{ border: `1px solid #a855f720` }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.01, y: -4 }}
        >
          {/* Glow bg */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
            style={{ background: 'radial-gradient(circle at 30% 50%, #a855f715 0%, transparent 60%)' }} />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Icon */}
            <motion.div
              className="text-8xl flex-shrink-0"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              whileHover={{ scale: 1.2, rotate: 15 }}
            >🎮</motion.div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                <h3 className="text-2xl sm:text-3xl font-black" style={{ color: '#a855f7' }}>Game Development</h3>
                <span className="text-xs px-3 py-1 rounded-full font-bold"
                  style={{ background: '#a855f720', color: '#a855f7', border: '1px solid #a855f740' }}>Open Theme</span>
              </div>
              <p className="text-gray-400 text-base leading-relaxed mb-6 max-w-2xl">
                Create immersive gaming experiences that push the boundaries of interactive entertainment using any platform or technology of your choice.
              </p>

              {/* Tech pills */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {['Unity','Unreal Engine','Godot','Python','Java','C++','HTML5 / JS','Mobile App','No-Code'].map(tech => (
                  <span key={tech} className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', color: '#c084fc' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex md:flex-col gap-6 md:gap-4 flex-shrink-0">
              {[['1-4','Team Size'],['Open','Theme'],['22 Apr','Final Day']].map(([val, label]) => (
                <div key={label} className="text-center">
                  <div className="text-xl font-black" style={{ color: '#22d3ee' }}>{val}</div>
                  <div className="text-gray-500 text-xs tracking-widest uppercase mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <motion.div className="mt-5 flex items-center gap-2 text-xs font-medium justify-center md:justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ color: '#a855f7' }}>
            <span>Explore Track</span>
            <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1, repeat: Infinity }}>→</motion.span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
