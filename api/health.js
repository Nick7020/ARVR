export default function handler(req, res) {
  res.json({ status: 'online', message: 'AR/VR Hackathon API 🚀', time: new Date().toISOString() });
}

