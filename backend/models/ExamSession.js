import mongoose from 'mongoose';

const examSessionSchema = new mongoose.Schema(
  {
    studentID: { type: String, required: true, index: true },
    examId: { type: String, required: true, index: true },
    status: { type: String, enum: ['active', 'submitted', 'terminated'], default: 'active' },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    violations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Violation' }],
    trustScore: { type: Number, default: 100 },
    questionOrder: [{ type: String }],
    clientMeta: {
      userAgent: String,
      ip: String,
      fingerprintHash: String
    }
  },
  { timestamps: true }
);

export default mongoose.model('ExamSession', examSessionSchema);
