import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const fields = [
  { name: 'name',        label: 'Your Name',                      type: 'text',     placeholder: 'John Doe',            icon: '👤' },
  { name: 'email',       label: 'Email Address',                  type: 'email',    placeholder: 'john@example.com',    icon: '📧' },
  { name: 'phone',       label: 'Phone Number',                   type: 'tel',      placeholder: '+91 9876543210',      icon: '📱' },
  { name: 'branch',      label: 'Branch',                         type: 'text',     placeholder: 'MCA / B.Tech CSE',    icon: '🎓' },
  { name: 'collegeName', label: 'College Name',                   type: 'text',     placeholder: 'Your college name',   icon: '🏫' },
  { name: 'teamName',    label: 'Team Name',                      type: 'text',     placeholder: 'Team Nexus',          icon: '⚡' },
  { name: 'teamMembers', label: 'Team Members (comma separated)', type: 'textarea', placeholder: 'Alice, Bob, Charlie', icon: '👥' },
];

/* ── Floating label input ── */
function Field({ f, value, onChange, index }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: focused
            ? '0 0 0 1px rgba(139,92,246,0.8), 0 0 20px rgba(139,92,246,0.25)'
            : '0 0 0 1px rgba(139,92,246,0.15)',
        }}
        transition={{ duration: 0.25 }}
      />
      <motion.label
        className="absolute left-10 font-semibold tracking-widest uppercase pointer-events-none z-10 px-1"
        style={{ background: 'rgba(10,0,30,1)' }}
        animate={{
          top:      focused || hasValue ? -8 : f.type === 'textarea' ? 14 : '50%',
          fontSize: focused || hasValue ? 9  : 12,
          color:    focused ? '#a855f7' : hasValue ? '#7c3aed' : 'rgba(139,92,246,0.45)',
          y:        focused || hasValue ? 0  : f.type === 'textarea' ? 0 : '-50%',
        }}
        transition={{ duration: 0.2 }}
      >
        {f.label}
      </motion.label>
      <motion.span
        className="absolute left-3 text-base pointer-events-none"
        style={{ top: f.type === 'textarea' ? 14 : '50%', transform: f.type === 'textarea' ? 'none' : 'translateY(-50%)' }}
        animate={{ scale: focused ? 1.2 : 1, rotate: focused ? 10 : 0 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >{f.icon}</motion.span>
      {f.type === 'textarea' ? (
        <textarea name={f.name} value={value} onChange={onChange} rows={3} required
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="w-full rounded-xl pl-10 pr-4 pt-5 pb-3 text-sm text-white placeholder-transparent outline-none resize-none"
          style={{ background: 'rgba(139,92,246,0.06)' }} placeholder={f.placeholder} />
      ) : (
        <input type={f.type} name={f.name} value={value} onChange={onChange} required
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="w-full rounded-xl pl-10 pr-8 py-3.5 text-sm text-white placeholder-transparent outline-none"
          style={{ background: 'rgba(139,92,246,0.06)' }} placeholder={f.placeholder} />
      )}
      <AnimatePresence>
        {hasValue && !focused && (
          <motion.span className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 text-xs font-bold"
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}>✓</motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   ROCKET LAUNCH CINEMATIC SEQUENCE
══════════════════════════════════════ */
function RocketLaunch({ onDone }) {
  const [phase, setPhase] = useState('countdown'); // countdown → ignite → launch → space → success

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('ignite'),    2200),
      setTimeout(() => setPhase('launch'),    3400),
      setTimeout(() => setPhase('space'),     5200),
      setTimeout(() => setPhase('success'),   7000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const stars = Array.from({ length: 60 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 2,
  }));

  const confetti = Array.from({ length: 40 }, (_, i) => ({
    color: ['#a855f7','#3b82f6','#22d3ee','#ec4899','#f59e0b','#10b981'][i % 6],
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    size: Math.random() * 10 + 5,
  }));

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #0d0025 0%, #020010 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Stars background */}
      {stars.map((s, i) => (
        <motion.div key={i}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: s.delay }}
        />
      ))}

      {/* ── COUNTDOWN PHASE ── */}
      <AnimatePresence>
        {phase === 'countdown' && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center z-10"
            exit={{ opacity: 0, scale: 2 }} transition={{ duration: 0.4 }}>
            {/* Countdown numbers */}
            {[3, 2, 1].map((n, i) => (
              <motion.div key={n}
                className="absolute text-8xl font-black"
                style={{ background: 'linear-gradient(135deg, #a855f7, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.8))' }}
                initial={{ opacity: 0, scale: 3 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [3, 1, 1, 0.5] }}
                transition={{ duration: 0.7, delay: i * 0.72, times: [0, 0.2, 0.8, 1] }}
              >{n}</motion.div>
            ))}
            <motion.p
              className="absolute text-purple-400/60 text-sm tracking-[0.4em] uppercase"
              style={{ bottom: '35%' }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.7, repeat: Infinity }}
            >Preparing Launch...</motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LAUNCH PAD ── */}
      <AnimatePresence>
        {(phase === 'ignite' || phase === 'launch') && (
          <motion.div className="absolute inset-0 flex flex-col items-end justify-end pb-16 z-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            {/* Launch pad base */}
            <motion.div className="w-full flex flex-col items-center"
              animate={phase === 'launch' ? { y: -800, opacity: 0 } : {}}
              transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
            >
              {/* Rocket */}
              <motion.div className="relative flex flex-col items-center"
                animate={phase === 'ignite' ? { y: [0, -8, 0, -5, 0] } : {}}
                transition={{ duration: 0.3, repeat: phase === 'ignite' ? Infinity : 0 }}
              >
                {/* Rocket body */}
                <div className="text-7xl" style={{ filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.9))' }}>🚀</div>

                {/* Flame */}
                <AnimatePresence>
                  {(phase === 'ignite' || phase === 'launch') && (
                    <motion.div className="absolute -bottom-6 flex flex-col items-center"
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: [1, 1.4, 0.8, 1.2, 1] }}
                      transition={{ duration: 0.15, repeat: Infinity }}
                    >
                      <div className="text-3xl">🔥</div>
                      <motion.div className="w-2 rounded-full mt-1"
                        style={{ background: 'linear-gradient(180deg, #f59e0b, #ef4444, transparent)', height: 40 }}
                        animate={{ scaleX: [1, 1.5, 0.8, 1.3, 1], opacity: [1, 0.8, 1] }}
                        transition={{ duration: 0.1, repeat: Infinity }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Smoke clouds on ignite */}
              <AnimatePresence>
                {phase === 'ignite' && (
                  <motion.div className="flex gap-2 mt-8"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {[...Array(5)].map((_, i) => (
                      <motion.div key={i}
                        className="rounded-full"
                        style={{ width: 20 + i * 8, height: 20 + i * 8, background: 'rgba(200,200,255,0.15)', filter: 'blur(4px)' }}
                        animate={{ scale: [1, 1.5, 1], x: (i - 2) * 10, opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Launch pad */}
              <div className="w-32 h-3 rounded-full mt-2"
                style={{ background: 'linear-gradient(90deg, #a855f7, #3b82f6)', boxShadow: '0 0 20px rgba(139,92,246,0.6)' }} />
              <div className="w-48 h-2 rounded-full mt-1 opacity-50"
                style={{ background: 'rgba(139,92,246,0.3)' }} />
            </motion.div>

            {/* Ground glow */}
            <motion.div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(139,92,246,0.3) 0%, transparent 70%)' }}
              animate={phase === 'launch' ? { opacity: [1, 2, 0] } : { opacity: [0.5, 1, 0.5] }}
              transition={{ duration: phase === 'launch' ? 1 : 0.5, repeat: phase === 'ignite' ? Infinity : 0 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SPACE PHASE ── */}
      <AnimatePresence>
        {phase === 'space' && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center z-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Rocket flying in space */}
            <motion.div
              className="text-6xl"
              style={{ filter: 'drop-shadow(0 0 30px rgba(139,92,246,1))' }}
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: [-20, 20, -20], opacity: 1 }}
              transition={{ y: { duration: 2, repeat: Infinity }, opacity: { duration: 0.5 } }}
            >🚀</motion.div>

            {/* Speed lines */}
            {[...Array(12)].map((_, i) => (
              <motion.div key={i}
                className="absolute h-px"
                style={{
                  width: 40 + Math.random() * 80,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `rgba(${i % 2 === 0 ? '139,92,246' : '34,211,238'},0.4)`,
                }}
                animate={{ x: [100, -200], opacity: [0, 1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}

            <motion.p
              className="absolute text-cyan-400/70 text-sm tracking-[0.4em] uppercase mt-32"
              style={{ top: '60%' }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
            >Entering Orbit...</motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SUCCESS PHASE ── */}
      <AnimatePresence>
        {phase === 'success' && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6 text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* Confetti */}
            {confetti.map((c, i) => (
              <motion.div key={i}
                className="absolute rounded-sm pointer-events-none"
                style={{ width: c.size, height: c.size / 2, background: c.color, left: `${c.x}%`, top: '-5%' }}
                animate={{ y: ['0vh', '110vh'], rotate: [0, 720], opacity: [1, 1, 0] }}
                transition={{ duration: 2.5 + Math.random(), delay: c.delay, ease: 'linear' }}
              />
            ))}

            {/* Success icon */}
            <motion.div
              className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(34,211,238,0.2))',
                border: '2px solid rgba(34,211,238,0.7)',
                boxShadow: '0 0 40px rgba(34,211,238,0.5), 0 0 80px rgba(139,92,246,0.3)',
              }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 12 }}
            >🚀</motion.div>

            {/* Pulsing rings */}
            {[100, 140, 180].map((size, i) => (
              <motion.div key={i}
                className="absolute rounded-full border pointer-events-none"
                style={{ width: size, height: size, borderColor: 'rgba(34,211,238,0.3)' }}
                animate={{ scale: [1, 1.6], opacity: [0.8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}

            <motion.h2
              className="text-4xl font-black mb-2"
              style={{ background: 'linear-gradient(135deg, #fff 0%, #a855f7 50%, #22d3ee 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 15px rgba(139,92,246,0.7))' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >You're Registered!</motion.h2>

            <motion.p className="text-cyan-300 text-lg font-semibold mb-1"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              🎉 Welcome to AR/VR Hackathon 2026
            </motion.p>
            <motion.p className="text-gray-400 text-sm mb-8"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              ZIBACAR · In Collaboration with IIT Mandi
            </motion.p>

            <motion.button
              onClick={onDone}
              className="relative px-12 py-4 rounded-2xl font-black text-white text-base overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(139,92,246,0.6)' }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <motion.span
                className="absolute inset-0"
                style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)' }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              />
              <span className="relative z-10">🌟 Let's Go!</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   MAIN MODAL
══════════════════════════════════════ */
export default function RegisterModal({ onClose }) {
  const [form, setForm]       = useState({ name:'', email:'', phone:'', branch:'', collegeName:'', teamName:'', teamMembers:'' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState(null);
  const [launched, setLaunched] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res  = await fetch(`${API}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setLaunched(true);
      } else {
        setStatus({ ok: false, msg: data.message });
      }
    } catch {
      setStatus({ ok: false, msg: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const filled   = Object.values(form).filter(v => v.trim()).length;
  const progress = Math.round((filled / fields.length) * 100);

  return (
    <>
      {/* Rocket launch fullscreen overlay */}
      <AnimatePresence>
        {launched && <RocketLaunch onDone={onClose} />}
      </AnimatePresence>

      {/* Form modal */}
      <AnimatePresence>
        {!launched && (
          <motion.div
            className="fixed inset-0 z-[9990] flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: 'rgba(2,0,16,0.9)', backdropFilter: 'blur(16px)' }}
              onClick={onClose}
            />

            <motion.div
              className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl z-10"
              style={{
                background: 'linear-gradient(145deg, rgba(15,5,45,0.99), rgba(5,0,25,0.99))',
                border: '1px solid rgba(139,92,246,0.3)',
                boxShadow: '0 0 80px rgba(139,92,246,0.2)',
              }}
              initial={{ opacity: 0, scale: 0.8, y: 60, rotateX: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 60 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            >
              {/* Progress bar top */}
              <div className="relative h-1 w-full rounded-t-3xl overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'rgba(139,92,246,0.15)' }} />
                <motion.div className="h-full"
                  style={{ background: 'linear-gradient(90deg, #a855f7, #3b82f6, #22d3ee)' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <div className="p-6">
                {/* Header */}
                <motion.div className="flex items-start justify-between mb-5"
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <motion.span className="text-2xl"
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}>🥽</motion.span>
                      <h2 className="text-2xl font-black"
                        style={{ background: 'linear-gradient(135deg, #fff, #a855f7, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Register Now
                      </h2>
                    </div>
                    <p className="text-gray-500 text-xs tracking-widest uppercase">AR/VR Hackathon 2026 · ZIBACAR</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-purple-400/60">{filled}/{fields.length} fields</span>
                      <div className="flex gap-1">
                        {fields.map((_, i) => (
                          <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                            animate={{ background: i < filled ? '#a855f7' : 'rgba(139,92,246,0.2)' }}
                            transition={{ duration: 0.3 }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <motion.button onClick={onClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white flex-shrink-0"
                    style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
                    whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>✕</motion.button>
                </motion.div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {fields.map((f, i) => (
                    <Field key={f.name} f={f} value={form[f.name]} onChange={handleChange} index={i} />
                  ))}

                  <AnimatePresence>
                    {status && !status.ok && (
                      <motion.div
                        className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs text-red-400"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      >⚠ {status.msg}</motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="relative w-full py-4 rounded-xl font-black text-white text-base overflow-hidden mt-1"
                    style={{ background: loading ? 'rgba(139,92,246,0.2)' : 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
                    whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 30px rgba(139,92,246,0.5)' } : {}}
                    whileTap={!loading ? { scale: 0.97 } : {}}
                  >
                    {!loading && (
                      <motion.span className="absolute inset-0"
                        style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)' }}
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.5 }} />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <motion.span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                            animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }} />
                          Launching...
                        </>
                      ) : (
                        <>
                          <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>🚀</motion.span>
                          Launch Registration
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
