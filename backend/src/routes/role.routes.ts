import { Router } from 'express';
import { getCareerRole, getCareerRoles } from '../controllers/role.controller';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../config/constants';

const router = Router();
router.use(authMiddleware, requireRole(UserRole.STUDENT, UserRole.INDUSTRY));
router.get('/', getCareerRoles);
router.get('/:id', getCareerRole);
export default router;
