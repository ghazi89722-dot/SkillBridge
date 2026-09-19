import Domain from '../models/Domain';
import Role from '../models/Role';
import Skill from '../models/Skill';

const roleDefinitions = [
  { domain: 'engineering', name: 'Software Engineer', category: 'Software Development', skills: ['JavaScript & TypeScript', 'Data Structures & Algorithms', 'Database Design', 'REST API Design'], description: 'Build and maintain reliable software products and services.' },
  { domain: 'engineering', name: 'Frontend Developer', category: 'Web Development', skills: ['Frontend Development', 'JavaScript & TypeScript', 'REST API Design'], description: 'Create accessible, responsive web interfaces.' },
  { domain: 'engineering', name: 'Backend Developer', category: 'Software Development', skills: ['JavaScript & TypeScript', 'Database Design', 'REST API Design'], description: 'Design dependable services, APIs, and data systems.' },
  { domain: 'engineering', name: 'Full Stack Developer', category: 'Web Development', skills: ['Frontend Development', 'JavaScript & TypeScript', 'Database Design', 'REST API Design'], description: 'Deliver features across the frontend, backend, and data layers.' },
  { domain: 'engineering', name: 'Mobile App Developer', category: 'Application Development', skills: ['JavaScript & TypeScript', 'REST API Design', 'Data Structures & Algorithms'], description: 'Build reliable mobile experiences and supporting services.' },
  { domain: 'engineering', name: 'Data Analyst', category: 'Data & Analytics', skills: ['Database Design', 'Data Structures & Algorithms', 'JavaScript & TypeScript'], description: 'Turn structured data into useful, explainable insights.' },
  { domain: 'engineering', name: 'Data Scientist', category: 'Data & Analytics', skills: ['Data Structures & Algorithms', 'Database Design', 'JavaScript & TypeScript'], description: 'Use data, experimentation, and software to answer complex questions.' },
  { domain: 'engineering', name: 'AI/ML Engineer', category: 'Data & AI', skills: ['Data Structures & Algorithms', 'Database Design', 'REST API Design'], description: 'Develop and deliver dependable machine-learning systems.' },
  { domain: 'engineering', name: 'DevOps Engineer', category: 'Cloud & Infrastructure', skills: ['Cloud & DevOps Fundamentals', 'REST API Design', 'Database Design'], description: 'Automate delivery and operate observable, resilient systems.' },
  { domain: 'engineering', name: 'Cloud Engineer', category: 'Cloud & Infrastructure', skills: ['Cloud & DevOps Fundamentals', 'REST API Design', 'Database Design'], description: 'Design and support secure, scalable cloud workloads.' },
  { domain: 'engineering', name: 'Cybersecurity Analyst', category: 'Security', skills: ['REST API Design', 'Database Design', 'Cloud & DevOps Fundamentals'], description: 'Identify risks and strengthen application and infrastructure security.' },
  { domain: 'engineering', name: 'UI/UX Designer', category: 'Design', skills: ['Frontend Development', 'JavaScript & TypeScript'], description: 'Design clear, accessible, user-centered digital experiences.' },
  { domain: 'engineering', name: 'Database Administrator', category: 'Data & Systems', skills: ['Database Design', 'Cloud & DevOps Fundamentals', 'REST API Design'], description: 'Maintain secure, performant, and recoverable data systems.' },
  { domain: 'engineering', name: 'QA Engineer', category: 'Quality Engineering', skills: ['JavaScript & TypeScript', 'REST API Design', 'Data Structures & Algorithms'], description: 'Plan and execute evidence-based software quality checks.' },
  { domain: 'engineering', name: 'Automation Tester', category: 'Quality Engineering', skills: ['JavaScript & TypeScript', 'REST API Design', 'Data Structures & Algorithms'], description: 'Create repeatable automated checks for product behavior.' },
  { domain: 'engineering', name: 'Embedded Systems Engineer', category: 'Hardware & Systems', skills: ['Data Structures & Algorithms', 'JavaScript & TypeScript'], description: 'Develop reliable software for connected and constrained systems.' },
  { domain: 'engineering', name: 'Network Engineer', category: 'Infrastructure', skills: ['Cloud & DevOps Fundamentals', 'REST API Design', 'Database Design'], description: 'Design and troubleshoot dependable networked systems.' },
  { domain: 'medical-healthcare', name: 'Clinical Assistant', category: 'Clinical Practice', skills: ['Patient Safety', 'Medical Terminology', 'Basic Clinical Skills', 'Clinical Communication'], description: 'Support safe, patient-centered care under clinical supervision.' },
  { domain: 'medical-healthcare', name: 'Medical Laboratory Assistant', category: 'Laboratory Services', skills: ['Patient Safety', 'Medical Terminology', 'Anatomy & Physiology'], description: 'Support accurate, safe laboratory workflows.' },
  { domain: 'medical-healthcare', name: 'Healthcare Data Analyst', category: 'Health Data', skills: ['Medical Terminology', 'Clinical Communication', 'Patient Safety'], description: 'Translate healthcare data into useful operational insights.' },
  { domain: 'medical-healthcare', name: 'Healthcare Technology Associate', category: 'Healthcare Technology', skills: ['Clinical Communication', 'Medical Terminology', 'Patient Safety'], description: 'Support technology that improves safe healthcare delivery.' },
  { domain: 'medical-healthcare', name: 'Medical Coding Specialist', category: 'Health Information', skills: ['Medical Terminology', 'Patient Safety', 'Clinical Communication'], description: 'Apply accurate terminology and documentation practices.' },
  { domain: 'medical-healthcare', name: 'Health Informatics Analyst', category: 'Health Information', skills: ['Medical Terminology', 'Clinical Communication', 'Patient Safety'], description: 'Improve healthcare information workflows and reporting.' },
];

export const seedCareerRoles = async (): Promise<void> => {
  for (const definition of roleDefinitions) {
    const domain = await Domain.findOne({ slug: definition.domain });
    if (!domain) continue;
    const skills = await Skill.find({ domainId: domain._id, name: { $in: definition.skills } }).select('_id name');
    if (skills.length !== definition.skills.length) continue;
    const requirements = skills.map((skill) => ({ skillId: skill._id, minProficiency: 75 }));
    await Role.findOneAndUpdate(
      { domainId: domain._id, name: definition.name },
      { domainId: domain._id, name: definition.name, description: definition.description, category: definition.category, isActive: true, requirements },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
};
