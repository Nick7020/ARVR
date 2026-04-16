import { useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function HackathonTicket({ form, onClose }) {
  const ticketRef  = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded]   = useState(false);

  const ticketId = useMemo(() =>
    `GOT-2K26-${Math.random().toString(36).substring(2,7).toUpperCase()}`, []);
  const members = Array.isArray(form.teamMembers)
    ? form.teamMembers.filter(Boolean)
    : (form.teamMembers || '').split(',').map(m => m.trim()).filter(Boolean);

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const el     = ticketRef.current;
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#0a0020' });
      const img    = canvas.toDataURL('image/png');
      const w = canvas.width, h = canvas.height;
      const pdf = new jsPDF({ orientation: h > w ? 'portrait' : 'landscape', unit: 'px', format: [w/2, h/2] });
      pdf.addImage(img, 'PNG', 0, 0, w/2, h/2);
      pdf.save(`ARVR_Hackathon_${form.teamName.replace(/\s+/g,'_')}_Ticket.pdf`);
      setDownloaded(true);
    } catch(e) { console.error(e); }
    finally { setDownloading(false); }
  };

  const S = {
    label: { color:'rgba(139,92,246,0.6)', fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', margin:'0 0 2px', display:'block' },
    value: { color:'#e2e8f0', fontSize:11, fontWeight:600, margin:0, wordBreak:'break-word' },
    divider: { height:1, background:'linear-gradient(90deg,transparent,rgba(139,92,246,0.35),transparent)', margin:'10px 0' },
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-start overflow-y-auto py-6 px-3"
      style={{ background:'rgba(2,0,16,0.97)', backdropFilter:'blur(20px)' }}
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
    >
      {/* Stars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white pointer-events-none"
          style={{ width:Math.random()*1.5+0.5, height:Math.random()*1.5+0.5, left:`${Math.random()*100}%`, top:`${Math.random()*100}%` }}
          animate={{ opacity:[0.1,0.6,0.1] }} transition={{ duration:2+Math.random()*2, repeat:Infinity, delay:Math.random()*2 }} />
      ))}

      <motion.p className="text-purple-400/60 text-xs tracking-[0.3em] uppercase mb-4 z-10 text-center"
        initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        🎟 Your Hackathon Pass is Ready!
      </motion.p>

      {/* ══ TICKET ══ */}
      <motion.div
        ref={ticketRef}
        className="relative w-full z-10 overflow-hidden"
        style={{
          maxWidth: 480,
          background:'linear-gradient(135deg, #0a0020 0%, #0d0030 60%, #080018 100%)',
          border:'1px solid rgba(139,92,246,0.5)',
          borderRadius:16,
          boxShadow:'0 0 40px rgba(139,92,246,0.3)',
          fontFamily:'Inter, system-ui, sans-serif',
        }}
        initial={{ opacity:0, scale:0.9, y:30 }}
        animate={{ opacity:1, scale:1, y:0 }}
        transition={{ type:'spring', stiffness:200, damping:20 }}
      >
        {/* Top bar */}
        <div style={{ height:4, background:'linear-gradient(90deg,#a855f7,#3b82f6,#22d3ee,#a855f7)' }} />

        {/* Grid bg */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage:'linear-gradient(rgba(139,92,246,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.3) 1px,transparent 1px)',
          backgroundSize:'24px 24px',
        }} />

        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(139,92,246,0.2) 0%,transparent 70%)', filter:'blur(16px)' }} />

        <div className="relative p-4">

          {/* HEADER */}
          <div className="flex items-center gap-3 mb-3">
            <img src="/logo.webp" alt="logo" style={{
              width:36, height:36, borderRadius:'50%', flexShrink:0,
              border:'2px solid rgba(139,92,246,0.7)',
              boxShadow:'0 0 10px rgba(139,92,246,0.5)',
            }} />
            <div className="flex-1 min-w-0">
              <p style={{ color:'rgba(139,92,246,0.7)', fontSize:7, letterSpacing:'0.2em', textTransform:'uppercase', margin:0 }}>Zeal Education Society's</p>
              <p style={{ color:'#fff', fontSize:9, fontWeight:800, margin:0 }}>ZIBACAR · Game-o-thon 2K26</p>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:8, fontWeight:700, margin:0 }}>Zeal Institute of Business Administration,</p>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:8, fontWeight:700, margin:0 }}>Computer Application and Research</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p style={{ color:'rgba(34,211,238,0.5)', fontSize:6, letterSpacing:'0.15em', margin:0 }}>TICKET ID</p>
              <p style={{ color:'#22d3ee', fontSize:9, fontWeight:900, margin:0 }}>{ticketId}</p>
            </div>
          </div>

          {/* EVENT TITLE */}
          <div className="mb-3 pb-3" style={{ borderBottom:'1px solid rgba(139,92,246,0.2)' }}>
            <h1 style={{ fontSize:22, fontWeight:900, margin:0, lineHeight:1, color:'#ffffff', textShadow:'0 0 20px rgba(255,255,255,0.4)' }}>
              GAME-O-THON 2K26
            </h1>
            <p style={{ color:'#22d3ee', fontSize:9, margin:'3px 0 0', letterSpacing:'0.2em', textTransform:'uppercase' }}>
              Build The Game · Break The Limit
            </p>
          </div>

          {/* PARTICIPANT NAME */}
          <div className="mb-3">
            <span style={S.label}>Participant</span>
            <p style={{ color:'#ffffff', fontSize:18, fontWeight:900, margin:0, textShadow:'0 0 12px rgba(255,255,255,0.3)' }}>
              {form.name}
            </p>
          </div>

          <div style={S.divider} />

          {/* INFO GRID — 2 cols */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
            {[
              { label:'Email',   value: form.email },
              { label:'Phone',   value: form.phone },
              { label:'Branch',  value: form.branch },
              { label:'College', value: form.collegeName },
            ].map(({ label, value }) => (
              <div key={label}>
                <span style={S.label}>{label}</span>
                <p style={S.value}>{value}</p>
              </div>
            ))}
          </div>

          <div style={S.divider} />

          {/* TEAM */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span style={S.label}>Team Name</span>
              <p style={{ color:'#a855f7', fontSize:13, fontWeight:900, margin:0 }}>{form.teamName}</p>
            </div>

            <span style={S.label}>Team Members</span>
            <div className="grid grid-cols-2 gap-1 mt-1">
              {members.map((m, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span style={{ width:14, height:14, borderRadius:'50%', background:'rgba(139,92,246,0.2)', border:'1px solid rgba(139,92,246,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:7, color:'#a855f7', flexShrink:0 }}>{i+1}</span>
                  <span style={{ color:'#e2e8f0', fontSize:10, fontWeight:600 }}>{m}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={S.divider} />

          {/* DATE ROW */}
          <div className="flex gap-3 flex-wrap">
            {[['📅','Date','Apr 20–21, 2026'],['📍','Venue','ZIBACAR, Pune'],['⏱','Duration','1 Day']].map(([icon,label,val]) => (
              <div key={label}>
                <p style={{ color:'rgba(139,92,246,0.55)', fontSize:7, letterSpacing:'0.15em', margin:0 }}>{icon} {label}</p>
                <p style={{ color:'#e2e8f0', fontSize:9, fontWeight:700, margin:0 }}>{val}</p>
              </div>
            ))}
          </div>

          <p style={{ color:'rgba(139,92,246,0.35)', fontSize:7, letterSpacing:'0.12em', textAlign:'center', marginTop:10 }}>
            In Collaboration with IIT Mandi
          </p>
        </div>

        {/* Bottom bar */}
        <div style={{ height:3, background:'linear-gradient(90deg,#22d3ee,#3b82f6,#a855f7)' }} />
      </motion.div>

      {/* Buttons */}
      <motion.div className="flex flex-col sm:flex-row gap-3 mt-5 w-full z-10" style={{ maxWidth:480 }}
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
        <motion.button
          onClick={downloadPDF} disabled={downloading}
          className="flex-1 py-3.5 rounded-xl font-black text-white text-sm flex items-center justify-center gap-2"
          style={{ background: downloaded ? 'linear-gradient(135deg,#16a34a,#15803d)' : 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
          whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
        >
          {downloading ? (
            <><motion.span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
              animate={{ rotate:360 }} transition={{ duration:0.7, repeat:Infinity, ease:'linear' }} />Generating...</>
          ) : downloaded ? <>✅ Downloaded!</> : <>📥 Download Ticket (PDF)</>}
        </motion.button>
        <motion.button onClick={onClose}
          className="flex-1 py-3.5 rounded-xl font-bold text-purple-300 text-sm"
          style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.3)' }}
          whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
          Close
        </motion.button>
      </motion.div>

      <motion.p className="text-purple-400/40 text-xs mt-3 z-10 text-center"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}>
        Save this ticket — bring it on Hackathon Day! 🚀
      </motion.p>
    </motion.div>
  );
}
