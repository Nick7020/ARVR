module.exports = (req, res) => {
  res.json({ status: 'online', message: 'AR/VR Hackathon API 🚀', time: new Date().toISOString() });
};
