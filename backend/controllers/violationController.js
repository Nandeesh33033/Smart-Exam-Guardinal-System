import ExamSession from '../models/ExamSession.js';
import Violation from '../models/Violation.js';
import { calculateTrustScore } from '../services/trustScoreService.js';

export const logViolation = (io) => async (req, res) => {
  const { sessionId, studentID, type, duration = 0, metadata = {}, timestamp } = req.body;

  const session = await ExamSession.findById(sessionId).populate('violations');
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  const violation = await Violation.create({
    sessionId,
    studentID,
    type,
    duration,
    metadata,
    timestamp: timestamp || new Date()
  });

  session.violations.push(violation._id);
  const fullViolations = [...session.violations.filter((v) => typeof v === 'object'), violation];
  session.trustScore = calculateTrustScore(fullViolations);
  await session.save();

  io.emit('violation:new', {
    sessionId,
    studentID,
    violation,
    trustScore: session.trustScore
  });

  return res.status(201).json({ message: 'Violation logged', trustScore: session.trustScore });
};
