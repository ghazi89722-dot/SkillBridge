import { Router } from 'express';
import { register, login, getMe, updateDomain } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema, updateDomainSchema } from '../validators';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', authMiddleware, getMe);
router.patch('/domain', authMiddleware, validate(updateDomainSchema), updateDomain);

export default router;
