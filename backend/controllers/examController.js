import { v4 as uuidv4 } from 'uuid';
import ExamSession from '../models/ExamSession.js';
import Violation from '../models/Violation.js';
import { calculateTrustScore, summarizeViolations } from '../services/trustScoreService.js';

const shuffle = (arr = []) => [...arr].sort(() => Math.random() - 0.5);

export const startExamSession = async (req, res) => {
  const { examId, questions = [] } = req.body;
  const studentID = req.user.studentID || req.body.studentID || uuidv4();

  const session = await ExamSession.create({
    studentID,
    examId,
    questionOrder: shuffle(questions),
    clientMeta: {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      fingerprintHash: req.body.fingerprintHash
    }
  });

  res.status(201).json(session);
};

export const completeSession = async (req, res) => {
  const session = await ExamSession.findById(req.params.sessionId).populate('violations');
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  session.endTime = new Date();
  session.status = 'submitted';
  session.trustScore = calculateTrustScore(session.violations);
  await session.save();

  return res.status(200).json({
    sessionId: session._id,
    studentID: session.studentID,
    trustScore: session.trustScore,
    violationCounts: summarizeViolations(session.violations)
  });
};

export const getAuditorOverview = async (_req, res) => {
  const sessions = await ExamSession.find().populate('violations').sort({ createdAt: -1 }).lean();

  const report = sessions.map((session) => ({
    sessionId: session._id,
    studentID: session.studentID,
    examId: session.examId,
    trustScore: calculateTrustScore(session.violations),
    status: session.status,
    violationCounts: summarizeViolations(session.violations),
    timeline: session.violations.map((v) => ({ type: v.type, timestamp: v.timestamp, duration: v.duration }))
  }));

  return res.status(200).json(report);
};

export const getSessionViolations = async (req, res) => {
  const violations = await Violation.find({ sessionId: req.params.sessionId }).sort({ timestamp: 1 });
  return res.status(200).json(violations);
};
