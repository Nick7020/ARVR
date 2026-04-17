import connectDB from './_db.js';
import Registration from './_model.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  try {
    await connectDB();
    const { id } = req.body;
    const reg = await Registration.findById(id);
    if (!reg) return res.status(404).json({ success: false, message: 'Not found.' });

    reg.checkedIn   = false;
    reg.checkedInAt = null;
    reg.checkedInBy = '';
    await reg.save();

    res.json({ success: true, message: 'Check-in reset successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

