import { Router } from 'express';
import {
  applyForOpportunity,
  getMyApplications,
  getApplicationsByOpportunity,
  updateApplicationStatus,
} from '../controllers/application.controller';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../config/constants';
import { validate } from '../middleware/validate';
import { updateApplicationStatusSchema } from '../validators';

const router = Router();

router.use(authMiddleware);

router.post(
  '/',
  requireRole(UserRole.STUDENT),
  applyForOpportunity
);

router.get(
  '/my',
  requireRole(UserRole.STUDENT),
  getMyApplications
);

router.get(
  '/opportunity/:opportunityId',
  requireRole(UserRole.INDUSTRY, UserRole.ADMIN),
  getApplicationsByOpportunity
);

router.patch(
  '/:id/status',
  requireRole(UserRole.INDUSTRY, UserRole.ADMIN),
  validate(updateApplicationStatusSchema),
  updateApplicationStatus
);

export default router;
