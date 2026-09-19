import mongoose from 'mongoose';
import User from '../models/User';
import SkillResult from '../models/SkillResult';
import { UserRole, SkillStatus, VerificationSource } from '../config/constants';
import bcrypt from 'bcryptjs';
import { ISkill } from '../models/Skill';

export const seedSampleUsers = async (domain: any, skills: ISkill[]) => {
  console.log('👥 Seeding RBAC Demo Users...');

  // The pre-save hook handles hashing, so we just pass plaintext
  const demoPassword = 'Demo@1234';

  const users = await User.create([
    {
      name: 'Aditi Student',
      email: 'student@skillbridge.dev',
      passwordHash: demoPassword,
      role: UserRole.STUDENT,
      domainId: domain._id,
      isVerifiedAccount: true,
      profile: {
        institutionId: new mongoose.Types.ObjectId().toString(), // Mock ID
        program: 'BAMS',
        year: 4,
        careerInterests: ['Clinical Practice', 'Wellness Centers'],
        targetRoles: ['Panchakarma Therapist Intern'],
      },
    },
    {
      name: 'Ayurveda Pharma Recruiter',
      email: 'recruiter@skillbridge.dev',
      passwordHash: demoPassword,
      role: UserRole.INDUSTRY,
      isVerifiedAccount: true,
      profile: {
        organizationName: 'AIIA Clinical Research & Wellness Partner',
        sector: 'Healthcare Services',
        verifiedByAdmin: true,
      },
    },
    {
      name: 'AIIA Nodal Admin',
      email: 'college@skillbridge.dev',
      passwordHash: demoPassword,
      role: UserRole.INSTITUTION,
      isVerifiedAccount: true,
      profile: {
        institutionName: 'All India Institute of Ayurveda',
        region: 'Delhi',
        verifiedByAdmin: true,
      },
    },
    {
      name: 'Dr. Faculty Member',
      email: 'faculty@skillbridge.dev',
      passwordHash: demoPassword,
      role: UserRole.ACADEMICIAN,
      isVerifiedAccount: true,
      profile: {
        institutionId: new mongoose.Types.ObjectId().toString(),
        subjectArea: 'Panchakarma & Nidana',
        researchInterests: ['Therapeutic Efficacy of Vamana'],
      },
    },
    {
      name: 'NCISM Officer',
      email: 'ministry@skillbridge.dev',
      passwordHash: demoPassword,
      role: UserRole.MINISTRY,
      isVerifiedAccount: true, // Read-only dashboard viewer
      profile: {
        department: 'Education Policy & Skill Standards',
      },
    },
    {
      name: 'System Admin',
      email: 'admin@skillbridge.dev',
      passwordHash: demoPassword,
      role: UserRole.ADMIN,
      isVerifiedAccount: true,
    },
  ]);

  console.log(`✅ Seeded ${users.length} demo users (1 per role) with password: ${demoPassword}`);

  // Seed initial skill state for the student so they start with something
  const student = users.find((u) => u.role === UserRole.STUDENT);
  const panchakarmaSkill = skills.find((s) => s.name === 'Panchakarma Technique');

  if (student && panchakarmaSkill) {
    // Seed one skill as CLAIMED so they have an immediate call to action to Assess
    await SkillResult.create({
      studentId: student._id,
      skillId: panchakarmaSkill._id,
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
    console.log('✅ Pre-claimed "Panchakarma Technique" for demo student.');
  }

  return { student, industry: users.find((u) => u.role === UserRole.INDUSTRY) };
};
