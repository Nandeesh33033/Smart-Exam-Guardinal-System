import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    studentID: { type: String, unique: true, sparse: true, trim: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'auditor', 'admin'], default: 'student' },
    fingerprintHash: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
