const connectDB     = require('./_db');
const Registration  = require('./_model');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  try {
    await connectDB();

    const { name, email, phone, branch, collegeName, teamName, teamMembers } = req.body;

    if (!name || !email || !phone || !branch || !collegeName || !teamName || !teamMembers) {
      return res.status(400).json({ success: false, message: '⚠️ All fields are required.' });
    }

    const existing = await Registration.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: '⚠️ This email is already registered!' });
    }

    await new Registration({ name, email, phone, branch, collegeName, teamName, teamMembers }).save();

    res.status(201).json({ success: true, message: 'Registration successful! See you at the hackathon 🚀' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '❌ Server error. Please try again.' });
  }
};
