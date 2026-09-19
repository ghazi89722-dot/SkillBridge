import SkillResult from '../models/SkillResult';
import Opportunity from '../models/Opportunity';

export const analyzeSkillGap = async (studentId: string, opportunityId?: string) => {
  const studentSkills = await SkillResult.find({ studentId }).populate('skillId');

  if (!opportunityId) {
    // Return all student skills without comparison
    return {
      studentSkills: studentSkills.map((sr) => ({
        skillId: sr.skillId._id,
        skillName: (sr.skillId as any).name,
        score: sr.score,
        status: sr.status,
      })),
      requiredSkills: [],
      gaps: [],
    };
  }

  const opportunity = await Opportunity.findById(opportunityId).populate(
    'requiredSkills.skillId'
  );

  if (!opportunity) {
    throw new Error('Opportunity not found');
  }

  const gaps = [];
  const matched = [];

  for (const reqSkill of opportunity.requiredSkills) {
    const skillId = reqSkill.skillId._id.toString();
    const skillName = (reqSkill.skillId as any).name;
    const requiredScore = reqSkill.minProficiency;

    const studentSkill = studentSkills.find(
      (sr) => sr.skillId._id.toString() === skillId
    );

    const studentScore = studentSkill ? studentSkill.score : 0;
    const gap = requiredScore - studentScore;

    if (gap > 0) {
      gaps.push({
        skillId,
        skillName,
        studentScore,
        requiredScore,
        gap,
        status: studentSkill ? studentSkill.status : 'not_claimed',
      });
    } else {
      matched.push({
        skillId,
        skillName,
        studentScore,
        requiredScore,
        status: studentSkill ? studentSkill.status : 'claimed',
      });
    }
  }

  return {
    opportunityTitle: opportunity.title,
    matchedSkills: matched,
    gapSkills: gaps,
  };
};
