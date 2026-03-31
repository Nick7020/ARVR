import { useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function HackathonTicket({ form, onClose }) {
  const ticketRef  = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded]   = useState(false);

  const ticketId = useMemo(() =>
    `ARVR-2026-${Math.random().toString(36).substring(2,7).toUpperCase()}`, []);
  const members = form.teamMembers.split(',').map(m => m.trim()).filter(Boolean);

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const el     = ticketRef.current;
      const canvas = await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: '#0a0020' });
      const img    = canvas.toDataURL('image/png');
      const w = canvas.width, h = canvas.height;
      const isLandscape = w > h;
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'px',
        format: [w / 3, h / 3],
      });
      pdf.addImage(img, 'PNG', 0, 0, w / 3, h / 3);
      pdf.save(`ARVR_Hackathon_${form.teamName.replace(/\s+/g,'_')}_Ticket.pdf`);
      setDownloaded(true);
    } catch (e) { console.error(e); }
    finally { setDownloading(false); }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-start pt-6 pb-10 px-3 overflow-y-auto"
      style={{ background: 'rgba(2,0,16,0.97)', backdropFilter: 'blur(20px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Stars */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white pointer-events-none"
          style={{ width: Math.random()*1.5+0.5, height: Math.random()*1.5+0.5, left:`${Math.random()*100}%`, top:`${Math.random()*100}%` }}
          animate={{ opacity:[0.1,0.7,0.1] }} transition={{ duration:2+Math.random()*2, repeat:Infinity, delay:Math.random()*2 }} />
      ))}

      <motion.p className="text-purple-400/60 text-xs tracking-[0.35em] uppercase mb-4 z-10 text-center"
        initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        🎟 Your Hackathon Pass is Ready!
      </motion.p>

      {/* ══ TICKET ══ */}
      <motion.div
        ref={ticketRef}
        className="relative w-full z-10 overflow-hidden"
        style={{
          maxWidth: 640,
          background: 'linear-gradient(135deg, #0a0020 0%, #0d0030 60%, #080018 100%)',
          border: '1px solid rgba(139,92,246,0.5)',
          borderRadius: 18,
          boxShadow: '0 0 50px rgba(139,92,246,0.3)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
        initial={{ opacity:0, scale:0.88, y:30 }}
        animate={{ opacity:1, scale:1, y:0 }}
        transition={{ type:'spring', stiffness:200, damping:20 }}
      >
        {/* Top bar */}
        <div style={{ height:4, background:'linear-gradient(90deg,#a855f7,#3b82f6,#22d3ee,#a855f7)' }} />

        {/* Grid bg */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage:'linear-gradient(rgba(139,92,246,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.3) 1px,transparent 1px)',
          backgroundSize:'28px 28px',
        }} />

        {/* Glow orbs */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(139,92,246,0.2) 0%,transparent 70%)', filter:'blur(18px)' }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(34,211,238,0.15) 0%,transparent 70%)', filter:'blur(14px)' }} />

        <div className="relative p-5">

          {/* ── HEADER ROW ── */}
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.webp" alt="logo" style={{
              width:40, height:40, borderRadius:'50%', flexShrink:0,
              border:'2px solid rgba(139,92,246,0.7)',
              boxShadow:'0 0 12px rgba(139,92,246,0.5)',
            }} />
            <div>
              <p style={{ color:'rgba(139,92,246,0.7)', fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', margin:0 }}>
                Zeal Education Society's
              </p>
              <p style={{ color:'#fff', fontSize:10, fontWeight:800, margin:0 }}>
                ZIBACAR · AR/VR Hackathon 2026
              </p>
            </div>
            {/* Ticket ID top right */}
            <div className="ml-auto text-right flex-shrink-0">
              <p style={{ color:'rgba(34,211,238,0.5)', fontSize:7, letterSpacing:'0.15em', margin:0 }}>TICKET ID</p>
              <p style={{ color:'#22d3ee', fontSize:10, fontWeight:900, margin:0 }}>{ticketId}</p>
            </div>
          </div>

          {/* ── EVENT TITLE ── */}
          <div className="mb-4 pb-4" style={{ borderBottom:'1px solid rgba(139,92,246,0.2)' }}>
            <h1 style={{ fontSize:24, fontWeight:900, margin:0, lineHeight:1, color:'#ffffff',
              textShadow:'0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(139,92,246,0.3)' }}>
              AR/VR HACKATHON
            </h1>
            <p style={{ color:'#22d3ee', fontSize:10, margin:'4px 0 0', letterSpacing:'0.25em', textTransform:'uppercase' }}>
              Innovation Meets Immersion
            </p>
          </div>

          {/* ── MAIN CONTENT: 2 cols on desktop, 1 col on mobile ── */}
          <div className="flex flex-col sm:flex-row gap-4">

            {/* LEFT */}
            <div className="flex-1 flex flex-col gap-3">
              {/* Participant name BIG */}
              <div>
                <p style={{ color:'rgba(139,92,246,0.6)', fontSize:7, letterSpacing:'0.25em', textTransform:'uppercase', margin:'0 0 2px' }}>PARTICIPANT</p>
                <p style={{ color:'#ffffff', fontSize:20, fontWeight:900, margin:0,
                  textShadow:'0 0 15px rgba(255,255,255,0.3)' }}>{form.name}</p>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label:'EMAIL',   value: form.email },
                  { label:'BRANCH',  value: form.branch },
                  { label:'COLLEGE', value: form.collegeName },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-2">
                    <span style={{ color:'rgba(139,92,246,0.55)', fontSize:7, letterSpacing:'0.2em', minWidth:52, paddingTop:2 }}>{label}</span>
                    <span style={{ color:'#e2e8f0', fontSize:11, fontWeight:600, wordBreak:'break-all' }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Date row */}
              <div className="flex gap-4 flex-wrap mt-1">
                {[['📅','DATE','Apr 20–21, 2026'],['📍','VENUE','ZIBACAR'],['⏱','DURATION','48 Hours']].map(([icon,label,val])=>(
                  <div key={label}>
                    <p style={{ color:'rgba(139,92,246,0.55)', fontSize:7, letterSpacing:'0.15em', margin:0 }}>{icon} {label}</p>
                    <p style={{ color:'#e2e8f0', fontSize:9, fontWeight:700, margin:0 }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* DIVIDER — horizontal on mobile, vertical on desktop */}
            <div className="sm:hidden h-px w-full" style={{ background:'linear-gradient(90deg,transparent,rgba(139,92,246,0.4),transparent)' }} />
            <div className="hidden sm:block w-px self-stretch" style={{ background:'linear-gradient(180deg,transparent,rgba(139,92,246,0.4),rgba(34,211,238,0.3),transparent)' }} />

            {/* RIGHT */}
            <div className="sm:w-40 flex flex-col gap-3">
              {/* Team */}
              <div style={{ padding:'8px 12px', borderRadius:10, background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.3)', textAlign:'center' }}>
                <p style={{ color:'rgba(139,92,246,0.6)', fontSize:7, letterSpacing:'0.2em', margin:'0 0 2px' }}>TEAM</p>
                <p style={{ color:'#a855f7', fontSize:14, fontWeight:900, margin:0 }}>{form.teamName}</p>
              </div>

              {/* Members */}
              <div>
                <p style={{ color:'rgba(34,211,238,0.6)', fontSize:7, letterSpacing:'0.2em', margin:'0 0 6px', textAlign:'center' }}>TEAM MEMBERS</p>
                {members.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1.5">
                    <span style={{ width:15, height:15, borderRadius:'50%', background:'rgba(139,92,246,0.2)', border:'1px solid rgba(139,92,246,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:7, color:'#a855f7', flexShrink:0 }}>{i+1}</span>
                    <span style={{ color:'#e2e8f0', fontSize:10, fontWeight:600 }}>{m}</span>
                  </div>
                ))}
              </div>

              {/* IIT Mandi */}
              <p style={{ color:'rgba(139,92,246,0.4)', fontSize:7, letterSpacing:'0.12em', textAlign:'center', marginTop:'auto' }}>
                In Collaboration with IIT Mandi
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ height:3, background:'linear-gradient(90deg,#22d3ee,#3b82f6,#a855f7)' }} />
      </motion.div>

      {/* Buttons */}
      <motion.div className="flex flex-col sm:flex-row gap-3 mt-5 w-full z-10" style={{ maxWidth:640 }}
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
