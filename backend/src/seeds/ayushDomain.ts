import mongoose from 'mongoose';
import Domain from '../models/Domain';
import SkillCategory from '../models/SkillCategory';
import Skill from '../models/Skill';

export const seedAYUSHDomain = async () => {
  console.log('🌱 Seeding AYUSH Domain & Skills...');

  // 1. Create AYUSH Domain (Flagship)
  const domain = await Domain.create({
    name: 'AYUSH',
    slug: 'ayush',
    description:
      'Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homoeopathy. Flagship domain for SIH 2026 / Ministry of Ayush.',
    isFlagship: true,
  });

  // 2. Create Skill Categories
  const catClinical = await SkillCategory.create({
    domainId: domain._id,
    name: 'Clinical & Therapeutic Procedures',
    description: 'Hands-on clinical skills, Panchakarma therapies, and patient procedures.',
  });

  const catPharma = await SkillCategory.create({
    domainId: domain._id,
    name: 'Pharmaceutical & GMP Standards',
    description: 'Ayurvedic drug manufacturing, quality standards, and regulatory compliance.',
  });

  const catDiagnostic = await SkillCategory.create({
    domainId: domain._id,
    name: 'Diagnostic & Patient Evaluation',
    description: 'Pulse diagnosis, constitution assessment, and clinical evaluation techniques.',
  });

  const catComm = await SkillCategory.create({
    domainId: domain._id,
    name: 'Healthcare Communication & Ethics',
    description: 'Patient counseling, case documentation, and medical ethics in traditional medicine.',
  });

  // 3. Create 10 AYUSH Skills with honest curriculum references
  const skills = await Skill.create([
    {
      domainId: domain._id,
      categoryId: catClinical._id,
      name: 'Panchakarma Technique',
      description:
        'Practical execution of shodhana therapies including Vamana, Virechana, Basti, Nasya, and Raktamokshana.',
      proficiencyScale: {
        beginner: [0, 39],
        developing: [40, 59],
        intermediate: [60, 74],
        advanced: [75, 89],
        expert: [90, 100],
      },
      curriculumReference: 'NCISM BAMS Curriculum - Panchakarma Practical Module (Unit 3)',
      assessmentTypesSupported: ['mcq', 'rubric'],
    },
    {
      domainId: domain._id,
      categoryId: catClinical._id,
      name: 'Ksharasutra Preparation & Application',
      description:
        'Standard preparation and clinical application of medicated seton in anorectal conditions.',
      proficiencyScale: {
        beginner: [0, 39],
        developing: [40, 59],
        intermediate: [60, 74],
        advanced: [75, 89],
        expert: [90, 100],
      },
      curriculumReference: 'NCISM Shalya Tantra Guidelines - Para-surgical Procedures',
      assessmentTypesSupported: ['mcq'],
    },
    {
      domainId: domain._id,
      categoryId: catDiagnostic._id,
      name: 'Nadi Pariksha (Pulse Diagnosis)',
      description:
        'Traditional eight-fold examination technique for assessing Dosha imbalance via radial pulse.',
      proficiencyScale: {
        beginner: [0, 39],
        developing: [40, 59],
        intermediate: [60, 74],
        advanced: [75, 89],
        expert: [90, 100],
      },
      curriculumReference: 'NCISM Roga Nidana Syllabus - Ashtavidha Pariksha Module',
      assessmentTypesSupported: ['mcq'],
    },
    {
      domainId: domain._id,
      categoryId: catPharma._id,
      name: 'Ayurvedic Pharmacopoeia & Dravyaguna',
      description:
        'Identification, purification, and therapeutic classification of medicinal plants and minerals.',
      proficiencyScale: {
        beginner: [0, 39],
        developing: [40, 59],
        intermediate: [60, 74],
        advanced: [75, 89],
        expert: [90, 100],
      },
      curriculumReference: 'NCISM Dravyaguna Vijnana Syllabus - Plant Taxonomy & Rasa Panchaka',
      assessmentTypesSupported: ['mcq'],
    },
    {
      domainId: domain._id,
      categoryId: catPharma._id,
      name: 'Good Manufacturing Practices (GMP) in AYUSH',
      description:
        'Schedule T compliance, cleanroom standards, microbial limits, and batch manufacturing records.',
      proficiencyScale: {
        beginner: [0, 39],
        developing: [40, 59],
        intermediate: [60, 74],
        advanced: [75, 89],
        expert: [90, 100],
      },
      curriculumReference: 'AYUSH GMP Regulatory Framework - Drugs and Cosmetics Rules (Schedule T)',
      assessmentTypesSupported: ['mcq'],
    },
    {
      domainId: domain._id,
      categoryId: catPharma._id,
      name: 'Standard Operating Procedures for Shodhana',
      description:
        'Detoxification protocols for poisonous drugs (Visha/Upavisha) and metallic preparations (Bhasma).',
      proficiencyScale: {
        beginner: [0, 39],
        developing: [40, 59],
        intermediate: [60, 74],
        advanced: [75, 89],
        expert: [90, 100],
      },
      curriculumReference: 'Rasashastra & Bhaishajya Kalpana Standard Formulary Guidelines',
      assessmentTypesSupported: ['mcq'],
    },
    {
      domainId: domain._id,
      categoryId: catDiagnostic._id,
      name: 'Prakriti Assessment & Analysis',
      description:
        'Comprehensive determination of individual psychosomatic constitution based on anatomical, physiological, and psychological traits.',
      proficiencyScale: {
        beginner: [0, 39],
        developing: [40, 59],
        intermediate: [60, 74],
        advanced: [75, 89],
        expert: [90, 100],
      },
      curriculumReference: 'NCISM Kriya Sharira Clinical Protocols - Deha Prakriti',
      assessmentTypesSupported: ['mcq'],
    },
    {
      domainId: domain._id,
      categoryId: catComm._id,
      name: 'Patient Case History & Documentation',
      description:
        'Systematic recording of Dashavidha Pariksha, chief complaints, lifestyle history, and treatment progression.',
      proficiencyScale: {
        beginner: [0, 39],
        developing: [40, 59],
        intermediate: [60, 74],
        advanced: [75, 89],
        expert: [90, 100],
      },
      curriculumReference: 'Clinical Hospital Training Standards for AYUSH Teaching Institutions',
      assessmentTypesSupported: ['mcq'],
    },
    {
      domainId: domain._id,
      categoryId: catClinical._id,
      name: 'Yoga Therapy Protocols for Lifestyle Disorders',
      description:
        'Evidence-based yogic interventions (asanas, pranayama, kriya) for metabolic and psychosomatic conditions.',
      proficiencyScale: {
        beginner: [0, 39],
        developing: [40, 59],
        intermediate: [60, 74],
        advanced: [75, 89],
        expert: [90, 100],
      },
      curriculumReference: 'Yoga Certification Board (YCB) Therapeutic Protocol Guidelines',
      assessmentTypesSupported: ['mcq'],
    },
    {
      domainId: domain._id,
      categoryId: catComm._id,
      name: 'Clinical Communication in Traditional Medicine',
      description:
        'Effective communication regarding diet (Ahara), lifestyle (Vihara), prognosis, and medication adherence.',
      proficiencyScale: {
        beginner: [0, 39],
        developing: [40, 59],
        intermediate: [60, 74],
        advanced: [75, 89],
        expert: [90, 100],
      },
      curriculumReference: 'Healthcare Practitioner Medical Ethics & Communication Manual',
      assessmentTypesSupported: ['mcq'],
    },
  ]);

  console.log(`✅ Seeded 1 Domain, 4 Categories, and ${skills.length} Skills.`);
  return { domain, categories: [catClinical, catPharma, catDiagnostic, catComm], skills };
};
