import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  completeSession,
  getAuditorOverview,
  getSessionViolations,
  startExamSession
} from '../controllers/examController.js';

const router = Router();

router.post('/sessions/start', authMiddleware(['student', 'admin']), startExamSession);
router.post('/sessions/:sessionId/complete', authMiddleware(['student', 'admin']), completeSession);
router.get('/auditor/overview', authMiddleware(['auditor', 'admin']), getAuditorOverview);
router.get('/sessions/:sessionId/violations', authMiddleware(['auditor', 'admin', 'student']), getSessionViolations);

export default router;
