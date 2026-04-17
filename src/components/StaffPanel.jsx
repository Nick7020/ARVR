import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconScan, IconCheck, IconX, IconLogout } from '@tabler/icons-react';

const API = import.meta.env.VITE_API_URL || 'https://arvrhackthon.vercel.app';

export default function StaffPanel() {
  const [staff, setStaff]       = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [qrInput, setQrInput]   = useState('');
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${API}/api/staff-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setStaff(data.staff);
        localStorage.setItem('staff', JSON.stringify(data.staff));
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch { setError('Server unreachable.'); }
    finally { setLoading(false); }
  };

  const handleScan = async e => {
    e.preventDefault();
    if (!qrInput.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res  = await fetch(`${API}/api/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uniqueId: qrInput, staffUsername: staff.username }),
      });
      const data = await res.json();
      setResult(data);
      if (data.success) setQrInput('');
    } catch { setResult({ success: false, message: 'Server error.' }); }
    finally { setLoading(false); }
  };

  const logout = () => { setStaff(null); localStorage.removeItem('staff'); };

  useEffect(() => {
    const saved = localStorage.getItem('staff');
    if (saved) setStaff(JSON.parse(saved));
  }, []);

  // Login screen
  if (!staff) return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background:'radial-gradient(ellipse at center, #0d0025 0%, #020010 100%)' }}>
      <motion.div className="w-full max-w-sm rounded-3xl p-8"
        style={{ background:'rgba(15,5,40,0.95)', border:'1px solid rgba(139,92,246,0.35)', boxShadow:'0 0 60px rgba(139,92,246,0.2)' }}
        initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
        <div className="h-1 w-full rounded-full mb-6" style={{ background:'linear-gradient(90deg,#a855f7,#3b82f6,#22d3ee)' }} />
        <h2 className="text-2xl font-black gradient-text mb-1">Staff Check-in</h2>
        <p className="text-gray-500 text-sm mb-6">Game-o-thon 2K26 · ZIBACAR</p>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required
            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none mb-3"
            style={{ background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.25)' }} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none mb-3"
            style={{ background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.25)' }} />
          {error && <p className="text-red-400 text-xs mb-3">⚠ {error}</p>}
          <motion.button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white text-sm"
            style={{ background:'linear-gradient(135deg,#7c3aed,#2563eb)' }}
            whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
        <p className="text-gray-600 text-xs mt-4 text-center">Default: staff1 / checkin@1</p>
      </motion.div>
    </div>
  );

  // Scanner screen
  return (
    <div className="min-h-screen px-4 py-8" style={{ background:'radial-gradient(ellipse at center, #0d0025 0%, #020010 100%)' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div className="flex justify-between items-center mb-8"
          initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}>
          <div>
            <h1 className="text-2xl font-black gradient-text">Check-in Scanner</h1>
            <p className="text-gray-500 text-sm">Logged in as <span className="text-cyan-400">{staff.name}</span></p>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors"
            style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)' }}>
            <IconLogout size={16} /> Logout
          </button>
        </motion.div>

        {/* Scanner */}
        <motion.div className="rounded-3xl p-8 mb-6"
          style={{ background:'rgba(15,5,40,0.95)', border:'1px solid rgba(139,92,246,0.3)', boxShadow:'0 0 60px rgba(139,92,246,0.2)' }}
          initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}>
          <div className="flex items-center gap-3 mb-6">
            <IconScan className="text-cyan-400" size={32} />
            <div>
              <h2 className="text-xl font-bold text-white">Scan Participant QR</h2>
              <p className="text-gray-400 text-sm">Enter unique ID or scan QR code</p>
            </div>
          </div>

          <form onSubmit={handleScan} className="mb-4">
            <input type="text" placeholder="GOT2K26-XXXXXXXX or scan QR" value={qrInput}
              onChange={e => setQrInput(e.target.value)} autoFocus
              className="w-full rounded-xl px-5 py-4 text-base text-white placeholder-gray-600 outline-none mb-3 font-mono"
              style={{ background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.25)' }} />
            <motion.button type="submit" disabled={loading || !qrInput.trim()}
              className="w-full py-4 rounded-xl font-black text-white text-base"
              style={{ background: loading ? 'rgba(34,211,238,0.2)' : 'linear-gradient(135deg,#00f0ff,#7000ff)' }}
              whileHover={!loading ? { scale:1.02 } : {}} whileTap={!loading ? { scale:0.98 } : {}}>
              {loading ? 'Verifying...' : '🔍 Verify & Check-in'}
            </motion.button>
          </form>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              className="rounded-2xl p-6"
              style={{
                background: result.success ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${result.success ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              }}
              initial={{ opacity:0, y:20, scale:0.95 }}
              animate={{ opacity:1, y:0, scale:1 }}
              exit={{ opacity:0, y:-20, scale:0.95 }}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${result.success ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {result.success ? <IconCheck className="text-green-400" size={28} /> : <IconX className="text-red-400" size={28} />}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold mb-1 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                    {result.message}
                  </h3>
                  {result.data && (
                    <div className="space-y-1 mt-3">
                      <p className="text-white text-sm"><strong>Name:</strong> {result.data.name}</p>
                      <p className="text-gray-300 text-sm"><strong>Team:</strong> {result.data.team}</p>
                      <p className="text-gray-300 text-sm"><strong>College:</strong> {result.data.college}</p>
                      <p className="text-cyan-400 text-xs font-mono mt-2"><strong>ID:</strong> {result.data.uniqueId}</p>
                      {result.data.checkedInAt && (
                        <p className="text-gray-500 text-xs mt-1">
                          Checked in at {new Date(result.data.checkedInAt).toLocaleTimeString()} by {result.data.checkedInBy}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
