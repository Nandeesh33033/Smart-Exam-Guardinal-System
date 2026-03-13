import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { logViolation } from '../controllers/violationController.js';

const buildViolationRoutes = (io) => {
  const router = Router();
  router.post('/', authMiddleware(['student', 'admin']), logViolation(io));
  return router;
};

export default buildViolationRoutes;
