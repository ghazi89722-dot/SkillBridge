import { Router } from 'express';
import {
  claimSkills,
  getStudentSkills,
  getStudentPassport,
  getSkillGapAnalysis,
  getTargetRoles,
  setTargetRole,
  getTargetRoleReadiness,
  uploadResume,
  getStudentResume,
} from '../controllers/student.controller';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '../config/constants';
import { validate } from '../middleware/validate';
import { claimSkillsSchema } from '../validators';

const router = Router();

router.use(authMiddleware);

router.post(
  '/skills/claim',
  requireRole(UserRole.STUDENT),
  validate(claimSkillsSchema),
  claimSkills
);

router.get('/skills', requireRole(UserRole.STUDENT), getStudentSkills);
router.get('/target-roles', requireRole(UserRole.STUDENT), getTargetRoles);
router.get('/target-role/readiness', requireRole(UserRole.STUDENT), getTargetRoleReadiness);
router.post('/resume', requireRole(UserRole.STUDENT), uploadResume);
router.get('/resume', requireRole(UserRole.STUDENT), getStudentResume);
router.patch('/target-role', requireRole(UserRole.STUDENT), setTargetRole);
router.get('/:id/skills', getStudentSkills);
router.get('/:id/passport', getStudentPassport);
router.get('/:id/skill-gap', getSkillGapAnalysis);
router.get('/:id/resume', getStudentResume);

export default router;
