import { Response, NextFunction } from 'express';
import SkillResult from '../models/SkillResult';
import { AuthRequest } from '../types';
import { SkillStatus, VerificationSource } from '../config/constants';
import { analyzeSkillGap } from '../services/skillGap.service';
import User from '../models/User';
import Skill from '../models/Skill';
import Opportunity from '../models/Opportunity';
import Role from '../models/Role';
import LearningResource from '../models/LearningResource';
import Application from '../models/Application';

const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;

const getResumeDataUrl = (resume: any): string => {
  if (!resume?.data) {
    return '';
  }

  return `data:${resume.contentType || 'application/pdf'};base64,${Buffer.from(resume.data).toString('base64')}`;
};

const normalizeResumePayload = (reqBody: any) => {
  const filename = typeof reqBody?.filename === 'string' ? reqBody.filename.trim() : '';
  const contentType = typeof reqBody?.contentType === 'string' ? reqBody.contentType.trim() : 'application/pdf';
  const fileData = typeof reqBody?.fileData === 'string' ? reqBody.fileData : '';
  const size = typeof reqBody?.size === 'number' ? reqBody.size : 0;

  return { filename, contentType, fileData, size };
};

export const claimSkills = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.user!.id;
    const { skillIds } = req.body;
    const uniqueSkillIds = [...new Set(skillIds as string[])];
    const student = await User.findById(studentId).select('domainId');

    if (!student?.domainId) {
      res.status(400).json({
        success: false,
        data: null,
        error: { code: 'DOMAIN_REQUIRED', message: 'Select a domain before claiming skills' },
      });
      return;
    }

    const validSkills = await Skill.find({
      _id: { $in: uniqueSkillIds },
      domainId: student.domainId,
    }).select('_id');

    if (validSkills.length !== uniqueSkillIds.length) {
      res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_DOMAIN_SKILLS', message: 'All claimed skills must belong to your selected domain' },
      });
      return;
    }

    const results = [];

    for (const skillId of uniqueSkillIds) {
      // Upsert skill result
      let skillResult = await SkillResult.findOne({ studentId, skillId });

      if (!skillResult) {
        skillResult = await SkillResult.create({
          studentId,
          skillId,
          status: SkillStatus.CLAIMED,
          score: 0,
          verificationSource: VerificationSource.SELF_DECLARED,
          history: [
            {
              score: 0,
              status: SkillStatus.CLAIMED,
              assessedAt: new Date(),
            },
          ],
        });
      }

      results.push(skillResult);
    }

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentSkills = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.user!.role === 'student' ? req.user!.id : (req.params.id || req.user!.id);

    const student = await User.findById(studentId).select('domainId');
    const domainSkills = student?.domainId ? await Skill.find({ domainId: student.domainId }).select('_id') : [];
    const skills = await SkillResult.find({ studentId, skillId: { $in: domainSkills.map((skill) => skill._id) } })
      .populate({
        path: 'skillId',
        populate: { path: 'categoryId' },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentPassport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.user!.role === 'student' ? req.user!.id : (req.params.id || req.user!.id);

    const student = await User.findById(studentId).select('domainId resume');
    const domainSkills = student?.domainId ? await Skill.find({ domainId: student.domainId }).select('_id') : [];
    const skillResults = await SkillResult.find({ studentId, skillId: { $in: domainSkills.map((skill) => skill._id) } }).populate({
      path: 'skillId',
      populate: { path: 'categoryId' },
    });

    const verifiedSkills = skillResults.filter(
      (sr) => sr.status === SkillStatus.VERIFIED
    );
    const inProgressSkills = skillResults.filter(
      (sr) => sr.status === SkillStatus.CLAIMED || sr.status === SkillStatus.ASSESSED
    );
    const gapSkills = skillResults.filter(
      (sr) => sr.status === SkillStatus.NEEDS_IMPROVEMENT
    );

    const totalSkills = skillResults.length;
    const readinessScore =
      totalSkills > 0
        ? Math.round(
            skillResults.reduce((sum, sr) => sum + sr.score, 0) / totalSkills
          )
        : 0;

    const resume = student?.resume ? {
      fileName: student.resume.filename,
      contentType: student.resume.contentType,
      size: student.resume.size,
      uploadedAt: student.resume.uploadedAt,
      hasResume: true,
      url: getResumeDataUrl(student.resume),
    } : { hasResume: false };

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalSkills,
          verifiedCount: verifiedSkills.length,
          inProgressCount: inProgressSkills.length,
          gapCount: gapSkills.length,
          readinessScore,
        },
        verifiedSkills,
        inProgressSkills,
        gapSkills,
        resume,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSkillGapAnalysis = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.user!.role === 'student' ? req.user!.id : (req.params.id || req.user!.id);
    const opportunityId = req.query.opportunityId as string;

    const gapAnalysis = await analyzeSkillGap(studentId, opportunityId);

    res.status(200).json({
      success: true,
      data: gapAnalysis,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadResume = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'student') {
      res.status(403).json({
        success: false,
        data: null,
        error: { code: 'FORBIDDEN', message: 'Only students can upload a resume' },
      });
      return;
    }

    const { filename, contentType, fileData, size } = normalizeResumePayload(req.body);
    const allowedMimeTypes = ['application/pdf'];

    if (!filename || !fileData || !size) {
      res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_RESUME', message: 'Resume file is required' },
      });
      return;
    }

    if (!allowedMimeTypes.includes(contentType)) {
      res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_FILE_TYPE', message: 'Only PDF resume files are allowed' },
      });
      return;
    }

    if (size > MAX_RESUME_SIZE_BYTES) {
      res.status(400).json({
        success: false,
        data: null,
        error: { code: 'FILE_TOO_LARGE', message: 'Resume must be 5MB or less' },
      });
      return;
    }

    const base64 = fileData.replace(/^data:.*;base64,/, '');
    const decoded = Buffer.from(base64, 'base64');

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({
        success: false,
        data: null,
        error: { code: 'USER_NOT_FOUND', message: 'Student not found' },
      });
      return;
    }

    user.resume = {
      filename,
      contentType,
      size: decoded.length,
      data: decoded,
      uploadedAt: new Date(),
    };

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        message: 'Resume uploaded successfully',
        resume: {
          fileName: user.resume.filename,
          contentType: user.resume.contentType,
          size: user.resume.size,
          uploadedAt: user.resume.uploadedAt,
          hasResume: true,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentResume = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const studentId = req.user!.role === 'student' ? req.user!.id : (req.params.id || req.user!.id);

    if (req.user && req.user.role !== 'student' && req.user.role !== 'industry' && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        data: null,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to access this resume' },
      });
      return;
    }

    const student = await User.findById(studentId).select('resume name role');
    if (!student || !student.resume) {
      res.status(404).json({
        success: false,
        data: null,
        error: { code: 'RESUME_NOT_FOUND', message: 'No resume uploaded for this student' },
      });
      return;
    }

    if (req.user && req.user.role === 'student' && student._id.toString() !== req.user.id) {
      res.status(403).json({
        success: false,
        data: null,
        error: { code: 'UNAUTHORIZED', message: 'You can only access your own resume' },
      });
      return;
    }

    if (req.user && req.user.role === 'industry') {
      const opportunityId = req.query.opportunityId as string;
      if (!opportunityId) {
        res.status(403).json({
          success: false,
          data: null,
          error: { code: 'OPPORTUNITY_REQUIRED', message: 'Opportunity context required to view a candidate resume' },
        });
        return;
      }

      const opportunity = await Opportunity.findById(opportunityId).select('industryId domainId');
      const hasAccess = opportunity && opportunity.industryId.toString() === req.user.id;
      if (!hasAccess) {
        res.status(403).json({
          success: false,
          data: null,
          error: { code: 'RESUME_FORBIDDEN', message: 'This resume is not available for your opportunity' },
        });
        return;
      }

      const application = await Application.findOne({ studentId, opportunityId }).select('_id');
      if (!application) {
        res.status(403).json({
          success: false,
          data: null,
          error: { code: 'NOT_ASSOCIATED_WITH_OPPORTUNITY', message: 'This candidate is not associated with the selected opportunity' },
        });
        return;
      }
    }

    res.setHeader('Content-Type', student.resume.contentType || 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${student.resume.filename}"`);
    res.send(student.resume.data);
  } catch (error) {
    next(error);
  }
};

export const getTargetRoles = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const student = await User.findById(req.user!.id).select('domainId');
    const domainId = student?.domainId;
    if (!domainId) {
      res.status(400).json({ success: false, data: null, error: { code: 'DOMAIN_REQUIRED', message: 'Select a domain first' } });
      return;
    }
    const roles = await Role.find({ domainId, isActive: true })
      .select('_id name description category domainId requirements')
      .populate('requirements.skillId', 'name');
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    next(error);
  }
};

export const setTargetRole = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const role = await Role.findOne({ _id: req.body.targetRoleId, isActive: true }).select('_id domainId');
    const student = await User.findById(req.user!.id).select('domainId profile');
    if (!role || !student?.domainId || role.domainId.toString() !== student.domainId.toString()) {
      res.status(400).json({ success: false, data: null, error: { code: 'INVALID_TARGET_ROLE', message: 'Target role must belong to your selected domain' } });
      return;
    }
    student.profile = { ...(student.profile || {}), targetRoleId: role._id.toString() };
    await student.save();
    res.status(200).json({ success: true, data: { targetRoleId: role._id } });
  } catch (error) {
    next(error);
  }
};

export const getTargetRoleReadiness = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const student = await User.findById(req.user!.id).select('domainId profile');
    const targetRoleId = (req.query.roleId as string) || student?.profile?.targetRoleId;
    if (!targetRoleId) {
      res.status(200).json({ success: true, data: null });
      return;
    }
    const role = await Role.findOne({ _id: targetRoleId, isActive: true })
      .populate('requirements.skillId', 'name description')
      .select('name domainId requirements');
    if (!role || !student?.domainId || role.domainId.toString() !== student.domainId.toString()) {
      res.status(404).json({ success: false, data: null, error: { code: 'TARGET_ROLE_NOT_FOUND', message: 'Target role was not found in your domain' } });
      return;
    }
    const results = await SkillResult.find({ studentId: req.user!.id }).populate('skillId');
    const skillsHave: any[] = [];
    const skillsToImprove: any[] = [];
    const skillsNeed: any[] = [];
    const verifiedSkills: string[] = [];
    let readinessTotal = 0;
    for (const requirement of role.requirements) {
      const requiredScore = requirement.minProficiency;
      const requiredSkill = requirement.skillId as any;
      const result = results.find((item) => item.skillId._id.toString() === requiredSkill._id.toString());
      const currentScore = result?.score || 0;
      const meets = Boolean(result && result.status !== SkillStatus.CLAIMED && currentScore >= requiredScore);
      readinessTotal += Math.min(100, Math.round((currentScore / requiredScore) * 100));
      if (result?.status === SkillStatus.VERIFIED) verifiedSkills.push(requiredSkill.name);
      const item = {
        skillId: requiredSkill._id, skillName: requiredSkill.name, currentScore, requiredScore,
        currentStatus: result?.status || 'not_demonstrated',
        gap: meets ? 0 : Math.max(0, requiredScore - currentScore),
        priority: !result || result.status === SkillStatus.CLAIMED || currentScore === 0 || requiredScore - currentScore >= 20 ? 'High' : 'Medium',
      };
      if (meets) skillsHave.push(item);
      else if (result) skillsToImprove.push(item);
      else skillsNeed.push(item);
    }
    const gapSkillIds = [...skillsToImprove, ...skillsNeed].map((item) => item.skillId);
    const learningResources = await LearningResource.find({ skillId: { $in: gapSkillIds } }).select('skillId title url type estimatedHours');
    const opportunities = await Opportunity.find({
      domainId: student.domainId,
      status: 'open',
      $or: [{ roleId: role._id }, { title: { $regex: role.name, $options: 'i' } }],
    }).select('_id title description type location isRemote durationWeeks').populate('industryId', 'name profile');
    res.status(200).json({
      success: true,
      data: {
        targetRole: { id: role._id, title: role.name },
        readiness: role.requirements.length ? Math.round(readinessTotal / role.requirements.length) : 0,
        requiredSkills: role.requirements.length, meetsRequirement: skillsHave.length,
        needsImprovement: skillsToImprove.length, notDemonstrated: skillsNeed.length,
        skillsHave, skillsToImprove, skillsNeed, verifiedSkills, learningResources, opportunities,
      },
    });
  } catch (error) {
    next(error);
  }
};
