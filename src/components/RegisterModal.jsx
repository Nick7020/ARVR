import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

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

/* ── Animated input field ── */
function Field({ f, value, onChange, index }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30, filter: 'blur(4px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative group"
    >
      {/* Glow border on focus */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: focused
            ? '0 0 0 1px rgba(139,92,246,0.8), 0 0 20px rgba(139,92,246,0.3), 0 0 40px rgba(139,92,246,0.1)'
            : '0 0 0 1px rgba(139,92,246,0.15)',
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Label */}
      <motion.label
        className="absolute left-10 font-semibold text-xs tracking-widest uppercase pointer-events-none z-10"
        animate={{
          top:      focused || hasValue ? -8  : '50%',
          fontSize: focused || hasValue ? 9   : 12,
          color:    focused ? '#a855f7' : hasValue ? '#7c3aed' : 'rgba(139,92,246,0.5)',
          y:        focused || hasValue ? 0   : '-50%',
          backgroundColor: focused || hasValue ? 'rgba(10,0,30,1)' : 'transparent',
          paddingLeft:  focused || hasValue ? 4 : 0,
          paddingRight: focused || hasValue ? 4 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {f.label}
      </motion.label>

      {/* Icon */}
      <motion.span
        className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none"
        animate={{ scale: focused ? 1.2 : 1, rotate: focused ? 10 : 0 }}
        transition={{ type: 'spring', stiffness: 400 }}
        style={{ top: f.type === 'textarea' ? 18 : '50%' }}
      >
        {f.icon}
      </motion.span>

      {f.type === 'textarea' ? (
        <textarea
          name={f.name}
          value={value}
          onChange={onChange}
          rows={3}
          required
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-xl pl-10 pr-4 pt-4 pb-3 text-sm text-white placeholder-transparent outline-none resize-none"
          style={{ background: 'rgba(139,92,246,0.06)' }}
          placeholder={f.placeholder}
        />
      ) : (
        <input
          type={f.type}
          name={f.name}
          value={value}
          onChange={onChange}
          required
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-transparent outline-none"
          style={{ background: 'rgba(139,92,246,0.06)' }}
          placeholder={f.placeholder}
        />
      )}

      {/* Completion checkmark */}
      <AnimatePresence>
        {hasValue && !focused && (
          <motion.span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 text-xs"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            ✓
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Success screen ── */
function SuccessScreen({ msg, onClose }) {
  return (
    <motion.div
      className="text-center py-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Burst particles */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle  = (i / 30) * 360;
        const radius = 80 + Math.random() * 80;
        const color  = ['#a855f7','#3b82f6','#22d3ee','#ec4899','#f59e0b','#10b981'][i % 6];
        return (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width:  Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              background: color,
              left: '50%', top: '30%',
              boxShadow: `0 0 6px ${color}`,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * radius,
              y: Math.sin((angle * Math.PI) / 180) * radius,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 1.2, delay: i * 0.02, ease: 'easeOut' }}
          />
        );
      })}

      {/* Pulsing rings */}
      {[80, 110, 140].map((size, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border pointer-events-none"
          style={{
            width: size, height: size,
            borderColor: 'rgba(34,211,238,0.4)',
            left: '50%', top: '28%',
            translateX: '-50%', translateY: '-50%',
          }}
          animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      {/* Rocket */}
      <motion.div
        className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-5"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(34,211,238,0.2))',
          border: '2px solid rgba(34,211,238,0.6)',
          boxShadow: '0 0 30px rgba(34,211,238,0.5), 0 0 60px rgba(139,92,246,0.3)',
        }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.1 }}
      >
        🚀
      </motion.div>

      {/* Heading */}
      <motion.h3
        className="text-3xl font-black mb-2"
        style={{ background: 'linear-gradient(135deg, #fff, #a855f7, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 10px rgba(139,92,246,0.5))' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        You're In! 🎉
      </motion.h3>

      <motion.p className="text-gray-400 text-sm mb-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {msg}
      </motion.p>
      <motion.p className="text-purple-400/50 text-xs mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        AR/VR Hackathon 2026 · ZIBACAR
      </motion.p>

      {/* Animated divider */}
      <motion.div className="h-px mx-auto mb-6"
        style={{ background: 'linear-gradient(90deg, transparent, #a855f7, #22d3ee, transparent)', width: '70%' }}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.8 }}
      />

      <motion.button
        onClick={onClose}
        className="relative px-10 py-3 rounded-xl font-bold text-white text-sm overflow-hidden group"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <motion.span
          className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)' }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}
        />
        <span className="relative z-10">Close ✕</span>
      </motion.button>
    </motion.div>
  );
}

/* ── Main Modal ── */
export default function RegisterModal({ onClose }) {
  const [form, setForm]       = useState({ name:'', email:'', phone:'', branch:'', collegeName:'', teamName:'', teamMembers:'' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState(null);
  const [step, setStep]       = useState(0); // 0=form, 1=success

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
        setStep(1);
        setStatus({ ok: true, msg: data.message });
      } else {
        setStatus({ ok: false, msg: data.message });
      }
    } catch {
      setStatus({ ok: false, msg: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  /* progress */
  const filled  = Object.values(form).filter(v => v.trim()).length;
  const progress = Math.round((filled / fields.length) * 100);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9990] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0"
          style={{ background: 'rgba(2,0,16,0.9)', backdropFilter: 'blur(16px)' }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl z-10"
          style={{
            background: 'linear-gradient(145deg, rgba(15,5,45,0.99), rgba(5,0,25,0.99))',
            border: '1px solid rgba(139,92,246,0.3)',
            boxShadow: '0 0 80px rgba(139,92,246,0.2), 0 0 160px rgba(59,130,246,0.08)',
          }}
          initial={{ opacity: 0, scale: 0.8, y: 60, rotateX: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 60 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        >
          {/* Animated top bar */}
          <div className="relative h-1 w-full rounded-t-3xl overflow-hidden">
            <div className="absolute inset-0" style={{ background: 'rgba(139,92,246,0.2)' }} />
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #a855f7, #3b82f6, #22d3ee)' }}
              animate={{ width: step === 1 ? '100%' : `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Floating corner glows */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(20px)' }} />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)', filter: 'blur(16px)' }} />

          <div className="p-6">
            {/* Header */}
            {step === 0 && (
              <motion.div className="flex items-start justify-between mb-5"
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <motion.span
                      className="text-2xl"
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >🥽</motion.span>
                    <h2 className="text-2xl font-black"
                      style={{ background: 'linear-gradient(135deg, #fff, #a855f7, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      Register Now
                    </h2>
                  </div>
                  <p className="text-gray-500 text-xs tracking-widest uppercase">AR/VR Hackathon 2026 · ZIBACAR</p>
                  {/* Progress text */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="text-xs text-purple-400/60">{filled}/{fields.length} fields filled</div>
                    <div className="flex gap-1">
                      {fields.map((_, i) => (
                        <motion.div key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          animate={{ background: i < filled ? '#a855f7' : 'rgba(139,92,246,0.2)' }}
                          transition={{ duration: 0.3 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white flex-shrink-0"
                  style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >✕</motion.button>
              </motion.div>
            )}

            {/* Success */}
            {step === 1 ? (
              <SuccessScreen msg={status?.msg} onClose={onClose} />
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {fields.map((f, i) => (
                  <Field key={f.name} f={f} value={form[f.name]} onChange={handleChange} index={i} />
                ))}

                {/* Error */}
                <AnimatePresence>
                  {status && !status.ok && (
                    <motion.div
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs text-red-400"
                      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <span>⚠</span> {status.msg}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-4 rounded-xl font-black text-white text-base overflow-hidden mt-1"
                  style={{ background: loading ? 'rgba(139,92,246,0.2)' : 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
                  whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 30px rgba(139,92,246,0.5)' } : {}}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                >
                  {/* Shimmer */}
                  {!loading && (
                    <motion.span
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)' }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.5 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <motion.span
                          className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                        />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <motion.span animate={{ rotate: [0,360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>⬡</motion.span>
                        Submit Registration
                      </>
                    )}
                  </span>
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
