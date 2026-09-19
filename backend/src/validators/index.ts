import { z } from 'zod';
import { UserRole } from '../config/constants';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.nativeEnum(UserRole),
  phone: z.string().optional(),
  preferredLanguage: z.string().default('en'),
  domainId: z.string().optional(),
  profile: z.record(z.any()).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateDomainSchema = z.object({
  domainId: z.string().min(1, 'Domain is required'),
});

export const claimSkillsSchema = z.object({
  skillIds: z.array(z.string()).min(1, 'At least one skill must be selected'),
});

export const submitAssessmentSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedOptionIndex: z.number().int().min(0).max(3),
    })
  ),
});

export const createOpportunitySchema = z.object({
  domainId: z.string(),
  roleId: z.string().optional(),
  title: z.string().min(3),
  type: z.string(),
  description: z.string().min(10),
  eligibility: z.string().optional(),
  requiredSkills: z.array(
    z.object({
      skillId: z.string(),
      minProficiency: z.number().min(0).max(100),
    })
  ).min(1, 'At least one required skill must be specified'),
  location: z.string().optional(),
  isRemote: z.boolean().default(false),
  durationWeeks: z.number().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.string(),
});
