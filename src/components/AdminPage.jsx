import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';

const API = import.meta.env.VITE_API_URL || '';
const ADMIN_PASSWORD = 'zibacar2026'; // simple frontend guard

export default function AdminPage() {
  const [auth, setAuth]         = useState(false);
  const [pass, setPass]         = useState('');
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/registrations`);
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError('Failed to fetch data.');
    } catch {
      setError('Cannot connect to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (auth) fetchData(); }, [auth]);

  const downloadExcel = () => {
    const rows = data.map((r, i) => ({
      'Sr.No':        i + 1,
      'Name':         r.name,
      'Email':        r.email,
      'Phone':        r.phone,
      'Branch':       r.branch,
      'College':      r.collegeName,
      'Team Name':    r.teamName,
      'Team Members': r.teamMembers,
      'Registered On': new Date(r.createdAt).toLocaleString(),
    }));
    const ws  = XLSX.utils.json_to_sheet(rows);
    const wb  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
    XLSX.writeFile(wb, 'ARVR_Hackathon_Registrations.xlsx');
  };

  const filtered = data.filter(r =>
    [r.name, r.email, r.teamName, r.collegeName, r.branch]
      .join(' ').toLowerCase().includes(search.toLowerCase())
  );

  /* ── Login screen ── */
  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'radial-gradient(ellipse at center, #0d0025 0%, #020010 100%)' }}>
        <motion.div
          className="w-full max-w-sm rounded-3xl p-8"
          style={{ background: 'rgba(15,5,40,0.95)', border: '1px solid rgba(139,92,246,0.35)', boxShadow: '0 0 60px rgba(139,92,246,0.2)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="h-1 w-full rounded-full mb-6" style={{ background: 'linear-gradient(90deg, #a855f7, #3b82f6, #22d3ee)' }} />
          <h2 className="text-2xl font-black gradient-text mb-1">Admin Panel</h2>
          <p className="text-gray-500 text-sm mb-6">AR/VR Hackathon 2026</p>
          <input
            type="password"
            placeholder="Enter admin password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (pass === ADMIN_PASSWORD ? setAuth(true) : setError('Wrong password'))}
            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none mb-3"
            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)' }}
          />
          {error && <p className="text-red-400 text-xs mb-3">⚠ {error}</p>}
          <motion.button
            className="w-full py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => pass === ADMIN_PASSWORD ? setAuth(true) : setError('Wrong password')}
          >
            Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  /* ── Admin dashboard ── */
  return (
    <div className="min-h-screen px-4 py-10"
      style={{ background: 'radial-gradient(ellipse at center, #0d0025 0%, #020010 100%)' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <h1 className="text-3xl font-black gradient-text">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">AR/VR Hackathon 2026 · ZIBACAR</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee' }}>
              Total: {data.length} Teams
            </div>
            <motion.button
              onClick={downloadExcel}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              📥 Download Excel
            </motion.button>
            <motion.button
              onClick={fetchData}
              className="px-4 py-2.5 rounded-xl font-bold text-sm text-purple-300"
              style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              🔄 Refresh
            </motion.button>
          </div>
        </motion.div>

        {/* Search */}
        <motion.input
          type="text"
          placeholder="Search by name, email, team, college..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-xl px-5 py-3 text-sm text-white placeholder-gray-600 outline-none mb-6"
          style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        />

        {/* Loading / Error */}
        {loading && (
          <div className="flex justify-center py-20">
            <motion.div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent"
              animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
          </div>
        )}
        {error && <p className="text-red-400 text-center py-10">⚠ {error}</p>}

        {/* Table */}
        {!loading && !error && (
          <motion.div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(139,92,246,0.2)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(139,92,246,0.15)', borderBottom: '1px solid rgba(139,92,246,0.2)' }}>
                    {['#', 'Name', 'Email', 'Phone', 'Branch', 'College', 'Team Name', 'Members', 'Date'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-purple-300 tracking-widest uppercase whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center text-gray-500 py-16">No registrations found.</td>
                    </tr>
                  ) : (
                    filtered.map((r, i) => (
                      <motion.tr
                        key={r._id}
                        style={{ borderBottom: '1px solid rgba(139,92,246,0.08)', background: i % 2 === 0 ? 'rgba(139,92,246,0.03)' : 'transparent' }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        whileHover={{ background: 'rgba(139,92,246,0.08)' }}
                      >
                        <td className="px-4 py-3 text-gray-500 font-mono">{i + 1}</td>
                        <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">{r.name}</td>
                        <td className="px-4 py-3 text-cyan-400 whitespace-nowrap">{r.email}</td>
                        <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{r.phone}</td>
                        <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{r.branch}</td>
                        <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{r.collegeName}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-full text-xs font-bold"
                            style={{ background: 'rgba(139,92,246,0.15)', color: '#a855f7', border: '1px solid rgba(139,92,246,0.3)' }}>
                            {r.teamName}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 max-w-[180px] truncate">{r.teamMembers}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
