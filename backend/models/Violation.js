import mongoose from 'mongoose';

const violationSchema = new mongoose.Schema(
  {
    studentID: { type: String, required: true, index: true },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamSession', required: true },
    type: { type: String, required: true, index: true },
    duration: { type: Number, default: 0 },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('Violation', violationSchema);
