import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconUser, IconMail, IconPhone, IconCertificate, IconSchool, IconBolt, IconUsers, IconChevronRight, IconChevronLeft, IconRocket } from '@tabler/icons-react';
import HackathonTicket from './HackathonTicket';

const API = import.meta.env.VITE_API_URL || 'https://arvr-drab.vercel.app';

const step1Fields = [
  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Commander Shepard', icon: <IconUser size={18} /> },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'shepard@normandy.com', icon: <IconMail size={18} /> },
  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 9876543210', icon: <IconPhone size={18} /> },
];

const step2Fields = [
  { name: 'branch', label: 'Branch / Specialization', type: 'text', placeholder: 'B.Tech CSE / MCA', icon: <IconCertificate size={18} /> },
  { name: 'collegeName', label: 'Academy Name', type: 'text', placeholder: 'Your College', icon: <IconSchool size={18} /> },
];

function loadRazorpay() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Field({ f, value, onChange, index }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.4 }} className="relative mb-5">
      <motion.div className="absolute inset-0 rounded-xl" animate={{ background: focused ? 'rgba(0, 240, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)' }} transition={{ duration: 0.3 }} />
      <motion.div className="absolute inset-0 rounded-xl pointer-events-none" style={{ border: '1px solid rgba(0, 240, 255, 0.1)' }} animate={{ borderColor: focused ? 'rgba(0, 240, 255, 0.6)' : 'rgba(0, 240, 255, 0.1)', boxShadow: focused ? '0 0 15px rgba(0, 240, 255, 0.15)' : 'none' }} transition={{ duration: 0.2 }} />
      
      <motion.label
        className="absolute left-10 font-bold tracking-widest uppercase pointer-events-none z-10 px-1"
        style={{ background: 'rgba(9, 2, 28, 1)' }}
        animate={{ top: focused || hasValue ? -8 : '50%', fontSize: focused || hasValue ? 10 : 13, color: focused ? '#00f0ff' : hasValue ? '#a855f7' : '#6b7280', y: focused || hasValue ? 0 : '-50%' }}
        transition={{ duration: 0.2 }}
      >
        {f.label}
      </motion.label>
      
      <motion.span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" animate={{ color: focused ? '#00f0ff' : '#6b7280' }}>
        {f.icon}
      </motion.span>
      
      <input type={f.type} name={f.name} value={value} onChange={onChange} required onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} className="w-full rounded-xl pl-10 pr-8 py-3.5 text-sm text-cyan-50 placeholder-transparent outline-none bg-transparent" placeholder={f.placeholder} />
    </motion.div>
  );
}

function RocketLaunch({ onDone }) {
  const [phase, setPhase] = useState('countdown');
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('ignite'), 2200),
      setTimeout(() => setPhase('launch'), 3400),
      setTimeout(() => setPhase('space'), 5200),
      setTimeout(() => setPhase('success'), 7000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden" style={{ background: 'radial-gradient(ellipse at center, #0d0025 0%, #020010 100%)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <AnimatePresence>
        {phase === 'countdown' && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center z-10" exit={{ opacity: 0, scale: 2 }}>
            {[3, 2, 1].map((n, i) => (
              <motion.div key={n} className="absolute text-8xl font-black text-cyan-400" initial={{ opacity: 0, scale: 3 }} animate={{ opacity: [0, 1, 1, 0], scale: [3, 1, 1, 0.5] }} transition={{ duration: 0.7, delay: i * 0.72 }}>{n}</motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {(phase === 'ignite' || phase === 'launch') && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-end pb-32" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div animate={phase === 'launch' ? { y: -1000, opacity: 0 } : {}} transition={{ duration: 1.5, ease: 'easeIn' }}>
              <div className="text-8xl filter drop-shadow-[0_0_20px_#a855f7]">🚀</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {phase === 'success' && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-6 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">ACCESS GRANTED</h2>
            <button onClick={onDone} className="px-10 py-4 rounded-xl font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-400/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all">Enter Protocol System</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function RegisterModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:'', email:'', phone:'', branch:'', collegeName:'', teamName:'' });
  const [teamSize, setTeamSize] = useState(1);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [launched, setLaunched] = useState(false);
  const [showTicket, setShowTicket] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleMemberChange = (index, value) => {
    const updated = [...teamMembers];
    updated[index] = value;
    setTeamMembers(updated);
  };

  const nextStep = () => {
    if (step === 1 && (!form.name || !form.email || !form.phone)) return setStatus({ ok: false, msg: 'Complete commander details to proceed.' });
    if (step === 2 && (!form.branch || !form.collegeName)) return setStatus({ ok: false, msg: 'Complete academic intel to proceed.' });
    setStatus(null);
    setStep(s => s + 1);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.teamName) return setStatus({ ok: false, msg: 'Assign a squad name.' });
    if (teamSize > 1 && teamMembers.some(m => !m.trim())) return setStatus({ ok: false, msg: 'Provide all team member names.' });
    
    setLoading(true);
    setStatus(null);

    const isLoaded = await loadRazorpay();
    if (!isLoaded) return setStatus({ ok: false, msg: 'Checkout system offline.' }), setLoading(false);

    try {
      const orderRes = await fetch(`${API}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamSize }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        setStatus({ ok: false, msg: orderData.message || 'Payment link failed.' });
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key',
        amount: orderData.order.amount,
        currency: 'INR',
        name: 'AR/VR Hackathon 2026',
        description: 'Registration Fee',
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            const registerRes = await fetch(`${API}/api/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...form, teamSize, teamMembers, razorpayPaymentId: response.razorpay_payment_id, razorpayOrderId: response.razorpay_order_id, razorpaySignature: response.razorpay_signature }),
            });
            const data = await registerRes.json();
            if (data.success) {
              setLaunched(true);
            } else {
              setStatus({ ok: false, msg: data.message });
            }
          } catch(err) {
            setStatus({ ok: false, msg: 'Network failure upon verification.' });
          }
          setLoading(false);
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#00f0ff' }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function () {
        setStatus({ ok: false, msg: 'Payment failed. Use GPay or PhonePe.' });
        setLoading(false);
      });
      paymentObject.open();
    } catch (err) {
      setStatus({ ok: false, msg: 'Server unreachable.' });
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>{launched && <RocketLaunch onDone={() => { setLaunched(false); setShowTicket(true); }} />}</AnimatePresence>
      <AnimatePresence>{showTicket && <HackathonTicket form={form} onClose={onClose} />}</AnimatePresence>

      <AnimatePresence>
        {!launched && !showTicket && (
          <motion.div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0" onClick={onClose} />
            <motion.div
              className="relative w-full max-w-md overflow-hidden rounded-[2rem] z-10"
              style={{ background: 'rgba(9, 2, 28, 0.95)', border: '1px solid rgba(0, 240, 255, 0.2)', boxShadow: '0 0 50px rgba(0, 240, 255, 0.1), inset 0 0 20px rgba(0, 240, 255, 0.05)' }}
              initial={{ scale: 0.9, y: 40, rotateX: 10 }} animate={{ scale: 1, y: 0, rotateX: 0 }} exit={{ scale: 0.9, y: 40, opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Stepper Header */}
              <div className="px-6 pt-6 pb-2 border-b border-cyan-500/10">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <IconRocket className="text-cyan-400" size={24} />
                    <h2 className="text-xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Initialize</h2>
                  </div>
                  <button onClick={onClose} className="text-cyan-600 hover:text-cyan-300 transition-colors"><div className="text-xl border border-cyan-600/30 rounded-full w-8 h-8 flex items-center justify-center pb-1">&times;</div></button>
                </div>
                
                <div className="flex justify-between relative mb-2">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-gray-800 z-0" />
                  <motion.div className="absolute top-1/2 -translate-y-1/2 left-0 h-0.5 bg-cyan-400 z-0 shadow-[0_0_8px_#00f0ff]" animate={{ width: `${((step - 1) / 2) * 100}%` }} transition={{ duration: 0.5 }} />
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${step >= i ? 'bg-cyan-950 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.4)]' : 'bg-gray-900 border border-gray-700 text-gray-500'}`}>
                      {i}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                  <span className={step >= 1 ? 'text-cyan-400' : ''}>Commander</span>
                  <span className={step >= 2 ? 'text-cyan-400 text-center' : ''}>Academic</span>
                  <span className={step >= 3 ? 'text-cyan-400 text-right' : ''}>Squad</span>
                </div>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div key={step} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} transition={{ duration: 0.3 }}>
                    
                    {step === 1 && (
                      <div className="space-y-2">
                        {step1Fields.map((f, i) => <Field key={f.name} f={f} value={form[f.name]} onChange={handleChange} index={i} />)}
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-2">
                        {step2Fields.map((f, i) => <Field key={f.name} f={f} value={form[f.name]} onChange={handleChange} index={i} />)}
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-2">
                        <Field f={{ name: 'teamName', label: 'Squad Designation', type: 'text', placeholder: 'Alpha Protocol', icon: <IconBolt size={18} /> }} value={form.teamName} onChange={handleChange} index={0} />
                        
                        <div className="relative mb-5" style={{ animationDelay: '0.1s' }}>
                          <label className="absolute -top-3 left-3 bg-[#09021c] px-2 text-[10px] font-bold text-purple-500 tracking-widest uppercase z-10">Squad Size</label>
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-purple-500"><IconUsers size={18} /></div>
                          <select
                            value={teamSize}
                            onChange={(e) => {
                              const size = parseInt(e.target.value);
                              setTeamSize(size);
                              setTeamMembers(new Array(size - 1).fill(''));
                            }}
                            className="w-full rounded-xl pl-10 pr-8 py-3.5 text-sm text-cyan-50 outline-none bg-transparent appearance-none border border-purple-500/30 hover:border-purple-400 focus:border-purple-400 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all cursor-pointer"
                          >
                            {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n} className="bg-gray-900 text-teal-50">{n} Member{n > 1 ? 's' : ''}</option>)}
                          </select>
                        </div>

                        {teamSize > 1 && teamMembers.map((member, i) => (
                          <Field key={`m-${i}`} f={{ name: `m${i}`, label: `Operative ${i + 2}`, type: 'text', placeholder: `Name of member ${i+2}`, icon: <IconUser size={18} /> }} value={member} onChange={(e) => handleMemberChange(i, e.target.value)} index={i+2} />
                        ))}

                        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-4 text-center">
                          <div className="text-xs uppercase tracking-widest text-cyan-500/70 font-black mb-1">Authorization Fee</div>
                          <div className="text-3xl font-black text-cyan-300">₹{teamSize > 1 ? 100 : 50}</div>
                        </div>
                        
                        <div className="text-[10px] text-center text-amber-500/80 uppercase font-bold tracking-wider mt-2 border border-amber-500/20 bg-amber-950/20 rounded-lg p-2">
                          Use GPay or PhonePe via Razorpay.<br/>FamPay is not authorized.
                        </div>
                      </div>
                    )}

                    {status && !status.ok && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs text-red-400 bg-red-950/40 border border-red-500/30 p-3 rounded-xl text-center font-bold tracking-wide mt-4">
                        ⚠️ {status.msg}
                      </motion.div>
                    )}

                  </motion.div>
                </AnimatePresence>

                <div className="flex gap-3 justify-between mt-6">
                  {step > 1 && (
                    <button onClick={() => setStep(s => s - 1)} className="px-5 py-3.5 rounded-xl border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white transition-all font-bold flex items-center justify-center cursor-pointer">
                      <IconChevronLeft size={20} />
                    </button>
                  )}
                  
                  {step < 3 ? (
                    <button onClick={nextStep} className="flex-1 py-3.5 rounded-xl font-black text-xs tracking-[0.2em] uppercase text-black bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-2">
                      Proceed <IconChevronRight size={18} />
                    </button>
                  ) : (
                    <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3.5 rounded-xl font-black text-xs tracking-[0.2em] uppercase text-white overflow-hidden relative" style={{ background: loading ? 'rgba(34,211,238,0.2)' : 'linear-gradient(135deg, #00f0ff, #7000ff)' }}>
                      <motion.span className="absolute inset-0 z-0" animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }} style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', backgroundSize: '200% 100%' }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? 'Processing Protocol...' : 'Launch Registration'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
