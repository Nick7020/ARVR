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
<body style="margin:0;padding:0;background:#06001a;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#06001a">
<tr><td align="center" style="padding:20px 10px">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:linear-gradient(160deg,#06001a,#0a0030,#04000f);border:1px solid rgba(139,92,246,0.4);border-radius:16px;overflow:hidden">

  <!-- Top bar -->
  <tr><td style="background:linear-gradient(90deg,#a855f7,#3b82f6,#22d3ee);height:5px;font-size:0">&nbsp;</td></tr>

  <!-- Header -->
  <tr><td style="padding:20px 24px;border-bottom:1px solid rgba(139,92,246,0.2)">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="52" style="vertical-align:middle">
          <img src="https://arvrhackthon.vercel.app/logo.webp" width="48" height="48" style="border-radius:50%;border:2px solid rgba(139,92,246,0.7);display:block" alt="logo" />
        </td>
        <td style="padding-left:12px;vertical-align:middle">
          <p style="color:rgba(139,92,246,0.6);font-size:9px;letter-spacing:2px;text-transform:uppercase;margin:0 0 2px">Zeal Education Society's</p>
          <p style="color:#fff;font-size:12px;font-weight:800;margin:0 0 1px">ZIBACAR &middot; Game-o-thon 2K26</p>
          <p style="color:rgba(255,255,255,0.5);font-size:9px;margin:0">Zeal Institute of Business Administration, Computer Application and Research</p>
        </td>
        <td style="text-align:right;vertical-align:middle;white-space:nowrap">
          <p style="color:rgba(34,211,238,0.5);font-size:8px;letter-spacing:1px;margin:0 0 2px">TICKET ID</p>
          <p style="color:#22d3ee;font-size:11px;font-weight:900;margin:0">GOT-2K26-${reg._id.toString().slice(-5).toUpperCase()}</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Event Title -->
  <tr><td style="padding:16px 24px;border-bottom:1px solid rgba(139,92,246,0.15)">
    <p style="color:rgba(139,92,246,0.5);font-size:9px;letter-spacing:3px;text-transform:uppercase;margin:0 0 4px">OFFICIAL ENTRY PASS</p>
    <h1 style="color:#ffffff;font-size:26px;font-weight:900;margin:0 0 4px;line-height:1">GAME-O-THON 2K26</h1>
    <p style="color:#22d3ee;font-size:10px;margin:0;letter-spacing:3px;text-transform:uppercase">Build The Game &middot; Break The Limit</p>
  </td></tr>

  <!-- Approved Banner -->
  <tr><td style="padding:14px 24px;background:rgba(139,92,246,0.08);border-bottom:1px solid rgba(139,92,246,0.15)">
    <p style="color:#a855f7;font-size:16px;font-weight:900;margin:0 0 4px">✅ Registration Approved!</p>
    <p style="color:#e2e8f0;font-size:13px;margin:0">Hi <strong>${reg.name}</strong>, you're officially in for Game-o-thon 2K26!</p>
  </td></tr>

  <!-- Participant Details -->
  <tr><td style="padding:16px 24px;border-bottom:1px solid rgba(139,92,246,0.15)">
    <p style="color:rgba(139,92,246,0.5);font-size:8px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px">PARTICIPANT</p>
    <p style="color:#ffffff;font-size:22px;font-weight:900;margin:0 0 14px">${reg.name}</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${[
        ['EMAIL', reg.email],
        ['PHONE', reg.phone],
        ['BRANCH', reg.branch],
        ['COLLEGE', reg.collegeName],
        ['TEAM', reg.teamName],
        ['MEMBERS', reg.teamMembers.length ? reg.teamMembers.join(', ') : reg.name],
      ].map(([l,v]) => `
      <tr>
        <td style="padding:5px 0;color:rgba(139,92,246,0.5);font-size:9px;letter-spacing:1px;text-transform:uppercase;width:25%;vertical-align:top">${l}</td>
        <td style="padding:5px 0;color:#e2e8f0;font-size:12px;font-weight:600">${v}</td>
      </tr>`).join('')}
    </table>
  </td></tr>

  <!-- QR Code -->
  <tr><td style="padding:20px 24px;text-align:center;border-bottom:1px solid rgba(139,92,246,0.15)">
    <p style="color:rgba(139,92,246,0.5);font-size:9px;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px">YOUR UNIQUE ENTRY ID</p>
    <p style="color:#22d3ee;font-size:24px;font-weight:900;margin:0 0 14px;letter-spacing:2px">${uniqueId}</p>
    <p style="color:#e2e8f0;font-size:12px;margin:0 0 12px">Show this QR code at the venue entrance for check-in</p>
    <img src="cid:qrcode" width="180" height="180" style="border-radius:12px;border:2px solid rgba(139,92,246,0.5);display:inline-block" alt="Entry QR Code" />
    <p style="color:rgba(239,68,68,0.7);font-size:10px;margin:10px 0 0">⚠️ Do not share this QR code with anyone</p>
  </td></tr>

  <!-- Event Info -->
  <tr><td style="padding:16px 24px;border-bottom:1px solid rgba(139,92,246,0.15)">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="text-align:center;padding:8px">
          <p style="font-size:20px;margin:0 0 4px">📅</p>
          <p style="color:rgba(139,92,246,0.5);font-size:8px;letter-spacing:1px;text-transform:uppercase;margin:0 0 2px">DATE</p>
          <p style="color:#e2e8f0;font-size:11px;font-weight:700;margin:0">23 April 2026</p>
        </td>
        <td style="text-align:center;padding:8px;background:rgba(34,211,238,0.06);border-radius:8px">
          <p style="font-size:20px;margin:0 0 4px">📍</p>
          <p style="color:rgba(139,92,246,0.5);font-size:8px;letter-spacing:1px;text-transform:uppercase;margin:0 0 2px">VENUE</p>
          <p style="color:#e2e8f0;font-size:11px;font-weight:700;margin:0">Zeal College, Pune</p>
        </td>
        <td style="text-align:center;padding:8px">
          <p style="font-size:20px;margin:0 0 4px">⏰</p>
          <p style="color:rgba(139,92,246,0.5);font-size:8px;letter-spacing:1px;text-transform:uppercase;margin:0 0 2px">TIME</p>
          <p style="color:#e2e8f0;font-size:11px;font-weight:700;margin:0">9:00 AM onwards</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Instructions -->
  <tr><td style="padding:16px 24px;border-bottom:1px solid rgba(139,92,246,0.15)">
    <p style="color:#fbbf24;font-size:12px;font-weight:700;margin:0 0 8px">📌 Important Instructions</p>
    <table cellpadding="0" cellspacing="0">
      ${[
        'Bring this email / QR code to the venue',
        'Report by 9:00 AM on 23 April 2026',
        'Carry your college ID card',
        'Bring your laptop with your game project',
        'Do NOT share your QR code with others',
      ].map(i => `<tr><td style="padding:3px 0;color:#e2e8f0;font-size:12px">&bull; ${i}</td></tr>`).join('')}
    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:14px 24px;text-align:center;background:rgba(139,92,246,0.05)">
    <p style="color:rgba(139,92,246,0.5);font-size:10px;margin:0">In Collaboration with <strong style="color:#a855f7">IIT Mandi iHub</strong> &middot; Sponsored by <strong style="color:#22d3ee">Vinsys IT Services</strong></p>
    <p style="color:rgba(139,92,246,0.3);font-size:9px;margin:6px 0 0">&copy; 2026 Game-o-thon 2K26 &middot; ZIBACAR &middot; Zeal Education Society's</p>
  </td></tr>

  <!-- Bottom bar -->
  <tr><td style="background:linear-gradient(90deg,#22d3ee,#3b82f6,#a855f7);height:4px;font-size:0">&nbsp;</td></tr>

</table>
</td></tr>
</table>
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

