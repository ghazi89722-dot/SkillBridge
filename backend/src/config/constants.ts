export enum UserRole {
  STUDENT = 'student',
  INDUSTRY = 'industry',
  INSTITUTION = 'institution',
  ACADEMICIAN = 'academician',
  MINISTRY = 'ministry',
  ADMIN = 'admin',
}

export enum SkillStatus {
  CLAIMED = 'claimed',
  ASSESSED = 'assessed',
  VERIFIED = 'verified',
  NEEDS_IMPROVEMENT = 'needs_improvement',
}

export enum ApplicationStatus {
  SAVED = 'saved',
  APPLIED = 'applied',
  UNDER_REVIEW = 'under_review',
  SHORTLISTED = 'shortlisted',
  INTERVIEW = 'interview',
  SELECTED = 'selected',
  REJECTED = 'rejected',
  STARTED = 'started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum OpportunityType {
  INTERNSHIP = 'internship',
  MICRO_INTERNSHIP = 'micro_internship',
  JOB = 'job',
  APPRENTICESHIP = 'apprenticeship',
  LIVE_PROJECT = 'live_project',
  CHALLENGE = 'challenge',
  TRAINING = 'training',
  WORKSHOP = 'workshop',
  MENTORSHIP = 'mentorship',
}

export enum AssessmentType {
  MCQ = 'mcq',
  RUBRIC = 'rubric',
  VIDEO = 'video',
}

export enum VerificationSource {
  SELF_DECLARED = 'self-declared',
  COLLEGE_VERIFIED = 'college-verified',
  PLATFORM_ASSESSED = 'platform-assessed',
}

export const PROFICIENCY_THRESHOLDS = {
  BEGINNER: [0, 39],
  DEVELOPING: [40, 59],
  INTERMEDIATE: [60, 74],
  ADVANCED: [75, 89],
  EXPERT: [90, 100],
} as const;

export const PASSING_SCORE = 75;
export const REASSESSMENT_COOLDOWN_MINUTES = 5;
