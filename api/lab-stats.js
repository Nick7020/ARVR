import connectDB from './_db.js';
import Registration from './_model.js';

const LAB_CAPACITY = 40; // max per lab

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ success: false });

  try {
    await connectDB();
    const counts = await Registration.aggregate([
      { $match: { checkedIn: true, labNo: { $in: [1, 2, 3] } } },
      { $group: { _id: '$labNo', count: { $sum: 1 } } },
    ]);

    const labs = [1, 2, 3].map(n => {
      const found = counts.find(c => c._id === n);
      const filled = found ? found.count : 0;
      return { lab: n, filled, capacity: LAB_CAPACITY, remaining: LAB_CAPACITY - filled };
    });

    res.json({ success: true, labs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
