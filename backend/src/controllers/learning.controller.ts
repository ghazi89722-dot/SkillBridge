import { Request, Response, NextFunction } from 'express';
import LearningResource from '../models/LearningResource';

export const getRecommendations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { skillId } = req.query;

    const filter: any = {};
    if (skillId) filter.skillId = skillId;

    const resources = await LearningResource.find(filter).populate('skillId');

    res.status(200).json({
      success: true,
      data: resources,
    });
  } catch (error) {
    next(error);
  }
};
