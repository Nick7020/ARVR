import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  uniqueId:          { type: String, sparse: true },
  name:              { type: String, required: true, trim: true },
  email:             { type: String, required: true, trim: true, lowercase: true, unique: true },
  phone:             { type: String, required: true, trim: true },
  branch:            { type: String, required: true, trim: true },
  collegeName:       { type: String, required: true, trim: true },
  teamName:          { type: String, required: true, trim: true },
  teamSize:          { type: Number, default: 1 },
  teamMembers:       { type: [String], default: [] },
  paymentScreenshot: { type: String },
  status:            { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  rejectionReason:   { type: String, default: '' },
  ticketSent:        { type: Boolean, default: false },
  qrCode:            { type: String, default: '' },
  checkedIn:         { type: Boolean, default: false },
  checkedInAt:       { type: Date },
  checkedInBy:       { type: String, default: '' },
  createdAt:         { type: Date, default: Date.now },
  approvedAt:        { type: Date },
});

export default mongoose.models.Registration || mongoose.model('Registration', schema);

