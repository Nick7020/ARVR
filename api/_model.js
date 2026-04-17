import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  email:            { type: String, required: true, trim: true, lowercase: true },
  phone:            { type: String, required: true, trim: true },
  branch:           { type: String, required: true, trim: true },
  collegeName:      { type: String, required: true, trim: true },
  teamName:         { type: String, required: true, trim: true },
  teamSize:         { type: Number, default: 1 },
  teamMembers:      { type: [String], default: [] },
  paymentScreenshot: { type: String, required: true },
  status:           { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason:  { type: String, default: '' },
  ticketSent:       { type: Boolean, default: false },
  createdAt:        { type: Date, default: Date.now },
  approvedAt:       { type: Date },
});

export default mongoose.models.Registration || mongoose.model('Registration', schema);
