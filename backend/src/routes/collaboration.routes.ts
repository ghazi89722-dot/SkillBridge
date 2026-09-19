import { Router } from 'express';
import {
  createCollaboration,
  getCollaborations,
  expressInterest,
} from '../controllers/collaboration.controller';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../config/constants';

const router = Router();

router.use(authMiddleware);

router.post(
  '/',
  requireRole(UserRole.ACADEMICIAN, UserRole.INSTITUTION),
  createCollaboration
);

router.get('/', getCollaborations);

router.post(
  '/:id/interest',
  requireRole(UserRole.ACADEMICIAN),
  expressInterest
);

export default router;
