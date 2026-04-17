import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';

const API = import.meta.env.VITE_API_URL || 'https://arvrhackthon.vercel.app';

export default function StaffPanel() {
  const [staff, setStaff]         = useState(null);
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [loginErr, setLoginErr]   = useState('');
  const [scanning, setScanning]   = useState(false);
  const [manualId, setManualId]   = useState('');
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [mode, setMode]           = useState('camera'); // 'camera' | 'manual'
  const scannerRef                = useRef(null);
  const html5QrRef                = useRef(null);

  // Restore session
  useEffect(() => {
    const saved = localStorage.getItem('staff_session');
    if (saved) setStaff(JSON.parse(saved));
  }, []);

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => stopScanner();
  }, []);

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    setLoginErr('');
    try {
      const res  = await fetch(`${API}/api/staff-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setStaff(data.staff);
        localStorage.setItem('staff_session', JSON.stringify(data.staff));
      } else {
        setLoginErr(data.message || 'Invalid credentials.');
      }
    } catch { setLoginErr('Server unreachable.'); }
    finally { setLoading(false); }
  };

  const doCheckin = async (rawData) => {
    if (loading) return;
    setLoading(true);
    setResult(null);
    try {
      const res  = await fetch(`${API}/api/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uniqueId: rawData, staffUsername: staff.username }),
      });
      const data = await res.json();
      setResult(data);
      if (data.success) {
        stopScanner();
        setScanning(false);
      }
    } catch { setResult({ success: false, message: 'Server error. Try again.' }); }
    finally { setLoading(false); }
  };

  const startScanner = async () => {
    setResult(null);
    setScanning(true);
    await new Promise(r => setTimeout(r, 300)); // wait for DOM

    try {
      const qr = new Html5Qrcode('qr-reader');
      html5QrRef.current = qr;

      const cameras = await Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) {
        setResult({ success: false, message: '❌ No camera found on this device.' });
        setScanning(false);
        return;
      }

      // Prefer back camera
      const cam = cameras.find(c => c.label.toLowerCase().includes('back')) || cameras[cameras.length - 1];

      await qr.start(
        cam.id,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // Parse QR data
          let uniqueId = decodedText;
          try {
            const parsed = JSON.parse(decodedText);
            uniqueId = parsed.uniqueId || decodedText;
          } catch { uniqueId = decodedText; }
          doCheckin(uniqueId);
        },
        () => {} // ignore scan errors
      );
    } catch (err) {
      setResult({ success: false, message: `Camera error: ${err.message || 'Permission denied. Allow camera access.'}` });
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrRef.current) {
      try {
        await html5QrRef.current.stop();
        html5QrRef.current.clear();
      } catch {}
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

  const logout = () => {
    stopScanner();
    setStaff(null);
    setResult(null);
    localStorage.removeItem('staff_session');
  };

  // ── LOGIN SCREEN ──
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
          <input type="text" placeholder="Username (e.g. staff1)" value={username}
            onChange={e => setUsername(e.target.value)} required autoComplete="username"
            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none"
            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)' }} />
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none"
            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)' }} />
          {loginErr && <p className="text-red-400 text-xs text-center">⚠ {loginErr}</p>}
          <motion.button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            {loading ? 'Logging in...' : 'Login →'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );

  // ── SCANNER SCREEN ──
  return (
    <div className="min-h-screen px-4 py-6" style={{ background: 'radial-gradient(ellipse at center, #0d0025 0%, #020010 100%)' }}>
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-black gradient-text">Check-in Scanner</h1>
            <p className="text-gray-500 text-xs mt-0.5">👤 {staff.name} · Game-o-thon 2K26</p>
          </div>
          <button onClick={logout}
            className="px-3 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
            Logout
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-5">
          {['camera', 'manual'].map(m => (
            <button key={m} onClick={() => { setMode(m); stopScanner(); setResult(null); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: mode === m ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(139,92,246,0.08)',
                border: '1px solid rgba(139,92,246,0.2)',
                color: mode === m ? '#fff' : '#9ca3af',
              }}>
              {m === 'camera' ? '📷 Camera Scan' : '⌨️ Manual Entry'}
            </button>
          ))}
        </div>

        {/* Camera mode */}
        {mode === 'camera' && (
          <motion.div className="rounded-2xl overflow-hidden mb-5"
            style={{ background: 'rgba(15,5,40,0.97)', border: '1px solid rgba(139,92,246,0.3)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* QR reader container */}
            <div id="qr-reader" className="w-full" style={{ minHeight: scanning ? 300 : 0 }} />

            {!scanning ? (
              <div className="p-6 text-center">
                <div className="text-6xl mb-4">📷</div>
                <p className="text-gray-400 text-sm mb-4">Point camera at participant's QR code</p>
                <motion.button onClick={startScanner}
                  className="px-8 py-3.5 rounded-xl font-black text-white text-sm"
                  style={{ background: 'linear-gradient(135deg,#00f0ff,#7000ff)' }}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  🔍 Start Camera Scanner
                </motion.button>
              </div>
            ) : (
              <div className="p-4 text-center">
                <motion.div className="inline-flex items-center gap-2 text-cyan-400 text-sm mb-3"
                  animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                  Scanning... Point at QR code
                </motion.div>
                <br />
                <button onClick={stopScanner}
                  className="px-6 py-2 rounded-xl text-sm font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors">
                  ✕ Stop Scanner
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Manual mode */}
        {mode === 'manual' && (
          <motion.div className="rounded-2xl p-6 mb-5"
            style={{ background: 'rgba(15,5,40,0.97)', border: '1px solid rgba(139,92,246,0.3)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-gray-400 text-sm mb-4">Enter participant's unique ID manually</p>
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
            <motion.div className="rounded-2xl p-5"
              style={{
                background: result.success ? 'rgba(16,185,129,0.1)' : result.alreadyCheckedIn ? 'rgba(234,179,8,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${result.success ? 'rgba(16,185,129,0.4)' : result.alreadyCheckedIn ? 'rgba(234,179,8,0.4)' : 'rgba(239,68,68,0.4)'}`,
              }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}>
              <div className="flex items-start gap-4">
                <div className="text-3xl flex-shrink-0">
                  {result.success ? '✅' : result.alreadyCheckedIn ? '⚠️' : '❌'}
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-base mb-2 ${result.success ? 'text-green-400' : result.alreadyCheckedIn ? 'text-yellow-400' : 'text-red-400'}`}>
                    {result.message}
                  </p>
                  {result.data && (
                    <div className="space-y-1.5">
                      <p className="text-white font-bold text-lg">{result.data.name}</p>
                      <p className="text-gray-300 text-sm">🏆 Team: <strong>{result.data.team}</strong></p>
                      <p className="text-gray-300 text-sm">🏫 {result.data.college}</p>
                      <p className="text-gray-400 text-sm">📱 {result.data.phone}</p>
                      <p className="text-cyan-400 text-xs font-mono mt-2">ID: {result.data.uniqueId}</p>
                      {result.data.checkedInAt && (
                        <p className="text-gray-500 text-xs">
                          ⏰ {new Date(result.data.checkedInAt).toLocaleTimeString()} · by {result.data.checkedInBy}
                        </p>
                      )}
                    </div>
                  )}
                  <button onClick={() => { setResult(null); if (mode === 'camera') startScanner(); }}
                    className="mt-4 px-5 py-2 rounded-xl text-sm font-bold text-white"
                    style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>
                    🔄 Scan Next
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
