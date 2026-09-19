import { Router } from 'express';
import {
  getDomains,
  getDomainById,
  getCategoriesByDomain,
  getSkillsByDomain,
  getAllSkills,
} from '../controllers/domain.controller';

const router = Router();

router.get('/domains', getDomains);
router.get('/domains/:id', getDomainById);
router.get('/domains/:domainId/categories', getCategoriesByDomain);
router.get('/domains/:domainId/skills', getSkillsByDomain);
router.get('/skills', getAllSkills);

export default router;
