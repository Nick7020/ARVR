import { motion } from 'framer-motion';

const prizes = [
  {
    rank: '1st', icon: '🥇', label: 'Grand Prize',
    amount: '₹21,000', perks: ['Winner Certificate', 'Trophy'],
    gradient: 'from-yellow-500/30 via-amber-500/20 to-orange-500/10',
    border: 'rgba(234,179,8,0.5)', glow: 'rgba(234,179,8,0.3)', scale: 1.05,
  },
  {
    rank: '2nd', icon: '🥈', label: 'Runner Up',
    amount: '₹11,000', perks: ['Winner Certificate', 'Trophy'],
    gradient: 'from-slate-400/30 via-gray-400/20 to-slate-500/10',
    border: 'rgba(148,163,184,0.5)', glow: 'rgba(148,163,184,0.3)', scale: 1,
  },
  {
    rank: '3rd', icon: '🥉', label: '2nd Runner Up',
    amount: '₹7,000', perks: ['Winner Certificate', 'Trophy'],
    gradient: 'from-orange-600/30 via-amber-700/20 to-orange-800/10',
    border: 'rgba(194,120,60,0.5)', glow: 'rgba(194,120,60,0.3)', scale: 1,
  },
];

export default function Prizes() {
  return (
    <section id="prizes" className="relative py-16 sm:py-24 md:py-32 px-4">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(234,179,8,0.5), transparent)' }} />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-yellow-400 text-sm tracking-[0.3em] uppercase font-medium">Rewards</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mt-3">
            Win <span className="gradient-text">Prizes</span>
          </h2>
          <p className="text-gray-400 mt-4 text-lg">Over ₹39,000 in prizes and opportunities</p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-stretch justify-center gap-6">
          {[prizes[1], prizes[0], prizes[2]].map((prize, i) => (
            <motion.div
              key={prize.rank}
              className={`relative rounded-2xl p-6 w-full md:w-72 bg-gradient-to-b ${prize.gradient} group cursor-pointer`}
              style={{ border: `1px solid ${prize.border}` }}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              whileHover={{ y: -8, boxShadow: `0 20px 60px ${prize.glow}` }}
            >
              {prize.rank === '1st' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-black"
                  style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
                  ⭐ TOP PRIZE
                </div>
              )}

              <div className="text-center mb-6">
                <motion.div
                  className="text-6xl mb-3"
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                >
                  {prize.icon}
                </motion.div>
                <div className="text-gray-400 text-sm uppercase tracking-widest">{prize.label}</div>
                <div className="text-4xl font-black mt-2" style={{ color: prize.border.replace('0.5', '1') }}>
                  {prize.amount}
                </div>
              </div>

              <ul className="space-y-3">
                {prize.perks.map(perk => (
                  <li key={perk} className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: prize.border.replace('0.5', '1') }} />
                    {perk}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Special prizes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
          {[['🎯', 'Best UI/UX'], ['🔬', 'Most Innovative'], ['🌟', 'Best Pitch']].map(([icon, title]) => (
            <motion.div
              key={title}
              className="glass rounded-xl p-5 text-center neon-border"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl mb-2">{icon}</div>
              <div className="text-white font-semibold text-sm">{title}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
