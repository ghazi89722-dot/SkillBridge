import { Request, Response, NextFunction } from 'express';
import Opportunity from '../models/Opportunity';
import { AuthRequest } from '../types';
import { calculateMatch, getRankedCandidates } from '../services/matching.service';
import Skill from '../models/Skill';
import Domain from '../models/Domain';
import Role from '../models/Role';
import User from '../models/User';

export const createOpportunity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const industryId = req.user!.id;
    const { domainId, requiredSkills, roleId } = req.body;
    const domain = await Domain.findById(domainId);
    const skills = await Skill.find({
      _id: { $in: requiredSkills.map((skill: { skillId: string }) => skill.skillId) },
      domainId,
    }).select('_id');

    if (!domain || skills.length !== requiredSkills.length) {
      res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_DOMAIN_SKILLS', message: 'Opportunity skills must belong to its selected domain' },
      });
      return;
    }
    if (roleId && !(await Role.exists({ _id: roleId, domainId, isActive: true }))) {
      res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_ROLE', message: 'Opportunity role must belong to its selected domain' },
      });
      return;
    }

    const opportunityData = { ...req.body, industryId };

    const opportunity = await Opportunity.create(opportunityData);

    res.status(201).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    next(error);
  }
};

export const getOpportunities = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, status = 'open' } = req.query;

    const filter: any = { status };
    const user = req.user ? await User.findById(req.user.id).select('domainId role') : null;
    if (user?.role === 'student') filter.domainId = user.domainId;
    else if (req.query.domainId) filter.domainId = req.query.domainId;
    if (type) filter.type = type;

    const opportunities = await Opportunity.find(filter)
      .populate('industryId', 'name email profile')
      .populate('requiredSkills.skillId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: opportunities,
    });
  } catch (error) {
    next(error);
  }
};

export const getOpportunityById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('industryId', 'name email profile')
      .populate('requiredSkills.skillId');

    const user = req.user ? await User.findById(req.user.id).select('domainId role') : null;
    if (!opportunity || (user?.role === 'student' && opportunity.domainId.toString() !== user.domainId?.toString())) {
      res.status(404).json({
        success: false,
        data: null,
        error: { code: 'NOT_FOUND', message: 'Opportunity not found' },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    next(error);
  }
};

export const matchStudentOpportunity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.user!.id;
    const opportunityId = req.params.id;

    const matchResult = await calculateMatch(studentId, opportunityId);

    res.status(200).json({
      success: true,
      data: matchResult,
    });
  } catch (error) {
    next(error);
  }
};

export const getCandidates = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const opportunityId = req.params.id;
    const candidates = await getRankedCandidates(opportunityId);

    res.status(200).json({
      success: true,
      data: candidates,
    });
  } catch (error) {
    next(error);
  }
};
