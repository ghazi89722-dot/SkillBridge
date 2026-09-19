import { Response, NextFunction } from 'express';
import User from '../models/User';
import SkillResult from '../models/SkillResult';
import { AuthRequest } from '../types';
import { SkillStatus, UserRole } from '../config/constants';

export const getInstitutionDirectory = async (
  req: import('express').Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const institutions = await User.find({ role: UserRole.INSTITUTION })
      .select('_id name profile.institutionName')
      .sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: institutions.map((institution) => ({
        id: institution._id,
        name: institution.profile?.institutionName || institution.name,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const getInstitutionStudents = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const students = await User.find({
      role: UserRole.STUDENT,
      'profile.institutionId': req.user!.id,
    }).select('name email domainId profile');
    const studentIds = students.map((student) => student._id);
    const results = await SkillResult.find({ studentId: { $in: studentIds } }).populate('skillId');
    const data = students.map((student) => {
      const studentResults = results.filter((result) => result.studentId.toString() === student._id.toString());
      return {
        id: student._id,
        name: student.name,
        email: student.email,
        domainId: student.domainId,
        assessed: studentResults.some((result) => result.status !== SkillStatus.CLAIMED),
        readiness: studentResults.length
          ? Math.round(studentResults.reduce((sum, result) => sum + result.score, 0) / studentResults.length)
          : 0,
        verifiedSkills: studentResults.filter((result) => result.status === SkillStatus.VERIFIED).length,
        skillGaps: studentResults.filter((result) => result.status === SkillStatus.NEEDS_IMPROVEMENT).length,
      };
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
