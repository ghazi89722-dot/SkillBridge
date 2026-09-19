import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import {
  getAssessmentForSkill,
  submitAssessment,
} from '../services/assessment.service';

export const getAssessment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { skillId } = req.params;
    const assessment = await getAssessmentForSkill(req.user!.id, skillId);

    res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (error: any) {
    if (error.message === 'Assessment not found for this skill' || error.message === 'Skill is not available in your selected domain') {
      res.status(404).json({
        success: false,
        data: null,
        error: { code: error.message.includes('domain') ? 'INVALID_DOMAIN_SKILL' : 'NOT_FOUND', message: error.message },
      });
      return;
    }
    next(error);
  }
};

export const submitStudentAssessment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.user!.id;
    const { id: assessmentId } = req.params;
    const { answers } = req.body;

    const result = await submitAssessment(studentId, assessmentId, answers);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
