import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../config/constants';
import { getInstitutionDirectory, getInstitutionStudents } from '../controllers/institution.controller';

const router = Router();
router.get('/directory', getInstitutionDirectory);
router.use(authMiddleware, requireRole(UserRole.INSTITUTION, UserRole.ADMIN));
router.get('/students', getInstitutionStudents);

export default router;
