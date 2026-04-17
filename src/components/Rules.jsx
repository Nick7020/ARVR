import { motion } from 'framer-motion';

const sections = [
  {
    icon: '🎮', title: 'Event Overview', color: '#a855f7',
    items: [
      'Final Presentation: 23 April 2026',
      'Venue: Zeal College',
      'Theme: Open Theme',
      'Technology: Open',
      'Students develop game independently & present on final day',
    ],
  },
  {
    icon: '📅', title: 'Important Dates', color: '#22d3ee',
    items: [
      'Final Submission: 20 April 2026',
      'Final Presentation: 23 April 2026',
    ],
  },
  {
    icon: '👥', title: 'Team Structure', color: '#3b82f6',
    items: [
      'Team size: 1 to 4 students',
      'Individual participation allowed',
      'Students from any branch can participate',
      'Interdisciplinary teams allowed',
    ],
  },
  {
    icon: '⚙️', title: 'Allowed Technologies', color: '#ec4899',
    items: [
      'Unity / Unreal Engine / Godot',
      'Python / Java / C++',
      'HTML5 / JavaScript',
      'Mobile app development',
      'No-code platforms & any other tool',
    ],
  },
  {
    icon: '🕹️', title: 'Game Requirements', color: '#f59e0b',
    items: [
      'Open game theme',
      'Game must be playable',
      'Game must be original',
      'Open-source assets allowed',
    ],
  },
  {
    icon: '📤', title: 'Final Submission (20 April)', color: '#10b981',
    items: [
      'Game file (APK / EXE / Web link)',
      'Source code (ZIP)',
      'PPT presentation (max 5 slides)',
      'Game description & team details',
    ],
  },
  {
    icon: '🎤', title: 'Presentation Rules (23 April)', color: '#6366f1',
    items: [
      '5 minutes presentation per team',
      '2 minutes Q&A',
      'Teams must bring their laptop',
      'Game must run properly',
      "Judge's decision will be final",
    ],
  },
  {
    icon: '🏆', title: 'Judging Criteria (100 Marks)', color: '#f43f5e',
    items: [
      'Idea Creativity – 20 marks',
      'Game Design – 20 marks',
      'Technical Implementation – 20 marks',
      'UI/UX – 15 marks',
      'Gameplay Experience – 15 marks',
      'Presentation – 10 marks',
    ],
  },
  {
    icon: '📜', title: 'Code of Conduct', color: '#a855f7',
    items: [
      'Maintain discipline during event',
      'Respect judges and participants',
      'Follow event schedule',
      'Misconduct may lead to disqualification',
    ],
  },
];

export default function Rules() {
  return (
    <section id="rules" className="relative py-16 sm:py-24 md:py-32 px-4">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)' }} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-purple-400 text-sm tracking-[0.3em] uppercase font-medium">Guidelines</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mt-3">
            Rule <span className="gradient-text">Book</span>
          </h2>

          {/* About banner */}
          <motion.div
            className="mt-6 max-w-3xl mx-auto glass rounded-2xl p-5 neon-border text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-300 text-sm leading-relaxed">
              <span className="text-purple-300 font-semibold">Zeal College</span> is organizing the Game Designing Hackathon in collaboration with{' '}
              <span className="text-cyan-300 font-semibold">IIT Mandi iHub</span> and{' '}
              <span className="text-cyan-300 font-semibold">HCI Foundation</span>, with sponsorship support from{' '}
              <span className="text-purple-300 font-semibold">Vinsys IT Services Limited</span>.
              This initiative aims to provide students with exposure to Game Development, AI, and Human-Computer Interaction.
            </p>
          </motion.div>
        </motion.div>

        {/* Rules grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((sec, i) => (
            <motion.div
              key={sec.title}
              className="glass rounded-2xl p-5 group cursor-pointer relative overflow-hidden"
              style={{ border: `1px solid ${sec.color}20` }}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -5, boxShadow: `0 15px 40px ${sec.color}25`, borderColor: sec.color + '50' }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 30% 30%, ${sec.color}08 0%, transparent 60%)` }} />

              {/* Rule number */}
              <div className="absolute top-3 right-3 text-xs font-mono opacity-20 group-hover:opacity-50 transition-opacity"
                style={{ color: sec.color }}>
                {String(i + 1).padStart(2, '0')}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <motion.span
                  className="text-2xl"
                  whileHover={{ scale: 1.3, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >{sec.icon}</motion.span>
                <h3 className="text-sm font-bold leading-tight" style={{ color: sec.color }}>
                  {sec.title}
                </h3>
              </div>

              <ul className="space-y-2">
                {sec.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
                    <span className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5" style={{ background: sec.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

