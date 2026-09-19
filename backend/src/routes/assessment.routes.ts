import { Router } from 'express';
import {
  getAssessment,
  submitStudentAssessment,
} from '../controllers/assessment.controller';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../config/constants';
import { assessmentLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validate';
import { submitAssessmentSchema } from '../validators';

const router = Router();

router.use(authMiddleware);

router.get(
  '/skill/:skillId',
  requireRole(UserRole.STUDENT),
  getAssessment
);

router.post(
  '/:id/submit',
  requireRole(UserRole.STUDENT),
  assessmentLimiter,
  validate(submitAssessmentSchema),
  submitStudentAssessment
);

export default router;
