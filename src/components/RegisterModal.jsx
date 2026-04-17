import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconUser, IconMail, IconPhone, IconCertificate, IconSchool, IconBolt, IconUsers, IconChevronRight, IconChevronLeft, IconRocket, IconUpload, IconCheck } from '@tabler/icons-react';
import HackathonTicket from './HackathonTicket';

const API = import.meta.env.VITE_API_URL || 'https://arvrhackthon.vercel.app';

// ── UPI QR details ──
const UPI_ID   = 'vishwasvkenchi-1@okaxis'; // Replace with your UPI ID
const UPI_NAME = 'Game-o-thon 2K26';

const step1Fields = [
  { name: 'name',        label: 'Full Name',            type: 'text',  placeholder: 'John Doe',           icon: <IconUser size={18} /> },
  { name: 'email',       label: 'Email Address',        type: 'email', placeholder: 'john@example.com',   icon: <IconMail size={18} /> },
  { name: 'phone',       label: 'Phone Number',         type: 'tel',   placeholder: '+91 9876543210',     icon: <IconPhone size={18} /> },
];
const step2Fields = [
  { name: 'branch',      label: 'Branch',               type: 'text',  placeholder: 'MCA / B.Tech CSE',   icon: <IconCertificate size={18} /> },
  { name: 'collegeName', label: 'College Name',         type: 'text',  placeholder: 'Your College',       icon: <IconSchool size={18} /> },
];

function Field({ f, value, onChange, index }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  return (
    <motion.div initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ delay: index*0.08, duration:0.4 }} className="relative mb-5">
      <motion.div className="absolute inset-0 rounded-xl pointer-events-none" style={{ border:'1px solid rgba(0,240,255,0.1)' }}
        animate={{ borderColor: focused ? 'rgba(0,240,255,0.6)' : 'rgba(0,240,255,0.1)', boxShadow: focused ? '0 0 15px rgba(0,240,255,0.15)' : 'none' }} transition={{ duration:0.2 }} />
      <motion.label className="absolute left-10 font-bold tracking-widest uppercase pointer-events-none z-10 px-1"
        style={{ background:'rgba(9,2,28,1)' }}
        animate={{ top: focused||hasValue ? -8 : '50%', fontSize: focused||hasValue ? 10 : 13, color: focused ? '#00f0ff' : hasValue ? '#a855f7' : '#6b7280', y: focused||hasValue ? 0 : '-50%' }}
        transition={{ duration:0.2 }}>
        {f.label}
      </motion.label>
      <motion.span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" animate={{ color: focused ? '#00f0ff' : '#6b7280' }}>
        {f.icon}
      </motion.span>
      <input type={f.type} name={f.name} value={value} onChange={onChange} required
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="w-full rounded-xl pl-10 pr-8 py-3.5 text-sm text-cyan-50 placeholder-transparent outline-none bg-transparent relative z-10"
        placeholder={f.placeholder} style={{ position:'relative', zIndex:10 }} />
    </motion.div>
  );
}

export default function RegisterModal({ onClose }) {
  const [step, setStep]             = useState(1);
  const [form, setForm]             = useState({ name:'', email:'', phone:'', branch:'', collegeName:'', teamName:'' });
  const [teamSize, setTeamSize]     = useState(1);
  const [teamMembers, setTeamMembers] = useState([]);
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [status, setStatus]         = useState(null);
  const [showTicket, setShowTicket] = useState(false);
  const fileRef = useRef(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleMemberChange = (i, val) => { const u = [...teamMembers]; u[i] = val; setTeamMembers(u); };

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setStatus({ ok:false, msg:'Screenshot must be under 5MB.' }); return; }
    const reader = new FileReader();
    reader.onload = ev => { setScreenshot(ev.target.result); setScreenshotPreview(ev.target.result); setStatus(null); };
    reader.readAsDataURL(file);
  };

  const nextStep = () => {
    if (step === 1 && (!form.name || !form.email || !form.phone)) return setStatus({ ok:false, msg:'Fill all personal details.' });
    if (step === 2 && (!form.branch || !form.collegeName)) return setStatus({ ok:false, msg:'Fill all academic details.' });
    if (step === 3 && (!form.teamName || (teamSize > 1 && teamMembers.some(m => !m?.trim())))) return setStatus({ ok:false, msg:'Fill team details.' });
    if (step === 4 && !screenshot) return setStatus({ ok:false, msg:'Upload payment screenshot.' });
    setStatus(null);
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (!screenshot) return setStatus({ ok:false, msg:'Upload payment screenshot first.' });
    setLoading(true);
    setStatus(null);
    try {
      const res  = await fetch(`${API}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, teamSize, teamMembers, paymentScreenshot: screenshot }),
      });
      const data = await res.json();
      if (data.success) {
        setShowTicket(true);
      } else {
        setStatus({ ok:false, msg: data.message });
      }
    } catch {
      setStatus({ ok:false, msg:'Server unreachable. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const fee = teamSize === 1 ? 50 : 150;
  const steps = ['Personal', 'Academic', 'Team', 'Payment', 'Submit'];

  if (showTicket) return <HackathonTicket form={{ ...form, teamMembers }} onClose={onClose} pending />;

  return (
    <motion.div className="fixed inset-0 z-[9990] flex items-center justify-center p-4"
      style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(12px)' }}
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-[2rem] z-[9991]"
        style={{ background:'rgba(9,2,28,0.97)', border:'1px solid rgba(0,240,255,0.2)', boxShadow:'0 0 50px rgba(0,240,255,0.1)' }}
        initial={{ scale:0.9, y:40 }} animate={{ scale:1, y:0 }} exit={{ scale:0.9, y:40, opacity:0 }}
        transition={{ type:'spring', damping:25, stiffness:200 }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 pt-6 pb-3 border-b border-cyan-500/10">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <IconRocket className="text-cyan-400" size={22} />
              <h2 className="text-lg font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Register</h2>
            </div>
            <button onClick={onClose} className="text-cyan-600 hover:text-cyan-300 transition-colors">
              <div className="text-xl border border-cyan-600/30 rounded-full w-8 h-8 flex items-center justify-center">&times;</div>
            </button>
          </div>

          {/* Step indicators */}
          <div className="flex justify-between relative mb-1">
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-gray-800 z-0" />
            <motion.div className="absolute top-1/2 -translate-y-1/2 left-0 h-0.5 bg-cyan-400 z-0 shadow-[0_0_8px_#00f0ff]"
              animate={{ width:`${((step-1)/4)*100}%` }} transition={{ duration:0.5 }} />
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${step > i ? 'bg-cyan-400 text-black' : step === i ? 'bg-cyan-950 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.4)]' : 'bg-gray-900 border border-gray-700 text-gray-500'}`}>
                {step > i ? <IconCheck size={12} /> : i}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[9px] uppercase font-bold text-gray-600 tracking-wider mt-1">
            {steps.map((s,i) => <span key={s} className={step >= i+1 ? 'text-cyan-500' : ''}>{s}</span>)}
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ x:40, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:-40, opacity:0 }} transition={{ duration:0.25 }}>

              {/* Step 1 — Personal */}
              {step === 1 && (
                <div>
                  <p className="text-cyan-400/60 text-xs uppercase tracking-widest mb-4">Personal Details</p>
                  {step1Fields.map((f,i) => <Field key={f.name} f={f} value={form[f.name]} onChange={handleChange} index={i} />)}
                </div>
              )}

              {/* Step 2 — Academic */}
              {step === 2 && (
                <div>
                  <p className="text-cyan-400/60 text-xs uppercase tracking-widest mb-4">Academic Details</p>
                  {step2Fields.map((f,i) => <Field key={f.name} f={f} value={form[f.name]} onChange={handleChange} index={i} />)}
                </div>
              )}

              {/* Step 3 — Team */}
              {step === 3 && (
                <div>
                  <p className="text-cyan-400/60 text-xs uppercase tracking-widest mb-4">Team Details</p>
                  <Field f={{ name:'teamName', label:'Team Name', type:'text', placeholder:'Team Alpha', icon:<IconBolt size={18}/> }} value={form.teamName} onChange={handleChange} index={0} />
                  <div className="relative mb-5">
                    <label className="absolute -top-3 left-3 bg-[#09021c] px-2 text-[10px] font-bold text-purple-500 tracking-widest uppercase z-10">Team Size</label>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-purple-500"><IconUsers size={18}/></div>
                    <select value={teamSize} onChange={e => { const s=parseInt(e.target.value); setTeamSize(s); setTeamMembers(new Array(s-1).fill('')); }}
                      className="w-full rounded-xl pl-10 pr-8 py-3.5 text-sm text-cyan-50 outline-none bg-transparent appearance-none border border-purple-500/30 focus:border-purple-400 transition-all cursor-pointer">
                      {[1,2,3,4].map(n => <option key={n} value={n} className="bg-gray-900">{n} Member{n>1?'s':''}</option>)}
                    </select>
                  </div>
                  {teamSize > 1 && teamMembers.map((m,i) => (
                    <Field key={i} f={{ name:`m${i}`, label:`Member ${i+2} Name`, type:'text', placeholder:`Name of member ${i+2}`, icon:<IconUser size={18}/> }}
                      value={m} onChange={e => handleMemberChange(i, e.target.value)} index={i+1} />
                  ))}
                </div>
              )}

              {/* Step 4 — Payment QR */}
              {step === 4 && (
                <div>
                  <p className="text-cyan-400/60 text-xs uppercase tracking-widest mb-4">Payment</p>

                  {/* Fee */}
                  <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 text-center mb-4">
                    <p className="text-xs uppercase tracking-widest text-cyan-500/70 font-black mb-1">Registration Fee</p>
                    <p className="text-3xl font-black text-cyan-300">₹{fee}</p>
                    <p className="text-gray-500 text-xs mt-1">{teamSize} member{teamSize>1?'s':''}</p>
                  </div>

                  {/* QR Code */}
                  <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 text-center mb-4">
                    <p className="text-xs uppercase tracking-widest text-purple-400/70 font-bold mb-3">Scan & Pay</p>
                    {/* QR placeholder — replace src with your actual QR image */}
                    <div className="w-40 h-40 mx-auto rounded-xl bg-white flex items-center justify-center mb-3 overflow-hidden">
                      <img src="/qr.png" alt="UPI QR" className="w-full h-full object-contain"
                        onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                      <div className="w-full h-full hidden items-center justify-center flex-col gap-1">
                        <p className="text-black text-xs font-bold text-center px-2">Add QR image as /public/qr.png</p>
                      </div>
                    </div>
                    <p className="text-purple-300 text-xs font-bold">{UPI_ID}</p>
                    <p className="text-gray-500 text-[10px] mt-1">Pay ₹{fee} to above UPI ID</p>
                  </div>

                  {/* Screenshot upload */}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-amber-400/70 font-bold mb-2">Upload Payment Screenshot</p>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                    {screenshotPreview ? (
                      <div className="relative rounded-xl overflow-hidden border border-green-500/40 mb-2">
                        <img src={screenshotPreview} alt="Payment SS" className="w-full max-h-48 object-contain bg-black" />
                        <button onClick={() => { setScreenshot(null); setScreenshotPreview(null); }}
                          className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
                        <div className="absolute bottom-2 left-2 bg-green-500/80 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                          <IconCheck size={10} /> Uploaded
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => fileRef.current.click()}
                        className="w-full py-8 rounded-xl border-2 border-dashed border-purple-500/30 hover:border-purple-400 transition-all flex flex-col items-center gap-2 text-gray-400 hover:text-purple-300">
                        <IconUpload size={24} />
                        <span className="text-xs font-bold uppercase tracking-widest">Click to upload screenshot</span>
                        <span className="text-[10px] text-gray-600">JPG, PNG — Max 5MB</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5 — Review & Submit */}
              {step === 5 && (
                <div>
                  <p className="text-cyan-400/60 text-xs uppercase tracking-widest mb-4">Review & Submit</p>
                  <div className="space-y-2 mb-4">
                    {[
                      ['Name', form.name], ['Email', form.email], ['Phone', form.phone],
                      ['Branch', form.branch], ['College', form.collegeName],
                      ['Team', form.teamName], ['Members', teamSize === 1 ? form.name : [form.name, ...teamMembers].join(', ')],
                      ['Fee Paid', `₹${fee}`],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-gray-500 text-xs uppercase tracking-wider">{label}</span>
                        <span className="text-cyan-100 text-xs font-semibold text-right max-w-[60%] truncate">{value}</span>
                      </div>
                    ))}
                  </div>
                  {screenshotPreview && (
                    <div className="rounded-xl overflow-hidden border border-purple-500/20 mb-4">
                      <p className="text-xs text-purple-400/60 uppercase tracking-widest p-2 bg-purple-950/20">Payment Screenshot</p>
                      <img src={screenshotPreview} alt="SS" className="w-full max-h-32 object-contain bg-black" />
                    </div>
                  )}
                  <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-400/80 text-center">
                    ⏳ Your registration will be reviewed by admin. You'll receive an email once approved.
                  </div>
                </div>
              )}

              {/* Error */}
              {status && !status.ok && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                  className="text-xs text-red-400 bg-red-950/40 border border-red-500/30 p-3 rounded-xl text-center font-bold mt-3">
                  ⚠️ {status.msg}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button onClick={() => { setStep(s=>s-1); setStatus(null); }}
                className="px-4 py-3.5 rounded-xl border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white transition-all font-bold flex items-center">
                <IconChevronLeft size={20} />
              </button>
            )}
            {step < 5 ? (
              <button onClick={nextStep}
                className="flex-1 py-3.5 rounded-xl font-black text-xs tracking-[0.2em] uppercase text-black bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center justify-center gap-2">
                Next <IconChevronRight size={18} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 py-3.5 rounded-xl font-black text-xs tracking-[0.2em] uppercase text-white relative overflow-hidden"
                style={{ background: loading ? 'rgba(34,211,238,0.2)' : 'linear-gradient(135deg,#00f0ff,#7000ff)' }}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <><motion.span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                      animate={{ rotate:360 }} transition={{ duration:0.7, repeat:Infinity, ease:'linear' }} />Submitting...</>
                  ) : '🚀 Submit Registration'}
                </span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

