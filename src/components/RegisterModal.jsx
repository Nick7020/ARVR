import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const fields = [
  { name: 'name',        label: 'Your Name',           type: 'text',  placeholder: 'John Doe' },
  { name: 'email',       label: 'Email Address',        type: 'email', placeholder: 'john@example.com' },
  { name: 'phone',       label: 'Phone Number',         type: 'tel',   placeholder: '+91 9876543210' },
  { name: 'branch',      label: 'Branch',               type: 'text',  placeholder: 'MCA / B.Tech CSE ...' },
  { name: 'collegeName', label: 'College Name',         type: 'text',  placeholder: 'Your college name' },
  { name: 'teamName',    label: 'Team Name',            type: 'text',  placeholder: 'Team Nexus' },
  { name: 'teamMembers', label: 'Team Members (comma separated)', type: 'textarea', placeholder: 'Alice, Bob, Charlie' },
];

export default function RegisterModal({ onClose }) {
  const [form, setForm]     = useState({ name:'', email:'', phone:'', branch:'', collegeName:'', teamName:'', teamMembers:'' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState(null); // { ok, msg }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res  = await fetch(`${API}/api/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      setStatus({ ok: data.success, msg: data.message });
      if (data.success) setForm({ name:'', email:'', phone:'', branch:'', collegeName:'', teamName:'', teamMembers:'' });
    } catch {
      setStatus({ ok: false, msg: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

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
          style={{ background: 'rgba(2,0,16,0.85)', backdropFilter: 'blur(12px)' }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(15,5,40,0.98), rgba(5,0,20,0.98))',
            border: '1px solid rgba(139,92,246,0.35)',
            boxShadow: '0 0 60px rgba(139,92,246,0.25), 0 0 120px rgba(59,130,246,0.1)',
          }}
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 40 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          {/* Top glow bar */}
          <div className="h-1 w-full rounded-t-3xl" style={{ background: 'linear-gradient(90deg, #a855f7, #3b82f6, #22d3ee)' }} />

          <div className="p-7">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black gradient-text">Register Now</h2>
                <p className="text-gray-400 text-sm mt-1">AR/VR Hackathon 2026 · ZIBACAR</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
              >
                ✕
              </button>
            </div>

            {/* Success state */}
            {status?.ok ? (
              <motion.div
                className="text-center py-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  🚀
                </motion.div>
                <h3 className="text-xl font-black gradient-text mb-2">You're Registered!</h3>
                <p className="text-gray-400 text-sm">{status.msg}</p>
                <motion.button
                  onClick={onClose}
                  className="mt-6 px-8 py-3 rounded-xl font-bold text-white text-sm"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {fields.map((f, i) => (
                  <motion.div
                    key={f.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <label className="block text-xs font-semibold text-purple-300/80 tracking-widest uppercase mb-1.5">
                      {f.label}
                    </label>
                    {f.type === 'textarea' ? (
                      <textarea
                        name={f.name}
                        value={form[f.name]}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        rows={3}
                        required
                        className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none resize-none transition-all duration-300"
                        style={{
                          background: 'rgba(139,92,246,0.06)',
                          border: '1px solid rgba(139,92,246,0.2)',
                        }}
                        onFocus={e => e.target.style.border = '1px solid rgba(139,92,246,0.7)'}
                        onBlur={e => e.target.style.border = '1px solid rgba(139,92,246,0.2)'}
                      />
                    ) : (
                      <input
                        type={f.type}
                        name={f.name}
                        value={form[f.name]}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        required
                        className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300"
                        style={{
                          background: 'rgba(139,92,246,0.06)',
                          border: '1px solid rgba(139,92,246,0.2)',
                        }}
                        onFocus={e => e.target.style.border = '1px solid rgba(139,92,246,0.7)'}
                        onBlur={e => e.target.style.border = '1px solid rgba(139,92,246,0.2)'}
                      />
                    )}
                  </motion.div>
                ))}

                {/* Error message */}
                {status && !status.ok && (
                  <motion.p
                    className="text-red-400 text-xs text-center py-2 px-4 rounded-xl"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    ⚠ {status.msg}
                  </motion.p>
                )}

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-4 rounded-xl font-black text-white text-base overflow-hidden mt-2"
                  style={{ background: loading ? 'rgba(139,92,246,0.3)' : 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        className="w-4 h-4 rounded-full border-2 border-white border-t-transparent inline-block"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      ⬡ Submit Registration
                    </span>
                  )}
                  {!loading && (
                    <motion.span
                      className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100"
                      style={{ boxShadow: '0 0 25px rgba(139,92,246,0.6)' }}
                    />
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
