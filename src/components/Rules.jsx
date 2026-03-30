import { motion } from 'framer-motion';

const rules = [
  { icon: '👥', title: 'Team Size 2–4', desc: 'Each team must have 2 to 4 members. Solo entries are not accepted.', color: '#a855f7' },
  { icon: '🎓', title: 'Students Only', desc: 'Open exclusively to currently enrolled undergraduate and postgraduate students.', color: '#3b82f6' },
  { icon: '🛠️', title: 'Working Prototype', desc: 'A functional prototype must be demonstrated during the final presentation.', color: '#22d3ee' },
  { icon: '🥽', title: 'AR/VR Mandatory', desc: 'Projects must incorporate augmented or virtual reality as a core component.', color: '#ec4899' },
  { icon: '🔓', title: 'Open Source Tools', desc: 'Use of open-source frameworks and tools is encouraged and preferred.', color: '#f59e0b' },
  { icon: '🚫', title: 'No Pre-built Code', desc: 'All code must be written during the hackathon. Pre-existing projects are disqualified.', color: '#10b981' },
  { icon: '⏱️', title: '48 Hour Timeline', desc: 'The entire build phase spans exactly 48 hours from kickoff to submission.', color: '#6366f1' },
  { icon: '🎤', title: 'Presentation Required', desc: 'Teams must present their solution to a panel of judges at the end.', color: '#f43f5e' },
];

export default function Rules() {
  return (
    <section id="rules" className="relative py-32 px-4">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)' }} />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-purple-400 text-sm tracking-[0.3em] uppercase font-medium">Guidelines</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mt-3">
            Hackathon <span className="gradient-text">Rules</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">Follow these guidelines to ensure a fair and exciting competition for everyone.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {rules.map((rule, i) => (
            <motion.div
              key={rule.title}
              className="glass rounded-2xl p-6 group cursor-pointer relative overflow-hidden"
              style={{ border: `1px solid ${rule.color}20` }}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -6, boxShadow: `0 15px 40px ${rule.color}25`, borderColor: rule.color + '50' }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 30% 30%, ${rule.color}10 0%, transparent 60%)` }}
              />
              <motion.div
                className="text-3xl mb-4 relative z-10"
                whileHover={{ scale: 1.3, rotate: 10 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {rule.icon}
              </motion.div>
              <h3 className="text-sm font-bold text-white mb-2 relative z-10" style={{ color: rule.color }}>
                {rule.title}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed relative z-10">{rule.desc}</p>

              {/* Rule number */}
              <div className="absolute top-4 right-4 text-xs font-mono opacity-20 group-hover:opacity-60 transition-opacity"
                style={{ color: rule.color }}>
                {String(i + 1).padStart(2, '0')}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
