import connectDB from './_db.js';
import Registration from './_model.js';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  try {
    await connectDB();
    const { name, email, phone, branch, collegeName, teamName, teamSize, teamMembers, paymentScreenshot } = req.body;

    if (!name || !email || !phone || !branch || !collegeName || !teamName || !paymentScreenshot) {
      return res.status(400).json({ success: false, message: '⚠️ All fields including payment screenshot are required.' });
    }

    const existing = await Registration.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: '⚠️ This email is already registered!' });
    }

    const membersArray = Array.isArray(teamMembers)
      ? teamMembers
      : (teamMembers || '').split(',').map(m => m.trim()).filter(Boolean);

    await new Registration({
      name, email, phone, branch, collegeName,
      teamName, teamSize: teamSize || 1,
      teamMembers: membersArray,
      paymentScreenshot,
      status: 'pending',
    }).save();

    res.status(201).json({ success: true, message: 'Registration submitted! Awaiting admin approval. 🚀' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: '❌ Server error: ' + err.message });
  }
}

