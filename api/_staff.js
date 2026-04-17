import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name:     { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, default: 'checkin' },
  active:   { type: Boolean, default: true },
});

export default mongoose.models.Staff || mongoose.model('Staff', schema);

