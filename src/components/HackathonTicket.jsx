import { useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function HackathonTicket({ form, onClose, pending = false }) {
  const ticketRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded]   = useState(false);

  const ticketId = useMemo(() =>
    `GOT-2K26-${Math.random().toString(36).substring(2,7).toUpperCase()}`, []);

  const members = Array.isArray(form.teamMembers)
    ? form.teamMembers.filter(Boolean)
    : (form.teamMembers || '').split(',').map(m => m.trim()).filter(Boolean);

  const allMembers = [form.name, ...members.filter(m => m !== form.name)];

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const el     = ticketRef.current;
      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#06001a',
        logging: false,
      });
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      pdf.addImage(img, 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`GameOThon_2K26_${form.teamName.replace(/\s+/g,'_')}_Pass.pdf`);
      setDownloaded(true);
    } catch(e) { console.error(e); }
    finally { setDownloading(false); }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-start overflow-y-auto py-6 px-3"
      style={{ background: 'rgba(2,0,16,0.97)', backdropFilter: 'blur(20px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Stars */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white pointer-events-none"
          style={{ width: Math.random()*1.5+0.5, height: Math.random()*1.5+0.5, left:`${Math.random()*100}%`, top:`${Math.random()*100}%` }}
          animate={{ opacity:[0.1,0.6,0.1] }} transition={{ duration:2+Math.random()*2, repeat:Infinity, delay:Math.random()*2 }} />
      ))}

      <motion.p className="text-purple-400/60 text-xs tracking-[0.3em] uppercase mb-4 z-10 text-center"
        initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        {pending ? '⏳ Submitted — Pending Admin Approval' : '🎟 Your Entry Pass is Ready!'}
      </motion.p>

      {/* ══ TICKET CARD ══ */}
      <motion.div
        ref={ticketRef}
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'linear-gradient(160deg, #06001a 0%, #0a0030 50%, #04000f 100%)',
          borderRadius: 20,
          overflow: 'hidden',
          fontFamily: 'Arial, sans-serif',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 0 60px rgba(139,92,246,0.4)',
        }}
        initial={{ opacity:0, scale:0.9, y:30 }}
        animate={{ opacity:1, scale:1, y:0 }}
        transition={{ type:'spring', stiffness:200, damping:20 }}
      >
        {/* Top gradient bar */}
        <div style={{ height: 6, background: 'linear-gradient(90deg,#a855f7,#3b82f6,#22d3ee,#a855f7)' }} />

        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.06,
          backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,1) 1px,transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Glow orbs */}
        <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.25) 0%,transparent 70%)', filter:'blur(20px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-40, left:-40, width:150, height:150, borderRadius:'50%', background:'radial-gradient(circle,rgba(34,211,238,0.15) 0%,transparent 70%)', filter:'blur(16px)', pointerEvents:'none' }} />

        <div style={{ padding: '20px 22px', position: 'relative' }}>

          {/* ── HEADER ── */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16, paddingBottom:14, borderBottom:'1px solid rgba(139,92,246,0.2)' }}>
            <img src="/logo.webp" alt="logo" style={{ width:48, height:48, borderRadius:'50%', border:'2px solid rgba(139,92,246,0.7)', boxShadow:'0 0 14px rgba(139,92,246,0.6)', flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <p style={{ color:'rgba(139,92,246,0.6)', fontSize:8, letterSpacing:'2px', textTransform:'uppercase', margin:'0 0 1px' }}>Zeal Education Society's</p>
              <p style={{ color:'#fff', fontSize:11, fontWeight:800, margin:'0 0 1px' }}>ZIBACAR · Game-o-thon 2K26</p>
              <p style={{ color:'rgba(255,255,255,0.55)', fontSize:8, margin:0 }}>Zeal Institute of Business Administration, Computer Application and Research</p>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <p style={{ color:'rgba(34,211,238,0.5)', fontSize:7, letterSpacing:'1px', margin:'0 0 2px' }}>TICKET ID</p>
              <p style={{ color:'#22d3ee', fontSize:10, fontWeight:900, margin:0, letterSpacing:'1px' }}>{ticketId}</p>
            </div>
          </div>

          {/* ── EVENT TITLE ── */}
          <div style={{ marginBottom:16, paddingBottom:14, borderBottom:'1px solid rgba(139,92,246,0.15)' }}>
            <p style={{ color:'rgba(139,92,246,0.5)', fontSize:8, letterSpacing:'3px', textTransform:'uppercase', margin:'0 0 4px' }}>OFFICIAL ENTRY PASS</p>
            <h1 style={{ color:'#ffffff', fontSize:26, fontWeight:900, margin:'0 0 3px', lineHeight:1, textShadow:'0 0 20px rgba(255,255,255,0.3)' }}>GAME-O-THON 2K26</h1>
            <p style={{ color:'#22d3ee', fontSize:10, margin:0, letterSpacing:'3px', textTransform:'uppercase' }}>Build The Game · Break The Limit</p>
          </div>

          {/* ── MAIN BODY: left details + right QR ── */}
          <div style={{ display:'flex', gap:16, marginBottom:14 }}>

            {/* Left: participant details */}
            <div style={{ flex:1 }}>
              {/* Name */}
              <div style={{ marginBottom:12 }}>
                <p style={{ color:'rgba(139,92,246,0.5)', fontSize:8, letterSpacing:'2px', textTransform:'uppercase', margin:'0 0 2px' }}>PARTICIPANT</p>
                <p style={{ color:'#ffffff', fontSize:18, fontWeight:900, margin:0, textShadow:'0 0 10px rgba(255,255,255,0.2)' }}>{form.name}</p>
              </div>

              {/* Info rows */}
              {[
                ['EMAIL',   form.email],
                ['PHONE',   form.phone],
                ['BRANCH',  form.branch],
                ['COLLEGE', form.collegeName],
              ].map(([label, value]) => (
                <div key={label} style={{ marginBottom:7 }}>
                  <p style={{ color:'rgba(139,92,246,0.45)', fontSize:7, letterSpacing:'1.5px', textTransform:'uppercase', margin:'0 0 1px' }}>{label}</p>
                  <p style={{ color:'#e2e8f0', fontSize:10, fontWeight:600, margin:0, wordBreak:'break-all' }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Right: QR placeholder + team */}
            <div style={{ width:130, flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
              {/* QR placeholder box */}
              <div style={{ width:110, height:110, background:'rgba(255,255,255,0.05)', border:'1.5px dashed rgba(139,92,246,0.4)', borderRadius:10, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4 }}>
                <p style={{ color:'rgba(139,92,246,0.4)', fontSize:8, textAlign:'center', margin:0, letterSpacing:'1px' }}>QR CODE</p>
                <p style={{ color:'rgba(34,211,238,0.4)', fontSize:7, textAlign:'center', margin:0 }}>Sent via Email</p>
                <p style={{ color:'rgba(255,255,255,0.2)', fontSize:18, margin:0 }}>📧</p>
              </div>

              {/* Team box */}
              <div style={{ width:'100%', background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.3)', borderRadius:8, padding:'8px 10px', textAlign:'center' }}>
                <p style={{ color:'rgba(139,92,246,0.5)', fontSize:7, letterSpacing:'1.5px', textTransform:'uppercase', margin:'0 0 3px' }}>TEAM</p>
                <p style={{ color:'#a855f7', fontSize:12, fontWeight:900, margin:0 }}>{form.teamName}</p>
              </div>
            </div>
          </div>

          {/* ── TEAM MEMBERS ── */}
          <div style={{ marginBottom:14, paddingBottom:14, borderBottom:'1px solid rgba(139,92,246,0.15)' }}>
            <p style={{ color:'rgba(34,211,238,0.5)', fontSize:7, letterSpacing:'2px', textTransform:'uppercase', margin:'0 0 6px' }}>TEAM MEMBERS</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {allMembers.map((m, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:20, padding:'3px 8px' }}>
                  <span style={{ width:14, height:14, borderRadius:'50%', background:'rgba(139,92,246,0.3)', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:7, color:'#a855f7', fontWeight:700 }}>{i+1}</span>
                  <span style={{ color:'#e2e8f0', fontSize:10, fontWeight:600 }}>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── EVENT INFO ── */}
          <div style={{ display:'flex', gap:0, marginBottom:12 }}>
            {[
              ['📅', 'DATE', '22 April 2026'],
              ['📍', 'VENUE', 'Zeal College, Pune'],
              ['⏰', 'TIME', '9:00 AM onwards'],
            ].map(([icon, label, val], i) => (
              <div key={label} style={{ flex:1, textAlign:'center', padding:'8px 4px', background: i===1 ? 'rgba(34,211,238,0.06)' : 'transparent', borderRadius:8 }}>
                <p style={{ fontSize:14, margin:'0 0 2px' }}>{icon}</p>
                <p style={{ color:'rgba(139,92,246,0.45)', fontSize:7, letterSpacing:'1px', textTransform:'uppercase', margin:'0 0 2px' }}>{label}</p>
                <p style={{ color:'#e2e8f0', fontSize:9, fontWeight:700, margin:0 }}>{val}</p>
              </div>
            ))}
          </div>

          {/* ── COLLABORATION ── */}
          <div style={{ textAlign:'center', padding:'8px', background:'rgba(139,92,246,0.05)', borderRadius:8 }}>
            <p style={{ color:'rgba(139,92,246,0.4)', fontSize:8, margin:0, letterSpacing:'1px' }}>
              In Collaboration with <span style={{ color:'#a855f7' }}>IIT Mandi iHub</span> · Sponsored by <span style={{ color:'#22d3ee' }}>Vinsys IT Services</span>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ height:4, background:'linear-gradient(90deg,#22d3ee,#3b82f6,#a855f7)' }} />
      </motion.div>

      {/* Buttons */}
      <motion.div className="flex flex-col sm:flex-row gap-3 mt-5 w-full z-10" style={{ maxWidth:480 }}
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
        {!pending && (
          <motion.button onClick={downloadPDF} disabled={downloading}
            className="flex-1 py-3.5 rounded-xl font-black text-white text-sm flex items-center justify-center gap-2"
            style={{ background: downloaded ? 'linear-gradient(135deg,#16a34a,#15803d)' : 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
            whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
            {downloading ? (
              <><motion.span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                animate={{ rotate:360 }} transition={{ duration:0.7, repeat:Infinity, ease:'linear' }} />Generating...</>
            ) : downloaded ? <>✅ Downloaded!</> : <>📥 Download Pass (PDF)</>}
          </motion.button>
        )}
        <motion.button onClick={onClose}
          className="flex-1 py-3.5 rounded-xl font-bold text-purple-300 text-sm"
          style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.3)' }}
          whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
          {pending ? 'Got it! 👍' : 'Close'}
        </motion.button>
      </motion.div>

      <motion.p className="text-purple-400/40 text-xs mt-3 z-10 text-center px-4"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}>
        {pending
          ? '📧 QR code will be sent to your email once admin approves your registration!'
          : '🚀 Bring this pass on event day · QR code sent to your email'}
      </motion.p>
    </motion.div>
  );
}
