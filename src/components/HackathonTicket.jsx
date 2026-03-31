import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function HackathonTicket({ form, onClose }) {
  const ticketRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded]   = useState(false);

  const ticketId = `ARVR-2026-${Math.random().toString(36).substring(2,7).toUpperCase()}`;
  const members  = form.teamMembers.split(',').map(m => m.trim()).filter(Boolean);

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const el      = ticketRef.current;
      const canvas  = await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: '#0a0020' });
      const imgData = canvas.toDataURL('image/png');
      const pdf     = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [200, 120] });
      pdf.addImage(imgData, 'PNG', 0, 0, 200, 120);
      pdf.save(`ARVR_Hackathon_${form.teamName.replace(/\s+/g,'_')}_Ticket.pdf`);
      setDownloaded(true);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(2,0,16,0.95)', backdropFilter: 'blur(20px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Stars */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ width: Math.random()*2+0.5, height: Math.random()*2+0.5, left:`${Math.random()*100}%`, top:`${Math.random()*100}%` }}
          animate={{ opacity:[0.1,0.8,0.1] }}
          transition={{ duration:2+Math.random()*2, repeat:Infinity, delay:Math.random()*2 }}
        />
      ))}

      <motion.p
        className="text-purple-400/60 text-xs tracking-[0.4em] uppercase mb-4 z-10"
        initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
      >Your Hackathon Pass is Ready!</motion.p>

      {/* ══ TICKET CARD ══ */}
      <motion.div
        ref={ticketRef}
        className="relative w-full z-10 overflow-hidden"
        style={{
          maxWidth: 680,
          background: 'linear-gradient(135deg, #0a0020 0%, #0d0030 50%, #080018 100%)',
          border: '1px solid rgba(139,92,246,0.5)',
          borderRadius: 20,
          boxShadow: '0 0 60px rgba(139,92,246,0.3), 0 0 120px rgba(34,211,238,0.1)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
        initial={{ opacity:0, scale:0.85, y:40 }}
        animate={{ opacity:1, scale:1, y:0 }}
        transition={{ type:'spring', stiffness:200, damping:20 }}
      >
        {/* Top gradient bar */}
        <div style={{ height:4, background:'linear-gradient(90deg, #a855f7, #3b82f6, #22d3ee, #a855f7)', backgroundSize:'200%' }} />

        {/* Grid bg */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage:'linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)',
          backgroundSize:'30px 30px',
        }} />

        {/* Glow orbs */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none" style={{ background:'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', filter:'blur(20px)' }} />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full pointer-events-none" style={{ background:'radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)', filter:'blur(16px)' }} />

        <div className="relative p-6 flex flex-col sm:flex-row gap-6">

          {/* LEFT SIDE */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.webp" alt="logo"
                style={{ width:44, height:44, borderRadius:'50%', border:'2px solid rgba(139,92,246,0.7)', boxShadow:'0 0 12px rgba(139,92,246,0.5)' }} />
              <div>
                <p style={{ color:'rgba(139,92,246,0.7)', fontSize:9, letterSpacing:'0.25em', textTransform:'uppercase', margin:0 }}>Zeal Education Society's</p>
                <p style={{ color:'#fff', fontSize:11, fontWeight:800, margin:0, letterSpacing:'0.05em' }}>ZIBACAR · AR/VR Hackathon 2026</p>
              </div>
            </div>

            {/* Event name */}
            <div style={{ marginBottom:16 }}>
              <h1 style={{
                fontSize:28, fontWeight:900, margin:0, lineHeight:1,
                color:'#ffffff',
                textShadow:'0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(139,92,246,0.4)',
              }}>AR/VR HACKATHON</h1>
              <p style={{ color:'#22d3ee', fontSize:12, margin:'4px 0 0', letterSpacing:'0.3em', textTransform:'uppercase' }}>Innovation Meets Immersion</p>
            </div>

            {/* Participant info */}
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {/* Name - BIG and WHITE */}
              <div style={{ marginBottom:4 }}>
                <span style={{ color:'rgba(139,92,246,0.6)', fontSize:8, letterSpacing:'0.2em', display:'block', marginBottom:2 }}>PARTICIPANT</span>
                <span style={{ color:'#ffffff', fontSize:22, fontWeight:900, letterSpacing:'0.05em', textShadow:'0 0 20px rgba(255,255,255,0.4)' }}>{form.name}</span>
              </div>
              {[
                { label:'EMAIL',   value: form.email },
                { label:'BRANCH',  value: form.branch },
                { label:'COLLEGE', value: form.collegeName },
              ].map(({ label, value }) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ color:'rgba(139,92,246,0.6)', fontSize:8, letterSpacing:'0.2em', minWidth:70 }}>{label}</span>
                  <span style={{ color:'#e2e8f0', fontSize:12, fontWeight:600 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Date */}
            <div style={{ marginTop:14, display:'flex', gap:16 }}>
              {[['📅','DATE','April 20–21, 2026'],['📍','VENUE','ZIBACAR Campus'],['⏱','DURATION','48 Hours']].map(([icon,label,val])=>(
                <div key={label} style={{ display:'flex', flexDirection:'column', gap:2 }}>
                  <span style={{ fontSize:10 }}>{icon}</span>
                  <span style={{ color:'rgba(139,92,246,0.6)', fontSize:7, letterSpacing:'0.2em' }}>{label}</span>
                  <span style={{ color:'#e2e8f0', fontSize:9, fontWeight:700 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DIVIDER */}
          <div style={{ width:1, background:'linear-gradient(180deg, transparent, rgba(139,92,246,0.5), rgba(34,211,238,0.3), transparent)', minHeight:180 }} />

          {/* RIGHT SIDE */}
          <div style={{ width:160, display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>

            {/* Team name */}
            <div style={{ textAlign:'center', padding:'8px 16px', borderRadius:10, background:'rgba(139,92,246,0.12)', border:'1px solid rgba(139,92,246,0.3)', width:'100%' }}>
              <p style={{ color:'rgba(139,92,246,0.6)', fontSize:8, letterSpacing:'0.25em', margin:'0 0 2px' }}>TEAM</p>
              <p style={{ color:'#a855f7', fontSize:14, fontWeight:900, margin:0 }}>{form.teamName}</p>
            </div>

            {/* Team members */}
            <div style={{ width:'100%' }}>
              <p style={{ color:'rgba(34,211,238,0.6)', fontSize:8, letterSpacing:'0.2em', margin:'0 0 6px', textAlign:'center' }}>TEAM MEMBERS</p>
              {members.map((m, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                  <span style={{ width:16, height:16, borderRadius:'50%', background:'rgba(139,92,246,0.2)', border:'1px solid rgba(139,92,246,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, color:'#a855f7', flexShrink:0 }}>{i+1}</span>
                  <span style={{ color:'#e2e8f0', fontSize:10, fontWeight:600 }}>{m}</span>
                </div>
              ))}
            </div>

            {/* Ticket ID */}
            <div style={{ marginTop:'auto', textAlign:'center', width:'100%' }}>
              <div style={{ padding:'6px 10px', borderRadius:8, background:'rgba(34,211,238,0.08)', border:'1px solid rgba(34,211,238,0.25)' }}>
                <p style={{ color:'rgba(34,211,238,0.5)', fontSize:7, letterSpacing:'0.2em', margin:'0 0 2px' }}>TICKET ID</p>
                <p style={{ color:'#22d3ee', fontSize:11, fontWeight:900, margin:0, letterSpacing:'0.1em' }}>{ticketId}</p>
              </div>
              <p style={{ color:'rgba(139,92,246,0.4)', fontSize:7, margin:'6px 0 0', letterSpacing:'0.15em' }}>In Collaboration with IIT Mandi</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ height:3, background:'linear-gradient(90deg, #22d3ee, #3b82f6, #a855f7)' }} />
      </motion.div>

      {/* Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3 mt-6 z-10"
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
      >
        <motion.button
          onClick={downloadPDF}
          disabled={downloading}
          className="relative px-8 py-3.5 rounded-xl font-black text-white text-sm overflow-hidden flex items-center gap-2"
          style={{ background: downloaded ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
          whileHover={{ scale:1.05, boxShadow:'0 0 30px rgba(139,92,246,0.5)' }}
          whileTap={{ scale:0.95 }}
        >
          {downloading ? (
            <>
              <motion.span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                animate={{ rotate:360 }} transition={{ duration:0.7, repeat:Infinity, ease:'linear' }} />
              Generating PDF...
            </>
          ) : downloaded ? (
            <>✅ Downloaded!</>
          ) : (
            <>📥 Download Ticket (PDF)</>
          )}
        </motion.button>

        <motion.button
          onClick={onClose}
          className="px-8 py-3.5 rounded-xl font-bold text-purple-300 text-sm"
          style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.3)' }}
          whileHover={{ scale:1.05 }}
          whileTap={{ scale:0.95 }}
        >Close</motion.button>
      </motion.div>

      <motion.p
        className="text-purple-400/40 text-xs mt-3 z-10"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }}
      >Save this ticket — bring it on Hackathon Day! 🚀</motion.p>
    </motion.div>
  );
}
