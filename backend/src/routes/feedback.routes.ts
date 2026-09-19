import { Router } from 'express';
import {
  createFeedback,
  getFeedbackForStudent,
} from '../controllers/feedback.controller';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../config/constants';

const router = Router();

router.use(authMiddleware);

router.post(
  '/',
  requireRole(UserRole.INDUSTRY),
  createFeedback
);

router.get(
  '/student/:studentId',
  getFeedbackForStudent
);

export default router;
