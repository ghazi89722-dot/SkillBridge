import { Router } from 'express';
import {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  matchStudentOpportunity,
  getCandidates,
} from '../controllers/opportunity.controller';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../config/constants';
import { validate } from '../middleware/validate';
import { createOpportunitySchema } from '../validators';

const router = Router();

router.use(authMiddleware);

router.get('/', requireRole(UserRole.STUDENT, UserRole.INDUSTRY), getOpportunities);
router.get('/:id', requireRole(UserRole.STUDENT, UserRole.INDUSTRY), getOpportunityById);

router.post(
  '/',
  requireRole(UserRole.INDUSTRY, UserRole.ADMIN),
  validate(createOpportunitySchema),
  createOpportunity
);

router.post(
  '/:id/match',
  requireRole(UserRole.STUDENT),
  matchStudentOpportunity
);

router.get(
  '/:id/match',
  requireRole(UserRole.STUDENT),
  matchStudentOpportunity
);

router.get(
  '/:id/candidates',
  requireRole(UserRole.INDUSTRY, UserRole.ADMIN),
  getCandidates
);

export default router;
