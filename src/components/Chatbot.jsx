import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOT_NAME = 'ARIA';
const BOT_SUBTITLE = 'AR/VR Hackathon Assistant';

const QUICK_QUESTIONS = [
  '📍 Venue & Location',
  '👤 Student Coordinators',
  '📋 Rules',
  '📅 Important Dates',
  '🏆 Prizes',
  '📞 Contact Us',
];

const QA = {
  'venue': {
    q: '📍 Venue & Location',
    a: `🏫 **Venue:** ZIBACAR Campus\n📍 **Address:** Zeal Institute of Business Administration, Computer Application and Research, Pune\n🗺️ Google Maps link will be shared soon!\n⏰ **Reporting Time:** April 20, 2026 at 9:00 AM`,
  },
  'coordinator': {
    q: '👤 Student Coordinators',
    a: `👨‍💻 **Student Coordinators:**\n\n🔹 **Coordinator 1**\n   Name: Coming Soon\n   📱 Contact: Coming Soon\n\n🔹 **Coordinator 2**\n   Name: Coming Soon\n   📱 Contact: Coming Soon\n\n_(Details will be updated soon!)_`,
  },
  'rules': {
    q: '📋 Rules',
    a: `📜 **Hackathon Rules:**\n\n✅ Team size: 2–4 members\n✅ Students only\n✅ Working prototype required\n✅ AR/VR must be core component\n✅ Open source tools preferred\n🚫 No pre-built code allowed\n⏱️ 48-hour build time\n🎤 Presentation mandatory`,
  },
  'dates': {
    q: '📅 Important Dates',
    a: `📅 **Key Dates:**\n\n🚀 **March 15, 2026** — Registration Opens\n⏰ **April 10, 2026** — Registration Closes\n⚡ **April 20–21, 2026** — Hackathon Day\n🏆 **May 5, 2026** — Results Announced`,
  },
  'prizes': {
    q: '🏆 Prizes',
    a: `🏆 **Prize Pool: ₹1,00,000+**\n\n🥇 **1st Place** — ₹50,000\n🥈 **2nd Place** — ₹30,000\n🥉 **3rd Place** — ₹20,000\n\n🎯 Best UI/UX — ₹5,000\n🔬 Most Innovative — ₹5,000\n🌟 Best Pitch — ₹5,000`,
  },
  'contact': {
    q: '📞 Contact Us',
    a: `📞 **Contact Information:**\n\n🏫 **Institute:** ZIBACAR, Pune\n📧 **Email:** Coming Soon\n📱 **Phone:** Coming Soon\n🌐 **Website:** arvr-drab.vercel.app\n\n_(Full contact details coming soon!)_`,
  },
};

const KEYWORD_MAP = {
  venue: ['venue', 'location', 'address', 'where', 'place', 'campus'],
  coordinator: ['coordinator', 'contact', 'person', 'who', 'name', 'student'],
  rules: ['rule', 'rules', 'guideline', 'regulation', 'allowed', 'team size'],
  dates: ['date', 'when', 'schedule', 'timeline', 'deadline', 'registration'],
  prizes: ['prize', 'money', 'reward', 'win', 'cash', 'amount'],
  contact: ['contact', 'email', 'phone', 'reach', 'help', 'support'],
};

function getResponse(input) {
  const lower = input.toLowerCase();
  for (const [key, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some(k => lower.includes(k))) return QA[key].a;
  }
  return `🤖 I'm not sure about that! Try asking about:\n\n📍 Venue · 👤 Coordinators · 📋 Rules\n📅 Dates · 🏆 Prizes · 📞 Contact`;
}

function formatMessage(text) {
  return text.split('\n').map((line, i) => {
    const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const italic = bold.replace(/_(.*?)_/g, '<em>$1</em>');
    return <p key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: italic || '&nbsp;' }} />;
  });
}

export default function Chatbot() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: `👋 Hi! I'm **ARIA**, your AR/VR Hackathon assistant!\n\nAsk me anything about the hackathon or pick a quick question below! 🚀`, time: new Date() }
  ]);
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const [unread, setUnread]   = useState(1);
  const bottomRef             = useRef(null);

  useEffect(() => {
    if (open) { setUnread(0); bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }
  }, [messages, open]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { from: 'user', text, time: new Date() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { from: 'bot', text: getResponse(text), time: new Date() }]);
    }, 800 + Math.random() * 600);
  };

  const handleQuick = (q) => {
    const key = Object.keys(QA).find(k => QA[k].q === q);
    if (key) sendMessage(q);
  };

  return (
    <>
      {/* ── CHAT WINDOW ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-4 sm:right-6 z-[9980] flex flex-col"
            style={{
              width: 'min(380px, calc(100vw - 32px))',
              height: 'min(580px, calc(100vh - 120px))',
              background: 'linear-gradient(145deg, rgba(10,0,30,0.98), rgba(5,0,20,0.98))',
              border: '1px solid rgba(139,92,246,0.4)',
              borderRadius: 20,
              boxShadow: '0 0 60px rgba(139,92,246,0.25), 0 20px 60px rgba(0,0,0,0.5)',
            }}
            initial={{ opacity: 0, scale: 0.85, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            {/* Top bar */}
            <div className="h-1 rounded-t-[20px]" style={{ background: 'linear-gradient(90deg, #a855f7, #3b82f6, #22d3ee)' }} />

            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden"
                  style={{ border: '1.5px solid rgba(139,92,246,0.6)' }}>
                  <img src="/logo.webp" alt="ARIA" className="w-full h-full object-cover" />
                </div>
                <motion.div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400"
                  style={{ border: '2px solid rgba(10,0,30,1)' }}
                  animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">{BOT_NAME}</p>
                <p className="text-purple-400/60 text-xs">{BOT_SUBTITLE}</p>
              </div>
              <motion.button onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-white text-xs"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
                whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>✕</motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3" style={{ scrollbarWidth: 'none' }}>
              {messages.map((msg, i) => (
                <motion.div key={i}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {msg.from === 'bot' && (
                    <div className="w-6 h-6 rounded-full overflow-hidden mr-2 flex-shrink-0 mt-1"
                      style={{ border: '1px solid rgba(139,92,246,0.4)' }}>
                      <img src="/logo.webp" alt="bot" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="max-w-[80%]">
                    <div className="px-3 py-2.5 rounded-2xl text-xs leading-relaxed"
                      style={msg.from === 'user' ? {
                        background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                        color: '#fff', borderBottomRightRadius: 4,
                      } : {
                        background: 'rgba(139,92,246,0.1)',
                        border: '1px solid rgba(139,92,246,0.2)',
                        color: '#e2e8f0', borderBottomLeftRadius: 4,
                      }}>
                      {formatMessage(msg.text)}
                    </div>
                    <p className="text-gray-600 text-[10px] mt-1 px-1">
                      {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {typing && (
                  <motion.div className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="w-6 h-6 rounded-full overflow-hidden"
                      style={{ border: '1px solid rgba(139,92,246,0.4)' }}>
                      <img src="/logo.webp" alt="bot" className="w-full h-full object-cover" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1"
                      style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                      {[0,1,2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400"
                          animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Quick questions */}
            <div className="px-3 py-2" style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}>
              <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {QUICK_QUESTIONS.map(q => (
                  <motion.button key={q} onClick={() => handleQuick(q)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap"
                    style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', color: '#c084fc' }}
                    whileHover={{ scale: 1.05, background: 'rgba(139,92,246,0.2)' }}
                    whileTap={{ scale: 0.95 }}>
                    {q}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="px-3 pb-3">
              <div className="flex gap-2 items-center px-3 py-2 rounded-xl"
                style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent text-white text-xs outline-none placeholder-gray-600"
                />
                <motion.button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: input.trim() ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'rgba(139,92,246,0.1)' }}
                  whileHover={input.trim() ? { scale: 1.1 } : {}}
                  whileTap={input.trim() ? { scale: 0.9 } : {}}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FLOATING HINT BUBBLE ── */}
      <AnimatePresence>
        {!open && (
          <motion.div
            className="fixed bottom-24 right-4 sm:right-6 z-[9979]"
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
          >
            <motion.div
              className="relative px-4 py-2.5 rounded-2xl rounded-br-sm text-xs font-medium text-white max-w-[200px] text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.95), rgba(37,99,235,0.95))',
                border: '1px solid rgba(139,92,246,0.5)',
                boxShadow: '0 0 20px rgba(139,92,246,0.3)',
                backdropFilter: 'blur(10px)',
              }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              💬 Any doubt? I'm here for all your queries!
              {/* Tail */}
              <div className="absolute -bottom-2 right-4 w-0 h-0"
                style={{
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '8px solid rgba(37,99,235,0.95)',
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB BUTTON — Robot Face ── */}}
      <motion.button
        className="fixed bottom-6 right-4 sm:right-6 z-[9980] flex items-center justify-center"
        style={{
          width: 58, height: 62,
          background: 'linear-gradient(145deg, #4c1d95, #1e3a8a)',
          borderRadius: '35% 35% 40% 40%',
          border: '2px solid rgba(139,92,246,0.8)',
          boxShadow: open
            ? '0 0 30px rgba(139,92,246,0.8), 0 0 60px rgba(139,92,246,0.3)'
            : '0 0 20px rgba(139,92,246,0.5)',
          position: 'fixed',
        }}
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        animate={{ boxShadow: [
          '0 0 15px rgba(139,92,246,0.4)',
          '0 0 35px rgba(139,92,246,0.8)',
          '0 0 15px rgba(139,92,246,0.4)'
        ]}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close"
              className="text-white font-black text-xl"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >✕</motion.span>
          ) : (
            <motion.div key="robot"
              className="flex flex-col items-center justify-center gap-1 w-full px-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {/* Antenna */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#22d3ee', boxShadow: '0 0 8px #22d3ee, 0 0 16px #22d3ee' }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <div className="w-0.5 h-2.5" style={{ background: 'rgba(139,92,246,0.8)' }} />
              </div>

              {/* Eyes */}
              <div className="flex gap-2">
                {[0, 1].map(i => (
                  <motion.div
                    key={i}
                    style={{
                      width: 10, height: 8,
                      borderRadius: 3,
                      background: '#22d3ee',
                      boxShadow: '0 0 8px #22d3ee, 0 0 16px #22d3ee',
                    }}
                    animate={{ opacity: [1, 1, 0.1, 1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.15, times: [0, 0.45, 0.5, 0.55, 1] }}
                  />
                ))}
              </div>

              {/* Nose dot */}
              <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(139,92,246,0.8)' }} />

              {/* Mouth */}
              <div className="flex gap-0.5 items-end">
                {[2, 4, 5, 4, 2].map((h, i) => (
                  <motion.div
                    key={i}
                    style={{ width: 4, height: h, borderRadius: 2, background: i === 2 ? '#22d3ee' : 'rgba(34,211,238,0.5)' }}
                    animate={{ height: [h, h + 2, h] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {!open && unread > 0 && (
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: '#ec4899', boxShadow: '0 0 8px #ec4899' }}
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            >
              {unread}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
