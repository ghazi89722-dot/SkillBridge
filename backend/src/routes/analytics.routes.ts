import { Router } from 'express';
import {
  getInstitutionAnalytics,
  getMinistryAnalytics,
} from '../controllers/analytics.controller';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../config/constants';

const router = Router();

router.use(authMiddleware);

router.get(
  '/institution',
  requireRole(UserRole.INSTITUTION, UserRole.ADMIN),
  getInstitutionAnalytics
);

router.get(
  '/ministry',
  requireRole(UserRole.MINISTRY, UserRole.ADMIN),
  getMinistryAnalytics
);

export default router;
