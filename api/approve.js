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
          <div style="font-family:Arial,sans-serif;background:#020010;color:#e2e8f0;padding:40px;max-width:600px;margin:0 auto;border-radius:16px;border:1px solid rgba(139,92,246,0.3)">
            <div style="text-align:center;margin-bottom:24px">
              <h1 style="color:#a855f7;font-size:28px;margin:0">Game-o-thon 2K26</h1>
              <p style="color:#22d3ee;letter-spacing:0.2em;text-transform:uppercase;font-size:11px;margin:4px 0">Build The Game · Break The Limit</p>
            </div>

            <div style="background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.3);border-radius:12px;padding:20px;margin-bottom:20px">
              <h2 style="color:#a855f7;margin:0 0 6px">✅ Registration Approved!</h2>
              <p style="color:#e2e8f0;margin:0">Hi <strong>${reg.name}</strong>, you're officially registered for Game-o-thon 2K26!</p>
            </div>

            <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
              ${[
                ['Participant', reg.name],
                ['Email', reg.email],
                ['Phone', reg.phone],
                ['Branch', reg.branch],
                ['College', reg.collegeName],
                ['Team Name', reg.teamName],
                ['Team Members', reg.teamMembers.length ? reg.teamMembers.join(', ') : reg.name],
              ].map(([l, v]) => `
                <tr>
                  <td style="padding:7px 10px;color:rgba(139,92,246,0.7);font-size:11px;text-transform:uppercase;width:35%;border-bottom:1px solid rgba(255,255,255,0.05)">${l}</td>
                  <td style="padding:7px 10px;color:#e2e8f0;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.05)">${v}</td>
                </tr>
              `).join('')}
            </table>

            <div style="background:rgba(34,211,238,0.08);border:1px solid rgba(34,211,238,0.2);border-radius:12px;padding:16px;margin-bottom:20px;text-align:center">
              <p style="color:rgba(34,211,238,0.6);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 6px">Event Details</p>
              <p style="color:#e2e8f0;margin:3px 0">📅 <strong>22 April 2026</strong> — Final Presentation</p>
              <p style="color:#e2e8f0;margin:3px 0">📍 <strong>Zeal College, Pune</strong></p>
              <p style="color:#e2e8f0;margin:3px 0">⏰ <strong>Reporting Time: 9:00 AM</strong></p>
            </div>

            <!-- Unique ID + QR -->
            <div style="text-align:center;padding:20px;background:rgba(139,92,246,0.05);border-radius:12px;margin-bottom:20px;border:1px solid rgba(139,92,246,0.2)">
              <p style="color:#a855f7;font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.2em">Your Unique Entry ID</p>
              <p style="color:#22d3ee;font-size:26px;font-weight:900;margin:0 0 16px;letter-spacing:0.15em">${uniqueId}</p>
              <p style="color:#e2e8f0;font-size:12px;margin:0 0 12px">Scan this QR code at the venue for check-in</p>
              <img src="cid:qrcode" alt="Entry QR Code" style="width:200px;height:200px;border-radius:12px;border:3px solid rgba(139,92,246,0.5)" />
              <p style="color:rgba(139,92,246,0.5);font-size:10px;margin:10px 0 0">⚠️ Do not share this QR code with others</p>
            </div>

            <p style="color:rgba(139,92,246,0.5);font-size:11px;text-align:center;margin:0">
              © 2026 Game-o-thon 2K26 · ZIBACAR · In Collaboration with IIT Mandi
            </p>
          </div>
        `,
        attachments: [{
          filename: `GameOThon_${uniqueId}_QR.png`,
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
