import Domain from '../models/Domain';
import SkillCategory from '../models/SkillCategory';
import Skill from '../models/Skill';

export const seedTechDomain = async () => {
  console.log('🌱 Seeding Second Domain (Engineering / Tech) for Proof of Domain Agnosticism...');

  const domain = await Domain.create({
    name: 'Technology & Software',
    slug: 'tech',
    description: 'Software engineering, full-stack web development, and cloud computing.',
    isFlagship: false,
  });

  const catFrontend = await SkillCategory.create({
    domainId: domain._id,
    name: 'Frontend Development',
    description: 'Modern web UI architectures, React ecosystem, and state management.',
  });

  const catBackend = await SkillCategory.create({
    domainId: domain._id,
    name: 'Backend & Systems',
    description: 'Server architectures, REST APIs, databases, and microservices.',
  });

  const skills = await Skill.create([
    {
      domainId: domain._id,
      categoryId: catFrontend._id,
      name: 'React & Next.js Ecosystem',
      description: 'Building modern responsive web applications using React and Next.js App Router.',
      proficiencyScale: {
        beginner: [0, 39],
        developing: [40, 59],
        intermediate: [60, 74],
        advanced: [75, 89],
        expert: [90, 100],
      },
      curriculumReference: 'AICTE Model Curriculum for Computer Science - Web Technologies',
      assessmentTypesSupported: ['mcq', 'rubric'],
    },
    {
      domainId: domain._id,
      categoryId: catBackend._id,
      name: 'RESTful API Design & MongoDB',
      description: 'Designing scalable REST services with Node.js/Express and Mongoose ODM.',
      proficiencyScale: {
        beginner: [0, 39],
        developing: [40, 59],
        intermediate: [60, 74],
        advanced: [75, 89],
        expert: [90, 100],
      },
      curriculumReference: 'AICTE Model Curriculum for Computer Science - Database Systems',
      assessmentTypesSupported: ['mcq'],
    },
  ]);

  console.log(`✅ Seeded 2nd Domain (${domain.name}) with ${skills.length} skills (Proof of domain-as-config).`);
  return { domain, categories: [catFrontend, catBackend], skills };
};
