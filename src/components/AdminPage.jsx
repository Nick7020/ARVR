import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';

const API = import.meta.env.VITE_API_URL || 'https://arvrhackthon.vercel.app';
const ADMIN_PASSWORD = 'zibacar2026';

export default function AdminPage() {
  const [auth, setAuth]           = useState(false);
  const [pass, setPass]           = useState('');
  const [data, setData]           = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [tab, setTab]             = useState('pending');
  const [selected, setSelected]   = useState(null);
  const [ssModal, setSsModal]     = useState(null);
  const [actionLoading, setActionLoading] = useState('');
  const [rejectReason, setRejectReason]   = useState('');
  const [showReject, setShowReject]       = useState(false);

  const fetchData = async (status = tab) => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/registrations?status=${status}`);
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError('Failed to fetch.');
    } catch { setError('Cannot connect to server.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (auth) fetchData(tab); }, [auth, tab]);

  const fetchSS = async (id) => {
    try {
      const res  = await fetch(`${API}/api/registration?id=${id}`);
      const json = await res.json();
      if (json.success) setSsModal(json.data);
    } catch { alert('Failed to load.'); }
  };

  const handleApprove = async (id) => {
    setActionLoading(id + '_approve');
    try {
      const res  = await fetch(`${API}/api/approve`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'approve' }),
      });
      const json = await res.json();
      if (json.success) { alert('✅ Approved! QR + Email sent.'); fetchData(tab); setSsModal(null); }
      else alert('Error: ' + json.message);
    } catch { alert('Server error.'); }
    finally { setActionLoading(''); }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) return alert('Enter rejection reason.');
    setActionLoading(id + '_reject');
    try {
      const res  = await fetch(`${API}/api/approve`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'reject', reason: rejectReason }),
      });
      const json = await res.json();
      if (json.success) { alert('❌ Rejected. Email sent.'); setShowReject(false); setRejectReason(''); fetchData(tab); setSsModal(null); }
      else alert('Error: ' + json.message);
    } catch { alert('Server error.'); }
    finally { setActionLoading(''); }
  };

  const handleResetCheckin = async (id) => {
    if (!window.confirm('Reset check-in for this participant?')) return;
    try {
      const res  = await fetch(`${API}/api/reset-checkin`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.success) { fetchData(tab); }
      else alert('Error: ' + json.message);
    } catch { alert('Server error.'); }
  };

  const downloadExcel = () => {
    const rows = data.map((r,i) => ({
      'Sr.No': i+1, 'Name': r.name, 'Email': r.email, 'Phone': r.phone,
      'Branch': r.branch, 'College': r.collegeName, 'Team': r.teamName,
      'Members': Array.isArray(r.teamMembers) ? r.teamMembers.join(', ') : r.teamMembers,
      'Unique ID': r.uniqueId || '—',
      'Status': r.status,
      'Checked In': r.checkedIn ? 'Yes' : 'No',
      'Check-in Time': r.checkedInAt ? new Date(r.checkedInAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '—',
      'Checked By': r.checkedInBy || '—',
      'Registered On': new Date(r.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
    XLSX.writeFile(wb, `GameOThon_${tab}_registrations.xlsx`);
  };

  const filtered = data.filter(r =>
    [r.name, r.email, r.teamName, r.collegeName, r.uniqueId || ''].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const checkedInCount = data.filter(r => r.checkedIn).length;

  if (!auth) return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at center, #0d0025 0%, #020010 100%)' }}>
      <motion.div className="w-full max-w-sm rounded-3xl p-8"
        style={{ background: 'rgba(15,5,40,0.95)', border: '1px solid rgba(139,92,246,0.35)', boxShadow: '0 0 60px rgba(139,92,246,0.2)' }}
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="h-1 w-full rounded-full mb-6" style={{ background: 'linear-gradient(90deg,#a855f7,#3b82f6,#22d3ee)' }} />
        <h2 className="text-2xl font-black gradient-text mb-1">Admin Panel</h2>
        <p className="text-gray-500 text-sm mb-6">Game-o-thon 2K26 · ZIBACAR</p>
        <input type="password" placeholder="Enter admin password" value={pass}
          onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (pass === ADMIN_PASSWORD ? setAuth(true) : setError('Wrong password'))}
          className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none mb-3"
          style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)' }} />
        {error && <p className="text-red-400 text-xs mb-3">⚠ {error}</p>}
        <motion.button className="w-full py-3 rounded-xl font-bold text-white text-sm"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => pass === ADMIN_PASSWORD ? setAuth(true) : setError('Wrong password')}>
          Login
        </motion.button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: 'radial-gradient(ellipse at center, #0d0025 0%, #020010 100%)' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <h1 className="text-3xl font-black gradient-text">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Game-o-thon 2K26 · ZIBACAR</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <motion.a href="/staff" target="_blank"
              className="px-4 py-2.5 rounded-xl font-bold text-sm text-cyan-300 flex items-center gap-1"
              style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)' }}
              whileHover={{ scale: 1.04 }}>
              👥 Staff Panel
            </motion.a>
            <motion.button onClick={downloadExcel}
              className="px-4 py-2.5 rounded-xl font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              📥 Export Excel
            </motion.button>
            <motion.button onClick={() => fetchData(tab)}
              className="px-4 py-2.5 rounded-xl font-bold text-sm text-purple-300"
              style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)' }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              🔄 Refresh
            </motion.button>
          </div>
        </motion.div>

        {/* Stats row */}
        {tab === 'approved' && data.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {[
              ['Total Approved', data.length, '#a855f7'],
              ['Checked In', checkedInCount, '#10b981'],
              ['Not Checked In', data.length - checkedInCount, '#f59e0b'],
            ].map(([label, val, color]) => (
              <div key={label} className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(139,92,246,0.06)', border: `1px solid ${color}30` }}>
                <div className="text-2xl font-black" style={{ color }}>{val}</div>
                <div className="text-gray-400 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {['pending','approved','rejected','all'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${tab === t ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              style={{ background: tab === t ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
              {t === 'pending' ? '⏳' : t === 'approved' ? '✅' : t === 'rejected' ? '❌' : '📋'} {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <input type="text" placeholder="Search by name, email, team, unique ID..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-xl px-5 py-3 text-sm text-white placeholder-gray-600 outline-none mb-5"
          style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)' }} />

        {loading && (
          <div className="flex justify-center py-20">
            <motion.div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent"
              animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(139,92,246,0.15)', borderBottom: '1px solid rgba(139,92,246,0.2)' }}>
                    {['#','Name','Email','Phone','Team','Unique ID','Status','Check-in','Payment SS','Actions'].map(h => (
                      <th key={h} className="px-3 py-3 text-left text-xs font-bold text-purple-300 tracking-widest uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={10} className="text-center text-gray-500 py-16">No registrations found.</td></tr>
                  ) : filtered.map((r, i) => (
                    <motion.tr key={r._id}
                      style={{ borderBottom: '1px solid rgba(139,92,246,0.08)', background: i%2===0 ? 'rgba(139,92,246,0.03)' : 'transparent' }}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.02 }}>
                      <td className="px-3 py-3 text-gray-500 font-mono text-xs">{i+1}</td>
                      <td className="px-3 py-3 text-white font-semibold whitespace-nowrap">{r.name}</td>
                      <td className="px-3 py-3 text-cyan-400 whitespace-nowrap text-xs">{r.email}</td>
                      <td className="px-3 py-3 text-gray-300 whitespace-nowrap text-xs">{r.phone}</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(139,92,246,0.15)', color: '#a855f7', border: '1px solid rgba(139,92,246,0.3)' }}>{r.teamName}</span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="text-xs font-mono text-cyan-400/70">{r.uniqueId || '—'}</span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${r.status==='approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : r.status==='rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                          {r.status==='approved' ? '✅' : r.status==='rejected' ? '❌' : '⏳'} {r.status}
                        </span>
                      </td>
                      {/* Check-in status */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        {r.checkedIn ? (
                          <div className="flex flex-col gap-1">
                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                              ✅ Checked In
                            </span>
                            <span className="text-gray-500 text-[10px]">
                              {new Date(r.checkedInAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true })} · {r.checkedInBy}
                            </span>
                            <button onClick={() => handleResetCheckin(r._id)}
                              className="text-[10px] text-red-400/60 hover:text-red-400 transition-colors text-left">
                              ↩ Reset
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs">Not yet</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <button onClick={() => fetchSS(r._id)}
                          className="px-3 py-1 rounded-lg text-xs font-bold text-cyan-300 hover:text-white transition-colors"
                          style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
                          👁 View
                        </button>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {r.status === 'pending' ? (
                          <div className="flex gap-1">
                            <button onClick={() => handleApprove(r._id)} disabled={!!actionLoading}
                              className="px-2 py-1 rounded-lg text-xs font-bold text-white"
                              style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }}>
                              {actionLoading === r._id+'_approve' ? '...' : '✅'}
                            </button>
                            <button onClick={() => { setSelected(r._id); setShowReject(true); }}
                              className="px-2 py-1 rounded-lg text-xs font-bold text-white"
                              style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)' }}>
                              ❌
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-600 text-xs">—</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Screenshot Modal */}
      <AnimatePresence>
        {ssModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSsModal(null)}>
            <motion.div className="relative w-full max-w-lg rounded-2xl overflow-hidden"
              style={{ background: 'rgba(15,5,40,0.98)', border: '1px solid rgba(139,92,246,0.3)' }}
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-purple-500/20 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-bold">{ssModal.name}</h3>
                  <p className="text-gray-400 text-xs">{ssModal.email} · {ssModal.teamName}</p>
                  {ssModal.uniqueId && <p className="text-cyan-400 text-xs font-mono mt-1">{ssModal.uniqueId}</p>}
                </div>
                <button onClick={() => setSsModal(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
              </div>
              <div className="p-4">
                <p className="text-xs text-purple-400/60 uppercase tracking-widest mb-2">Payment Screenshot</p>
                {ssModal.paymentScreenshot
                  ? <img src={ssModal.paymentScreenshot} alt="Payment" className="w-full rounded-xl max-h-80 object-contain bg-black" />
                  : <p className="text-gray-500 text-sm text-center py-8">No screenshot available</p>
                }
              </div>
              {ssModal.status === 'pending' && (
                <div className="p-4 border-t border-purple-500/20 flex gap-3">
                  <button onClick={() => handleApprove(ssModal._id)} disabled={!!actionLoading}
                    className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
                    style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }}>
                    {actionLoading === ssModal._id+'_approve' ? 'Processing...' : '✅ Approve & Send QR Email'}
                  </button>
                  <button onClick={() => { setSelected(ssModal._id); setShowReject(true); }}
                    className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
                    style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)' }}>
                    ❌ Reject
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showReject && (
          <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="w-full max-w-sm rounded-2xl p-6"
              style={{ background: 'rgba(15,5,40,0.98)', border: '1px solid rgba(239,68,68,0.3)' }}
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h3 className="text-white font-bold mb-3">Rejection Reason</h3>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                placeholder="e.g. Payment screenshot unclear, wrong amount..."
                rows={3} className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none resize-none mb-4"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }} />
              <div className="flex gap-3">
                <button onClick={() => { setShowReject(false); setRejectReason(''); }}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-400 text-sm border border-gray-700">Cancel</button>
                <button onClick={() => handleReject(selected)} disabled={!!actionLoading}
                  className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
                  style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)' }}>
                  {actionLoading ? 'Sending...' : 'Reject & Email'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

