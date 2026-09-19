import { Response, NextFunction } from 'express';
import SkillResult from '../models/SkillResult';
import User from '../models/User';
import { AuthRequest } from '../types';
import { UserRole, SkillStatus } from '../config/constants';
import Opportunity from '../models/Opportunity';

export const getInstitutionAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const institutionId = req.user!.id;

    // Get all students associated with this institution
    const students = await User.find({
      role: UserRole.STUDENT,
      'profile.institutionId': institutionId,
    });

    const studentIds = students.map((s) => s._id);

    // Get all skill results for these students
    const skillResults = await SkillResult.find({
      studentId: { $in: studentIds },
    }).populate('skillId');

    const totalStudents = students.length;
    const assessedStudents = new Set(
      skillResults
        .filter((sr) => sr.status !== SkillStatus.CLAIMED)
        .map((sr) => sr.studentId.toString())
    ).size;

    const avgReadiness =
      skillResults.length > 0
        ? Math.round(
            skillResults.reduce((sum, sr) => sum + sr.score, 0) /
              skillResults.length
          )
        : 0;

    // Calculate top skill gaps
    const gapSkills = skillResults.filter(sr => sr.status === SkillStatus.NEEDS_IMPROVEMENT);
    const gapCounts: Record<string, { count: number, name: string }> = {};
    gapSkills.forEach(sr => {
      const skillIdStr = sr.skillId._id ? sr.skillId._id.toString() : sr.skillId.toString();
      const skillName = (sr.skillId as any).name || 'Unknown Skill';
      if (!gapCounts[skillIdStr]) {
        gapCounts[skillIdStr] = { count: 0, name: skillName };
      }
      gapCounts[skillIdStr].count++;
    });

    const topSkillGaps = Object.values(gapCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    const verifiedSkills = skillResults.filter((sr) => sr.status === SkillStatus.VERIFIED).length;
    const activeOpportunities = await Opportunity.countDocuments({
      status: 'open',
      ...(students[0]?.domainId ? { domainId: students[0].domainId } : {}),
    });

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        assessedStudents,
        assessmentCompletionRate:
          totalStudents > 0
            ? Math.round((assessedStudents / totalStudents) * 100)
            : 0,
        avgReadiness,
        skillResultsCount: skillResults.length,
        verifiedSkills,
        majorSkillGaps: topSkillGaps,
        activeOpportunities,
        topSkillGaps,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMinistryAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Read-only aggregated national stats
    const totalStudents = await User.countDocuments({ role: UserRole.STUDENT });
    const totalInstitutions = await User.countDocuments({
      role: UserRole.INSTITUTION,
    });
    const assessedResults = await SkillResult.find({
      status: { $in: [SkillStatus.ASSESSED, SkillStatus.VERIFIED] },
    }).populate('skillId');
    const studentsAssessed = new Set(assessedResults.map((result) => result.studentId.toString()));
    const verifiedSkills = assessedResults.filter((result) => result.status === SkillStatus.VERIFIED).length;
    const allResults = await SkillResult.find().populate('skillId');
    const readiness = allResults.length > 0
      ? Math.round(allResults.reduce((sum, result) => sum + result.score, 0) / allResults.length)
      : 0;
    const gapCounts: Record<string, { name: string; count: number }> = {};
    allResults
      .filter((result) => result.status === SkillStatus.NEEDS_IMPROVEMENT)
      .forEach((result) => {
        const skill = result.skillId as any;
        const key = skill._id.toString();
        gapCounts[key] = gapCounts[key] || { name: skill.name, count: 0 };
        gapCounts[key].count++;
      });
    const skillGapTrends = Object.values(gapCounts).sort((a, b) => b.count - a.count).slice(0, 8);
    const institutionUsers = await User.find({ role: UserRole.INSTITUTION }).select('name');
    const institutionSummaries = await Promise.all(
      institutionUsers.map(async (institution) => {
        const institutionStudents = await User.find({
          role: UserRole.STUDENT,
          'profile.institutionId': institution._id,
        }).select('_id');
        const ids = institutionStudents.map((student) => student._id);
        const results = await SkillResult.find({ studentId: { $in: ids } });
        return {
          institutionId: institution._id,
          institutionName: institution.name,
          students: ids.length,
          assessed: new Set(results.filter((result) => result.status !== SkillStatus.CLAIMED).map((result) => result.studentId.toString())).size,
          averageReadiness: results.length
            ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length)
            : 0,
        };
      })
    );
    const activeOpportunities = await Opportunity.countDocuments({ status: 'open' });

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalInstitutions,
        studentsAssessed: studentsAssessed.size,
        totalSkillsAssessed: assessedResults.length,
        totalVerifiedSkills: verifiedSkills,
        nationalAvgReadiness: readiness,
        activeOpportunities,
        skillGapTrends,
        institutionSummaries,
      },
    });
  } catch (error) {
    next(error);
  }
};
