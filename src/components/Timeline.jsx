import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const events = [
  { date: 'March 15, 2026', title: 'Registration Opens', desc: 'Doors open for all innovators. Form your team and secure your spot.', icon: '🚀', color: '#a855f7' },
  { date: 'April 10, 2026', title: 'Registration Closes', desc: 'Last chance to register. All team submissions must be finalized.', icon: '⏰', color: '#3b82f6' },
  { date: 'April 20–21, 2026', title: 'Hackathon Day', desc: '48 hours of non-stop innovation, mentorship, and building.', icon: '⚡', color: '#22d3ee' },
  { date: 'May 5, 2026', title: 'Result Announcement', desc: 'Winners revealed! Prizes, recognition, and celebration await.', icon: '🏆', color: '#ec4899' },
];

export default function Timeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%']);

  return (
    <section id="timeline" ref={ref} className="relative py-16 sm:py-24 md:py-32 px-4">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.5), transparent)' }} />

      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-blue-400 text-sm tracking-[0.3em] uppercase font-medium">Schedule</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mt-3">
            Event <span className="gradient-text">Timeline</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line track */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/5 rounded-full" />
          {/* Animated fill */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px] rounded-full timeline-line"
            style={{ height: lineHeight }}
          />

          <div className="flex flex-col gap-12">
            {events.map((event, i) => (
              <motion.div
                key={event.title}
                className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-8"
                style={{ flexDirection: i % 2 === 0 ? undefined : undefined }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Mobile: vertical layout. Desktop: alternating left/right */}
                <div className={`flex-1 w-full sm:w-auto ${ i % 2 !== 0 ? 'sm:order-3' : '' }`}>
                  <motion.div
                    className="glass rounded-2xl p-5 cursor-pointer"
                    whileHover={{ scale: 1.02, boxShadow: `0 10px 40px ${event.color}30` }}
                    style={{ border: `1px solid ${event.color}20` }}
                  >
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="text-2xl">{event.icon}</span>
                      <span className="text-xs font-mono px-3 py-1 rounded-full"
                        style={{ background: event.color + '15', color: event.color, border: `1px solid ${event.color}30` }}>
                        {event.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{event.desc}</p>
                  </motion.div>
                </div>

                {/* Center node */}
                <div className="relative flex-shrink-0 z-10 sm:order-2">
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg"
                    style={{ background: `radial-gradient(circle, ${event.color}40, ${event.color}10)`, border: `2px solid ${event.color}` }}
                    animate={{ boxShadow: [`0 0 10px ${event.color}50`, `0 0 30px ${event.color}80`, `0 0 10px ${event.color}50`] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    whileInView={{ scale: [0, 1.3, 1] }}
                    viewport={{ once: true }}
                  >
                    {event.icon}
                  </motion.div>
                </div>

                <div className={`flex-1 hidden sm:block ${ i % 2 === 0 ? 'sm:order-3' : 'sm:order-1' }`} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
