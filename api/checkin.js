import connectDB from './_db.js';
import Registration from './_model.js';
import Staff from './_staff.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  try {
    await connectDB();
    const { uniqueId, staffUsername } = req.body;

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
    await reg.save();

    const istTime = new Date(reg.checkedInAt).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    });

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
        checkedInAt: reg.checkedInAt,
        checkedInBy: reg.checkedInBy,
      },
    });
  } catch (err) {
    console.error('Checkin error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

