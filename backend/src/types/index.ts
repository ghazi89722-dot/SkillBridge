import { Request } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
    name: string;
  };
}

export interface StudentProfile {
  institutionId?: string;
  program?: string;
  year?: number;
  careerInterests?: string[];
  targetRoles?: string[];
}

export interface IndustryProfile {
  organizationName?: string;
  sector?: string;
  verifiedByAdmin?: boolean;
}

export interface InstitutionProfile {
  institutionName?: string;
  region?: string;
  verifiedByAdmin?: boolean;
}

export interface AcademicianProfile {
  institutionId?: string;
  subjectArea?: string;
  researchInterests?: string[];
}

export interface MinistryProfile {
  department?: string;
}
