const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const crypto   = require('crypto');
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');
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
  teamSize:    { type: Number, required: true },
  teamMembers: { type: [String], default: [] },
  amountPaid:  { type: Number, required: true },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String, required: true },
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

/* ── Razorpay Setup ── */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

/* ── POST /api/create-order ── */
app.post('/api/create-order', async (req, res) => {
  try {
    const { teamSize } = req.body;
    let amount = 50;
    if (teamSize > 1) {
      amount = 100;
    }

    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpay.orders.create(options);
    if (!order) return res.status(500).json({ success: false, message: 'Some error occurred' });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ── Nodemailer setup ── */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ── POST /api/register ── */
app.post('/api/register', async (req, res) => {
  try {
    const { 
      name, email, phone, branch, collegeName, teamName, teamSize, teamMembers,
      razorpayPaymentId, razorpayOrderId, razorpaySignature 
    } = req.body;

    if (!name || !email || !phone || !branch || !collegeName || !teamName || !teamSize || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({ success: false, message: '⚠️ All fields are required.' });
    }

    // Verify payment signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret');
    hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: '⚠️ Payment verification failed.' });
    }

    const existing = await Registration.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: '⚠️ This email is already registered! Each participant can only register once.' });
    }

    const amountPaid = teamSize > 1 ? 100 : 50;
    const registration = new Registration({ 
      name, email, phone, branch, collegeName, teamName, teamSize, teamMembers, amountPaid, razorpayOrderId, razorpayPaymentId 
    });
    await registration.save();

    // Send success email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Registration Successful - AR/VR Hackathon 2026',
      html: `
        <h2>Welcome to AR/VR Hackathon 2026!</h2>
        <p>Hi ${name},</p>
        <p>Your registration for team <strong>${teamName}</strong> was successful.</p>
        <p><strong>Amount Paid:</strong> ₹${amountPaid}</p>
        <p><strong>Payment ID:</strong> ${razorpayPaymentId}</p>
        <p>We look forward to seeing you there!</p>
      `,
    };
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
      } else {
        console.log('Skipped sending email because EMAIL_USER or EMAIL_PASS not set');
      }
    } catch(err) {
      console.error('Email sending failed:', err);
    }

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
