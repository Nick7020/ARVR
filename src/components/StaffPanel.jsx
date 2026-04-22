import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';

const API = import.meta.env.VITE_API_URL || 'https://arvrhackthon.vercel.app';

export default function StaffPanel() {
  const [staff, setStaff]           = useState(null);
  const [username, setUsername]     = useState('');
  const [password, setPassword]     = useState('');
  const [loginErr, setLoginErr]     = useState('');
  const [scanning, setScanning]     = useState(false);
  const [manualId, setManualId]     = useState('');
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [mode, setMode]             = useState('camera');
  const [checkedInList, setCheckedInList] = useState([]);
  const html5QrRef  = useRef(null);
  const cooldownRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem('staff_session');
    if (saved) setStaff(JSON.parse(saved));
    const list = localStorage.getItem('checkedin_list');
    if (list) setCheckedInList(JSON.parse(list));
  }, []);

  useEffect(() => { return () => stopScanner(); }, []);

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true); setLoginErr('');
    try {
      const res  = await fetch(`${API}/api/staff-login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) { setStaff(data.staff); localStorage.setItem('staff_session', JSON.stringify(data.staff)); }
      else setLoginErr(data.message || 'Invalid credentials.');
    } catch { setLoginErr('Server unreachable.'); }
    finally { setLoading(false); }
  };

  const doCheckin = async (rawData) => {
    if (loading || cooldownRef.current) return;
    cooldownRef.current = true;
    setLoading(true); setResult(null);
    try {
      let uniqueId = rawData.trim();
      try { const p = JSON.parse(rawData); uniqueId = p.uniqueId || rawData; } catch {}

      const res  = await fetch(`${API}/api/checkin`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uniqueId, staffUsername: staff.username }),
      });
      const data = await res.json();
      setResult(data);

      if (data.success && data.data) {
        const entry = {
          ...data.data,
          time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }),
        };
        setCheckedInList(prev => {
          const updated = [entry, ...prev];
          localStorage.setItem('checkedin_list', JSON.stringify(updated));
          return updated;
        });
        await stopScanner();
      }
    } catch { setResult({ success: false, message: 'Server error. Try again.' }); }
    finally {
      setLoading(false);
      setTimeout(() => { cooldownRef.current = false; }, 3000);
    }
  };

  const startScanner = async () => {
    setResult(null); setScanning(true); cooldownRef.current = false;
    await new Promise(r => setTimeout(r, 400));
    try {
      const qr = new Html5Qrcode('qr-reader');
      html5QrRef.current = qr;
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras?.length) { setResult({ success: false, message: 'No camera found.' }); setScanning(false); return; }
      const cam = cameras.find(c => c.label.toLowerCase().includes('back')) || cameras[cameras.length - 1];
      await qr.start(cam.id, { fps: 5, qrbox: { width: 220, height: 220 } },
        (decodedText) => { if (!cooldownRef.current) doCheckin(decodedText); }, () => {});
    } catch (err) {
      setResult({ success: false, message: `Camera error: ${err.message || 'Allow camera permission.'}` });
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrRef.current) {
      try { await html5QrRef.current.stop(); html5QrRef.current.clear(); } catch {}
      html5QrRef.current = null;
    }
    setScanning(false);
  };

  const handleManual = async e => {
    e.preventDefault();
    if (!manualId.trim()) return;
    await doCheckin(manualId.trim());
    setManualId('');
  };

  const clearList = () => { setCheckedInList([]); localStorage.removeItem('checkedin_list'); };
  const logout = () => { stopScanner(); setStaff(null); setResult(null); localStorage.removeItem('staff_session'); };

  if (!staff) return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at center, #0d0025 0%, #020010 100%)' }}>
      <motion.div className="w-full max-w-sm rounded-3xl p-8"
        style={{ background: 'rgba(15,5,40,0.97)', border: '1px solid rgba(139,92,246,0.35)', boxShadow: '0 0 60px rgba(139,92,246,0.2)' }}
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="h-1 w-full rounded-full mb-6" style={{ background: 'linear-gradient(90deg,#a855f7,#3b82f6,#22d3ee)' }} />
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎮</div>
          <h2 className="text-2xl font-black gradient-text">Staff Check-in</h2>
          <p className="text-gray-500 text-sm mt-1">Game-o-thon 2K26</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required
            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none"
            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)' }} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none"
            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)' }} />
          {loginErr && <p className="text-red-400 text-xs text-center">⚠ {loginErr}</p>}
          <motion.button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            {loading ? 'Logging in...' : 'Login →'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-6" style={{ background: 'radial-gradient(ellipse at center, #0d0025 0%, #020010 100%)' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h1 className="text-xl font-black gradient-text">Check-in Scanner</h1>
            <p className="text-gray-500 text-xs mt-0.5">👤 {staff.name} · Game-o-thon 2K26</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
              ✅ {checkedInList.length} checked in
            </div>
            <button onClick={logout} className="px-3 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors"
              style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
              Logout
            </button>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-4">
          {['camera', 'manual'].map(m => (
            <button key={m} onClick={() => { setMode(m); stopScanner(); setResult(null); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: mode === m ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(139,92,246,0.08)',
                border: '1px solid rgba(139,92,246,0.2)', color: mode === m ? '#fff' : '#9ca3af',
              }}>
              {m === 'camera' ? '📷 Camera Scan' : '⌨️ Manual Entry'}
            </button>
          ))}
        </div>

        {/* Camera */}
        {mode === 'camera' && (
          <motion.div className="rounded-2xl overflow-hidden mb-4"
            style={{ background: 'rgba(15,5,40,0.97)', border: '1px solid rgba(139,92,246,0.3)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div id="qr-reader" className="w-full" />
            {!scanning ? (
              <div className="p-6 text-center">
                <div className="text-5xl mb-3">📷</div>
                <p className="text-gray-400 text-sm mb-4">Point camera at participant's QR code</p>
                <motion.button onClick={startScanner}
                  className="px-8 py-3.5 rounded-xl font-black text-white text-sm"
                  style={{ background: 'linear-gradient(135deg,#00f0ff,#7000ff)' }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  🔍 Start Camera
                </motion.button>
              </div>
            ) : (
              <div className="p-4 text-center">
                <motion.p className="text-cyan-400 text-sm mb-3 flex items-center justify-center gap-2"
                  animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                  Scanning... Hold QR steady
                </motion.p>
                <button onClick={stopScanner}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors">
                  ✕ Stop
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Manual */}
        {mode === 'manual' && (
          <motion.div className="rounded-2xl p-5 mb-4"
            style={{ background: 'rgba(15,5,40,0.97)', border: '1px solid rgba(139,92,246,0.3)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <form onSubmit={handleManual} className="flex flex-col gap-3">
              <input type="text" placeholder="GOT2K26-XXXXXXXX" value={manualId}
                onChange={e => setManualId(e.target.value.toUpperCase())} autoFocus
                className="w-full rounded-xl px-4 py-3.5 text-base text-white placeholder-gray-600 outline-none font-mono tracking-widest"
                style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)' }} />
              <motion.button type="submit" disabled={loading || !manualId.trim()}
                className="w-full py-3.5 rounded-xl font-black text-white"
                style={{ background: loading ? 'rgba(34,211,238,0.2)' : 'linear-gradient(135deg,#00f0ff,#7000ff)' }}
                whileHover={!loading ? { scale: 1.02 } : {}} whileTap={!loading ? { scale: 0.97 } : {}}>
                {loading ? 'Verifying...' : '✅ Verify & Check-in'}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div className="rounded-2xl p-5 mb-4"
              style={{
                background: result.success ? 'rgba(16,185,129,0.1)' : result.alreadyCheckedIn ? 'rgba(234,179,8,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${result.success ? 'rgba(16,185,129,0.4)' : result.alreadyCheckedIn ? 'rgba(234,179,8,0.4)' : 'rgba(239,68,68,0.4)'}`,
              }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <div className="flex items-start gap-3">
                <div className="text-3xl flex-shrink-0">
                  {result.success ? '✅' : result.alreadyCheckedIn ? '⚠️' : '❌'}
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-base mb-2 ${result.success ? 'text-green-400' : result.alreadyCheckedIn ? 'text-yellow-400' : 'text-red-400'}`}>
                    {result.message}
                  </p>
                  {result.data && (
                    <div className="space-y-1">
                      <p className="text-white font-bold text-lg">{result.data.name}</p>
                      <p className="text-gray-300 text-sm">🏆 {result.data.team}</p>
                      <p className="text-gray-400 text-sm">🏫 {result.data.college}</p>
                      <p className="text-cyan-400 text-xs font-mono">{result.data.uniqueId}</p>
                    </div>
                  )}
                  <button onClick={() => { setResult(null); if (mode === 'camera') startScanner(); }}
                    className="mt-3 px-5 py-2 rounded-xl text-sm font-bold text-white"
                    style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>
                    🔄 Scan Next
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Checked-in list */}
        {checkedInList.length > 0 && (
          <motion.div className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(15,5,40,0.97)', border: '1px solid rgba(16,185,129,0.2)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-green-500/10">
              <h3 className="text-green-400 font-bold text-sm">✅ Checked-in Today ({checkedInList.length})</h3>
              <button onClick={clearList} className="text-gray-600 hover:text-red-400 text-xs transition-colors">Clear</button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {checkedInList.map((p, i) => (
                <motion.div key={i} className="flex items-center justify-between px-4 py-3 border-b border-green-500/5"
                  style={{ background: i % 2 === 0 ? 'rgba(16,185,129,0.03)' : 'transparent' }}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <div>
                    <p className="text-white text-sm font-semibold">{p.name}</p>
                    <p className="text-gray-400 text-xs">{p.team} · {p.college}</p>
                    <p className="text-cyan-400/60 text-[10px] font-mono">{p.uniqueId}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-green-400 text-xs font-bold">{p.time}</p>
                    <p className="text-gray-600 text-[10px]">by {staff.username}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
