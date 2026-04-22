import connectDB from './_db.js';
import Registration from './_model.js';
import Staff from './_staff.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  try {
    await connectDB();
    const { uniqueId, staffUsername, labNo } = req.body;

    if (!uniqueId) return res.status(400).json({ success: false, message: 'No QR data provided.' });

    // Parse QR data (could be JSON string or plain uniqueId)
    let parsedId = uniqueId;
    try {
      const parsed = JSON.parse(uniqueId);
      parsedId = parsed.uniqueId || uniqueId;
    } catch { parsedId = uniqueId; }

    const reg = await Registration.findOne({ uniqueId: parsedId });

    if (!reg) return res.status(404).json({ success: false, message: '❌ Participant not found. Invalid QR code.' });
    if (reg.status !== 'approved') return res.status(400).json({ success: false, message: '⚠️ Registration not approved.' });
    if (reg.checkedIn) return res.status(400).json({
      success: false,
      alreadyCheckedIn: true,
      message: `⚠️ Already checked in at ${new Date(reg.checkedInAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true })} IST by ${reg.checkedInBy}`,
      data: { name: reg.name, team: reg.teamName, uniqueId: reg.uniqueId, checkedInAt: reg.checkedInAt, checkedInBy: reg.checkedInBy },
    });

    reg.checkedIn   = true;
    reg.checkedInAt = new Date();
    reg.checkedInBy = staffUsername || 'Staff';
    reg.labNo       = labNo;
    // Auto-assign next presentation number for this lab
    const lastInLab = await Registration.findOne({ labNo, checkedIn: true }).sort({ presentationNo: -1 });
    reg.presentationNo = lastInLab?.presentationNo ? lastInLab.presentationNo + 1 : 1;
    await reg.save();

    const istTime = new Date(reg.checkedInAt).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    });

    // Send check-in confirmation email
    try {
      await transporter.sendMail({
        from: `"Game-o-thon 2K26" <${process.env.GMAIL_USER}>`,
        to: reg.email,
        subject: 'Your Lab & Presentation Number - Game-o-thon 2K26',
        html: `<div style="font-family:Arial,sans-serif;background:#06001a;color:#e2e8f0;padding:32px;max-width:520px;margin:0 auto;border-radius:16px;border:1px solid rgba(139,92,246,0.4)">
        <div style="height:4px;background:linear-gradient(90deg,#a855f7,#3b82f6,#22d3ee);border-radius:4px;margin-bottom:24px"></div>
        <h2 style="color:#a855f7;margin:0 0 4px">Game-o-thon 2K26</h2>
        <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0 0 24px">ZIBACAR &middot; 23 April 2026</p>
        <p style="color:#e2e8f0;margin:0 0 20px">Hi <strong>${reg.name}</strong>, you have been successfully checked in!</p>
        <div style="background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.3);border-radius:12px;padding:20px;margin-bottom:20px;text-align:center">
          <p style="color:rgba(139,92,246,0.6);font-size:10px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px">Your Presentation Details</p>
          <p style="color:#fff;font-size:32px;font-weight:900;margin:0 0 4px">Lab ${reg.labNo}</p>
          <p style="color:#22d3ee;font-size:22px;font-weight:900;margin:0">Presentation #${reg.presentationNo}</p>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px">
          <tr><td style="padding:6px 0;color:rgba(139,92,246,0.5);font-size:11px;text-transform:uppercase;width:40%">Team</td><td style="padding:6px 0;color:#e2e8f0;font-size:12px;font-weight:600">${reg.teamName}</td></tr>
          <tr><td style="padding:6px 0;color:rgba(139,92,246,0.5);font-size:11px;text-transform:uppercase">Check-in Time</td><td style="padding:6px 0;color:#e2e8f0;font-size:12px;font-weight:600">${istTime} IST</td></tr>
          <tr><td style="padding:6px 0;color:rgba(139,92,246,0.5);font-size:11px;text-transform:uppercase">Entry ID</td><td style="padding:6px 0;color:#22d3ee;font-size:12px;font-weight:600;font-family:monospace">${reg.uniqueId}</td></tr>
        </table>
        <div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:8px;padding:12px;margin-bottom:20px">
          <p style="color:#fbbf24;font-size:12px;font-weight:700;margin:0 0 6px">Important</p>
          <p style="color:#e2e8f0;font-size:12px;margin:0">&bull; Go to <strong>Lab ${reg.labNo}</strong> immediately</p>
          <p style="color:#e2e8f0;font-size:12px;margin:4px 0 0">&bull; You will present as <strong>Presentation #${reg.presentationNo}</strong></p>
          <p style="color:#e2e8f0;font-size:12px;margin:4px 0 0">&bull; Be ready before your turn</p>
        </div>
        <p style="color:rgba(139,92,246,0.4);font-size:10px;text-align:center;margin:0">&copy; 2026 Game-o-thon 2K26 &middot; ZIBACAR</p>
      </div>`,
      });
    } catch (mailErr) {
      console.error('Checkin email error:', mailErr.message);
    }

    res.json({
      success: true,
      message: `✅ Check-in successful! Time: ${istTime} IST`,
      data: {
        name:        reg.name,
        email:       reg.email,
        phone:       reg.phone,
        branch:      reg.branch,
        college:     reg.collegeName,
        team:        reg.teamName,
        members:     reg.teamMembers,
        uniqueId:    reg.uniqueId,
        labNo:          reg.labNo,
        presentationNo: reg.presentationNo,
        checkedInBy: reg.checkedInBy,
      },
    });
  } catch (err) {
    console.error('Checkin error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

