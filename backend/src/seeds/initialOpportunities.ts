import Domain from '../models/Domain';
import LearningResource from '../models/LearningResource';
import Opportunity from '../models/Opportunity';
import Skill from '../models/Skill';
import User from '../models/User';
import { UserRole } from '../config/constants';
import Role from '../models/Role';

const demoOpportunities = [
  {
    slug: 'engineering',
    email: 'engineering-demo@skillbridge.local',
    name: 'Engineering Demo Partner',
    title: 'Junior Frontend Developer',
    description: 'Build accessible, responsive product experiences with a modern engineering team.',
    skillNames: ['Frontend Development', 'JavaScript & TypeScript', 'REST API Design'],
  },
  {
    slug: 'medical-healthcare',
    email: 'healthcare-demo@skillbridge.local',
    name: 'Healthcare Demo Partner',
    title: 'Clinical Assistant',
    description: 'Support safe, patient-centered care under the supervision of a clinical team.',
    skillNames: ['Patient Safety', 'Medical Terminology', 'Basic Clinical Skills', 'Clinical Communication'],
  },
];

export const seedInitialOpportunities = async (): Promise<void> => {
  if (!(await User.exists({ email: 'institution-demo@skillbridge.local' }))) {
    await User.create({
      role: UserRole.INSTITUTION,
      name: 'SkillBridge Demo College',
      email: 'institution-demo@skillbridge.local',
      passwordHash: 'Password123!',
      profile: { institutionName: 'SkillBridge Demo College' },
      isVerifiedAccount: true,
    });
  }
  if (!(await User.exists({ email: 'ministry-demo@skillbridge.local' }))) {
    await User.create({
      role: UserRole.MINISTRY,
      name: 'Ministry / NCISM Demo',
      email: 'ministry-demo@skillbridge.local',
      passwordHash: 'Password123!',
      isVerifiedAccount: true,
    });
  }

  for (const definition of demoOpportunities) {
    const domain = await Domain.findOne({ slug: definition.slug });
    if (!domain) continue;

    const skills = await Skill.find({
      domainId: domain._id,
      name: { $in: definition.skillNames },
    });
    if (skills.length === 0) continue;
    const roleName = definition.title.replace(/^Junior /, '').replace(/ Intern$/, '');
    const role = await Role.findOne({ domainId: domain._id, name: roleName });

    let industry = await User.findOne({ email: definition.email });
    if (!industry) {
      industry = await User.create({
        role: UserRole.INDUSTRY,
        name: definition.name,
        email: definition.email,
        passwordHash: 'Password123!',
        domainId: domain._id,
        isVerifiedAccount: true,
      });
    }

    const existingOpportunity = await Opportunity.findOne({
      industryId: industry._id,
      title: definition.title,
    });
    if (!existingOpportunity) {
      await Opportunity.create({
        industryId: industry._id,
        domainId: domain._id,
        roleId: role?._id,
        title: definition.title,
        type: 'internship',
        description: definition.description,
        requiredSkills: skills.map((skill) => ({
          skillId: skill._id,
          minProficiency: 70,
        })),
        isRemote: true,
        durationWeeks: 12,
      });
    } else if (!existingOpportunity.roleId && role) {
      existingOpportunity.roleId = role._id;
      await existingOpportunity.save();
    }

    for (const skill of skills) {
      if (!(await LearningResource.exists({ skillId: skill._id }))) {
        await LearningResource.create({
          skillId: skill._id,
          title: `Guided practice: ${skill.name}`,
          url:
            definition.slug === 'engineering'
              ? 'https://developer.mozilla.org/'
              : 'https://www.who.int/health-topics',
          type: 'practice_project',
          estimatedHours: 4,
        });
      }
    }
  }
};
