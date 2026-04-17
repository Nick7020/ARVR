import connectDB from './_db.js';
import Registration from './_model.js';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function generateUniqueId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'GOT2K26-';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  try {
    await connectDB();
    const { id, action, reason } = req.body;

    const reg = await Registration.findById(id);
    if (!reg) return res.status(404).json({ success: false, message: 'Registration not found.' });

    if (action === 'approve') {
      // Generate unique ID
      const uniqueId = generateUniqueId();

      // Generate QR code as base64 image
      const qrData = JSON.stringify({ uniqueId, name: reg.name, team: reg.teamName, email: reg.email });
      const qrCodeBase64 = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      });

      reg.status    = 'approved';
      reg.approvedAt = new Date();
      reg.uniqueId  = uniqueId;
      reg.qrCode    = qrCodeBase64;
      reg.ticketSent = true;
      await reg.save();

      // Extract base64 for email attachment
      const qrBase64Data = qrCodeBase64.replace(/^data:image\/png;base64,/, '');

      await transporter.sendMail({
        from: `"Game-o-thon 2K26" <${process.env.GMAIL_USER}>`,
        to: reg.email,
        subject: '🎮 Registration Approved — Game-o-thon 2K26 | Your Entry Pass',
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#020010;font-family:Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:20px">

  <!-- Header -->
  <div style="text-align:center;padding:30px 0 20px">
    <h1 style="color:#a855f7;font-size:32px;margin:0;letter-spacing:2px">GAME-O-THON</h1>
    <p style="color:#22d3ee;font-size:13px;letter-spacing:4px;text-transform:uppercase;margin:4px 0">2K26</p>
    <p style="color:#6b7280;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:4px 0">Build The Game · Break The Limit</p>
  </div>

  <!-- Approved Banner -->
  <div style="background:linear-gradient(135deg,rgba(139,92,246,0.2),rgba(34,211,238,0.1));border:1px solid rgba(139,92,246,0.4);border-radius:16px;padding:20px;text-align:center;margin-bottom:20px">
    <div style="font-size:40px;margin-bottom:8px">✅</div>
    <h2 style="color:#a855f7;margin:0 0 6px;font-size:22px">Registration Approved!</h2>
    <p style="color:#e2e8f0;margin:0;font-size:14px">Hi <strong>${reg.name}</strong>, you're officially in!</p>
  </div>

  <!-- Entry Pass Card -->
  <div style="background:linear-gradient(135deg,#0a0020,#0d0030);border:2px solid rgba(139,92,246,0.5);border-radius:20px;overflow:hidden;margin-bottom:20px">
    
    <!-- Pass Header -->
    <div style="background:linear-gradient(90deg,#a855f7,#3b82f6,#22d3ee);height:5px"></div>
    <div style="padding:20px 24px;border-bottom:1px solid rgba(139,92,246,0.2)">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <p style="color:rgba(139,92,246,0.6);font-size:9px;letter-spacing:3px;text-transform:uppercase;margin:0">OFFICIAL ENTRY PASS</p>
          <h2 style="color:#ffffff;font-size:20px;margin:4px 0 0;font-weight:900">GAME-O-THON 2K26</h2>
        </div>
        <div style="text-align:right">
          <p style="color:rgba(34,211,238,0.5);font-size:9px;letter-spacing:2px;margin:0">TICKET ID</p>
          <p style="color:#22d3ee;font-size:13px;font-weight:900;margin:2px 0 0;letter-spacing:1px">GOT-2K26-${reg._id.toString().slice(-5).toUpperCase()}</p>
        </div>
      </div>
    </div>

    <!-- Pass Body -->
    <div style="padding:20px 24px;display:flex;gap:20px">
      
      <!-- Left: Details -->
      <div style="flex:1">
        <div style="margin-bottom:14px">
          <p style="color:rgba(139,92,246,0.5);font-size:9px;letter-spacing:2px;text-transform:uppercase;margin:0 0 3px">PARTICIPANT</p>
          <p style="color:#ffffff;font-size:20px;font-weight:900;margin:0">${reg.name}</p>
        </div>
        
        <table style="width:100%;border-collapse:collapse">
          ${[
            ['EMAIL', reg.email],
            ['PHONE', reg.phone],
            ['BRANCH', reg.branch],
            ['COLLEGE', reg.collegeName],
            ['TEAM', reg.teamName],
            ['MEMBERS', reg.teamMembers.length ? reg.teamMembers.join(', ') : reg.name],
          ].map(([l,v]) => `
          <tr>
            <td style="padding:4px 0;color:rgba(139,92,246,0.5);font-size:9px;letter-spacing:1px;text-transform:uppercase;width:30%;vertical-align:top">${l}</td>
            <td style="padding:4px 0;color:#e2e8f0;font-size:11px;font-weight:600">${v}</td>
          </tr>`).join('')}
        </table>

        <div style="margin-top:14px;padding:10px;background:rgba(34,211,238,0.08);border-radius:8px;border:1px solid rgba(34,211,238,0.2)">
          <p style="color:rgba(34,211,238,0.6);font-size:9px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px">EVENT INFO</p>
          <p style="color:#e2e8f0;font-size:11px;margin:2px 0">📅 <strong>22 April 2026</strong></p>
          <p style="color:#e2e8f0;font-size:11px;margin:2px 0">📍 <strong>Zeal College, Pune</strong></p>
          <p style="color:#e2e8f0;font-size:11px;margin:2px 0">⏰ <strong>9:00 AM onwards</strong></p>
        </div>
      </div>

      <!-- Right: QR Code -->
      <div style="text-align:center;flex-shrink:0">
        <p style="color:rgba(139,92,246,0.5);font-size:9px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px">SCAN FOR ENTRY</p>
        <img src="cid:qrcode" alt="Entry QR" style="width:150px;height:150px;border-radius:10px;border:2px solid rgba(139,92,246,0.5);display:block" />
        <p style="color:#22d3ee;font-size:11px;font-weight:900;margin:8px 0 2px;letter-spacing:1px">${uniqueId}</p>
        <p style="color:rgba(139,92,246,0.4);font-size:9px;margin:0">⚠️ Do not share</p>
      </div>
    </div>

    <!-- Pass Footer -->
    <div style="background:rgba(139,92,246,0.08);padding:12px 24px;border-top:1px solid rgba(139,92,246,0.2);text-align:center">
      <p style="color:#6b7280;font-size:10px;margin:0">In Collaboration with <strong style="color:#a855f7">IIT Mandi iHub</strong> · Sponsored by <strong style="color:#22d3ee">Vinsys IT Services</strong></p>
    </div>
    <div style="background:linear-gradient(90deg,#22d3ee,#3b82f6,#a855f7);height:3px"></div>
  </div>

  <!-- Instructions -->
  <div style="background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.2);border-radius:12px;padding:16px;margin-bottom:20px">
    <h3 style="color:#fbbf24;margin:0 0 10px;font-size:14px">📌 Important Instructions</h3>
    <ul style="color:#e2e8f0;font-size:12px;margin:0;padding-left:16px;line-height:1.8">
      <li>Bring this email or QR code to the venue</li>
      <li>Report by <strong>9:00 AM</strong> on 22 April 2026</li>
      <li>Carry your college ID card</li>
      <li>Bring your laptop with your game project</li>
      <li>Do not share your QR code with others</li>
    </ul>
  </div>

  <!-- Footer -->
  <p style="color:rgba(139,92,246,0.4);font-size:10px;text-align:center;margin:0">
    © 2026 Game-o-thon 2K26 · ZIBACAR · Zeal Education Society's
  </p>

</div>
</body>
</html>
        `,
        attachments: [{
          filename: `GameOThon_${uniqueId}_EntryPass.png`,
          content: qrBase64Data,
          encoding: 'base64',
          cid: 'qrcode',
        }],
      });

      res.json({ success: true, message: 'Approved! QR code sent via email.' });

    } else if (action === 'reject') {
      reg.status = 'rejected';
      reg.rejectionReason = reason || 'Payment verification failed.';
      await reg.save();

      await transporter.sendMail({
        from: `"Game-o-thon 2K26" <${process.env.GMAIL_USER}>`,
        to: reg.email,
        subject: '❌ Game-o-thon 2K26 — Registration Update',
        html: `
          <div style="font-family:Arial,sans-serif;background:#020010;color:#e2e8f0;padding:40px;max-width:600px;margin:0 auto;border-radius:16px;border:1px solid rgba(239,68,68,0.3)">
            <h1 style="color:#a855f7;font-size:28px;text-align:center;margin:0 0 20px">Game-o-thon 2K26</h1>
            <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:20px;margin-bottom:16px">
              <h2 style="color:#f87171;margin:0 0 8px">Registration Not Approved</h2>
              <p style="color:#e2e8f0;margin:0">Hi <strong>${reg.name}</strong>, your registration was not approved.</p>
              <p style="color:#fca5a5;margin:8px 0 0"><strong>Reason:</strong> ${reg.rejectionReason}</p>
            </div>
            <p style="color:#e2e8f0">Please re-register at <a href="https://arvrhackthon.vercel.app" style="color:#a855f7">arvrhackthon.vercel.app</a></p>
            <p style="color:rgba(139,92,246,0.5);font-size:11px;text-align:center">© 2026 Game-o-thon 2K26 · ZIBACAR</p>
          </div>
        `,
      });

      res.json({ success: true, message: 'Rejected and email sent.' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid action.' });
    }
  } catch (err) {
    console.error('Approve error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}
