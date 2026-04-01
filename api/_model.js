import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, trim: true, lowercase: true },
  phone:       { type: String, required: true, trim: true },
  branch:      { type: String, required: true, trim: true },
  collegeName: { type: String, required: true, trim: true },
  teamName:    { type: String, required: true, trim: true },
  teamMembers: { type: String, required: true, trim: true },
  createdAt:   { type: Date, default: Date.now },
});

export default mongoose.models.Registration || mongoose.model('Registration', schema);
