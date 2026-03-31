const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(express.json());

/* ── MongoDB connection with auto-reconnect ── */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB error:', err.message);
    setTimeout(connectDB, 5000); // retry after 5 sec
  }
};
connectDB();

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected. Reconnecting...');
  setTimeout(connectDB, 3000);
});

/* ── Registration Schema ── */
const registrationSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, trim: true, lowercase: true },
  phone:       { type: String, required: true, trim: true },
  branch:      { type: String, required: true, trim: true },
  collegeName: { type: String, required: true, trim: true },
  teamName:    { type: String, required: true, trim: true },
  teamMembers: { type: String, required: true, trim: true },
  createdAt:   { type: Date, default: Date.now },
});

const Registration = mongoose.model('Registration', registrationSchema);

/* ── Health check (UptimeRobot pings this) ── */
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'AR/VR Hackathon API running 🚀',
    time: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

/* ── POST /api/register ── */
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, branch, collegeName, teamName, teamMembers } = req.body;

    if (!name || !email || !phone || !branch || !collegeName || !teamName || !teamMembers) {
      return res.status(400).json({ success: false, message: '⚠️ All fields are required.' });
    }

    const existing = await Registration.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: '⚠️ This email is already registered! Each participant can only register once.' });
    }

    const registration = new Registration({ name, email, phone, branch, collegeName, teamName, teamMembers });
    await registration.save();

    res.status(201).json({ success: true, message: 'Registration successful! See you at the hackathon 🚀' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: '❌ Server error. Please try again.' });
  }
});

/* ── GET /api/registrations ── */
app.get('/api/registrations', async (req, res) => {
  try {
    const data = await Registration.find().sort({ createdAt: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/* ── Keep alive every 25 min ── */
setInterval(() => {
  console.log('🟢 Server alive -', new Date().toLocaleTimeString());
}, 25 * 60 * 1000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
