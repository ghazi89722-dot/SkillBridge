import SkillResult from '../models/SkillResult';
import Opportunity from '../models/Opportunity';
import Skill from '../models/Skill';
import { SkillStatus } from '../config/constants';
import User from '../models/User';

interface MatchedSkill {
  skillId: string;
  name: string;
  studentScore: number;
  requiredScore: number;
  status: string;
}

interface GapSkill extends MatchedSkill {
  gap: number;
}

interface MatchResult {
  overallScore: number;
  breakdown: {
    skillCompatibility: number;
    assessmentPerformance: number;
    eligibility: number;
    relevantExperience: number;
  };
  matchedSkills: MatchedSkill[];
  gapSkills: GapSkill[];
}

export const calculateMatch = async (
  studentId: string,
  opportunityId: string
): Promise<MatchResult> => {
  const opportunity = await Opportunity.findById(opportunityId).populate(
    'requiredSkills.skillId'
  );

  if (!opportunity) {
    throw new Error('Opportunity not found');
  }

  const student = await User.findById(studentId).select('domainId');
  if (!student || !student.domainId || student.domainId.toString() !== opportunity.domainId.toString()) {
    throw new Error('Student and opportunity domains do not match');
  }

  const studentSkillResults = await SkillResult.find({ studentId }).populate('skillId');

  const matchedSkills: MatchedSkill[] = [];
  const gapSkills: GapSkill[] = [];

  let totalSkillRatio = 0;
  let totalAssessmentScore = 0;
  let assessedSkillCount = 0;

  // Analyze each required skill
  for (const reqSkill of opportunity.requiredSkills) {
    const skillId = reqSkill.skillId._id.toString();
    const skillName = (reqSkill.skillId as any).name;
    const requiredScore = reqSkill.minProficiency;

    const studentSkill = studentSkillResults.find(
      (sr) => sr.skillId._id.toString() === skillId
    );

    let studentScore = 0;
    let skillRatio = 0;
    let status: string = SkillStatus.CLAIMED;

    if (studentSkill) {
      studentScore = studentSkill.score;
      status = studentSkill.status;

      if (studentSkill.status === SkillStatus.VERIFIED) {
        skillRatio = Math.min(1.0, studentScore / requiredScore);
        totalAssessmentScore += studentScore;
        assessedSkillCount++;
      }
    } else {
      // Student has not claimed this skill
      skillRatio = 0.0;
    }

    totalSkillRatio += skillRatio;

    // Categorize as matched or gap
    if (studentScore >= requiredScore) {
      matchedSkills.push({
        skillId,
        name: skillName,
        studentScore,
        requiredScore,
        status,
      });
    } else {
      gapSkills.push({
        skillId,
        name: skillName,
        studentScore,
        requiredScore,
        gap: requiredScore - studentScore,
        status,
      });
    }
  }

  // Calculate breakdown scores
  const requiredSkillCount = opportunity.requiredSkills.length;

  // 1. Skill Compatibility (60% weight) - average skill ratio
  const skillCompatibility =
    requiredSkillCount > 0 ? (totalSkillRatio / requiredSkillCount) * 100 : 0;

  // 2. Assessment Performance (20% weight) - average of assessed skills
  const assessmentPerformance =
    assessedSkillCount > 0 ? totalAssessmentScore / assessedSkillCount : 0;

  // Eligibility and experience are intentionally excluded until real profile data exists.
  const eligibility = 0;
  const relevantExperience = 0;
  const overallScore = Math.round(
    skillCompatibility * 0.8 + assessmentPerformance * 0.2
  );

  return {
    overallScore,
    breakdown: {
      skillCompatibility: Math.round(skillCompatibility),
      assessmentPerformance: Math.round(assessmentPerformance),
      eligibility,
      relevantExperience,
    },
    matchedSkills,
    gapSkills,
  };
};

export const getRankedCandidates = async (opportunityId: string) => {
  const opportunity = await Opportunity.findById(opportunityId);

  if (!opportunity) {
    throw new Error('Opportunity not found');
  }

  // Get all students who have applied or match the domain
  // For MVP, we'll calculate match for all students in the domain
  const studentSkillResults = await SkillResult.find()
    .populate('studentId')
    .populate('skillId');

  // Get unique students
  const uniqueStudentIds = [
    ...new Set(studentSkillResults.map((sr) => sr.studentId._id.toString())),
  ];

  const candidates = [];

  for (const studentId of uniqueStudentIds) {
    try {
      const student = studentSkillResults.find(
        (sr) => sr.studentId._id.toString() === studentId
      )?.studentId;
      const populatedStudent = student as unknown as {
        name: string;
        email: string;
        domainId?: { toString(): string };
      } | undefined;
      if (!populatedStudent || !populatedStudent.domainId || populatedStudent.domainId.toString() !== opportunity.domainId.toString()) {
        continue;
      }
      const matchResult = await calculateMatch(studentId, opportunityId);

      if (populatedStudent) {
        candidates.push({
          studentId,
          student: {
            name: populatedStudent.name,
            email: populatedStudent.email,
          },
          matchResult,
        });
      }
    } catch (error) {
      // Skip students who can't be matched
      continue;
    }
  }

  // Sort by overall score descending
  candidates.sort((a, b) => b.matchResult.overallScore - a.matchResult.overallScore);

  return candidates;
};
