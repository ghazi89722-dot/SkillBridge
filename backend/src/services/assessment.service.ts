import Assessment from '../models/Assessment';
import AssessmentAttempt from '../models/AssessmentAttempt';
import SkillResult from '../models/SkillResult';
import { SkillStatus, VerificationSource, PASSING_SCORE } from '../config/constants';
import User from '../models/User';
import Skill from '../models/Skill';

interface SanitizedQuestion {
  _id: string;
  text: string;
  options: string[];
}

export const getAssessmentForSkill = async (studentId: string, skillId: string) => {
  const student = await User.findById(studentId).select('domainId');
  const skill = await Skill.findOne({ _id: skillId, domainId: student?.domainId }).select('_id');
  if (!skill) throw new Error('Skill is not available in your selected domain');
  const assessment = await Assessment.findOne({ skillId: skill._id }).populate('skillId');

  if (!assessment) {
    throw new Error('Assessment not found for this skill');
  }

  // CRITICAL SECURITY: Strip correctOptionIndex and randomize question order
  const sanitizedQuestions: SanitizedQuestion[] = (assessment.questions as any[])
    .map((q) => ({
      _id: q._id.toString(),
      text: q.text,
      options: q.options,
    }))
    .sort(() => Math.random() - 0.5); // Randomize order

  return {
    _id: assessment._id,
    skillId: assessment.skillId,
    type: assessment.type,
    questions: sanitizedQuestions,
    durationMinutes: assessment.durationMinutes,
  };
};

export const submitAssessment = async (
  studentId: string,
  assessmentId: string,
  answers: Array<{ questionId: string; selectedOptionIndex: number }>
) => {
  const assessment = await Assessment.findById(assessmentId);

  if (!assessment) {
    throw new Error('Assessment not found');
  }
  const student = await User.findById(studentId).select('domainId');
  const skill = await Skill.findOne({ _id: assessment.skillId, domainId: student?.domainId }).select('_id');
  if (!skill) throw new Error('Assessment is not available in your selected domain');

  // Server-side scoring
  let correctCount = 0;
  const totalQuestions = assessment.questions.length;

  answers.forEach((answer) => {
    const question = assessment.questions.find(
      (q: any) => q._id.toString() === answer.questionId
    );
    if (question && question.correctOptionIndex === answer.selectedOptionIndex) {
      correctCount++;
    }
  });

  const rawScore = correctCount;
  const normalizedScore = Math.round((rawScore / totalQuestions) * 100);

  // Determine status based on score
  const newStatus =
    normalizedScore >= PASSING_SCORE
      ? SkillStatus.VERIFIED
      : SkillStatus.NEEDS_IMPROVEMENT;

  // Save assessment attempt
  const attempt = await AssessmentAttempt.create({
    studentId,
    assessmentId,
    answers,
    rawScore,
    normalizedScore,
    submittedAt: new Date(),
  });

  // Update or create SkillResult
  let skillResult = await SkillResult.findOne({
    studentId,
    skillId: assessment.skillId,
  });

  if (!skillResult) {
    skillResult = await SkillResult.create({
      studentId,
      skillId: assessment.skillId,
      status: newStatus,
      score: normalizedScore,
      verificationSource: VerificationSource.PLATFORM_ASSESSED,
      lastAssessedAt: new Date(),
      history: [
        {
          score: normalizedScore,
          status: newStatus,
          assessedAt: new Date(),
        },
      ],
    });
  } else {
    // Update existing skill result
    skillResult.status = newStatus;
    skillResult.score = normalizedScore;
    skillResult.verificationSource = VerificationSource.PLATFORM_ASSESSED;
    skillResult.lastAssessedAt = new Date();
    skillResult.history.push({
      score: normalizedScore,
      status: newStatus,
      assessedAt: new Date(),
    });
    await skillResult.save();
  }

  return {
    score: normalizedScore,
    status: newStatus,
    breakdown: {
      totalQuestions,
      correctCount,
      passingThreshold: PASSING_SCORE,
      isVerified: newStatus === SkillStatus.VERIFIED,
    },
  };
};
