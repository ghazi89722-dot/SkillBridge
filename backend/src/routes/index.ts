import { Router } from 'express';
import authRoutes from './auth.routes';
import domainRoutes from './domain.routes';
import studentRoutes from './student.routes';
import assessmentRoutes from './assessment.routes';
import opportunityRoutes from './opportunity.routes';
import applicationRoutes from './application.routes';
import learningRoutes from './learning.routes';
import analyticsRoutes from './analytics.routes';
import collaborationRoutes from './collaboration.routes';
import feedbackRoutes from './feedback.routes';
import institutionRoutes from './institution.routes';
import roleRoutes from './role.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/', domainRoutes);
router.use('/students', studentRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/applications', applicationRoutes);
router.use('/learning', learningRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/collaborations', collaborationRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/institution', institutionRoutes);
router.use('/career-roles', roleRoutes);

export default router;
