import { Router } from 'express';
import { getRecommendations } from '../controllers/learning.controller';

const router = Router();

router.get('/recommendations', getRecommendations);

export default router;
