import { Request, Response, NextFunction } from 'express';
import Domain from '../models/Domain';
import SkillCategory from '../models/SkillCategory';
import Skill from '../models/Skill';

export const getDomains = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const domains = await Domain.find();
    res.status(200).json({
      success: true,
      data: domains,
    });
  } catch (error) {
    next(error);
  }
};

export const getDomainById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const domain = await Domain.findById(req.params.id);
    if (!domain) {
      res.status(404).json({
        success: false,
        data: null,
        error: { code: 'NOT_FOUND', message: 'Domain not found' },
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: domain,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoriesByDomain = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await SkillCategory.find({ domainId: req.params.domainId });
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getSkillsByDomain = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const skills = await Skill.find({ domainId: req.params.domainId }).populate(
      'categoryId'
    );
    res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const skills = await Skill.find().populate('domainId').populate('categoryId');
    res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};
