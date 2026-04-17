import connectDB from './_db.js';
import Staff from './_staff.js';

const DEFAULT_STAFF = [
  { name: 'Staff Alpha',  username: 'staff1', password: 'checkin@1', role: 'checkin' },
  { name: 'Staff Beta',   username: 'staff2', password: 'checkin@2', role: 'checkin' },
  { name: 'Staff Gamma',  username: 'staff3', password: 'checkin@3', role: 'checkin' },
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  try {
    await connectDB();

    // Seed default staff if not exists
    for (const s of DEFAULT_STAFF) {
      await Staff.findOneAndUpdate({ username: s.username }, s, { upsert: true, new: true });
    }

    const { username, password } = req.body;
    const staff = await Staff.findOne({ username, password, active: true });

    if (!staff) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    res.json({ success: true, staff: { name: staff.name, username: staff.username, role: staff.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

