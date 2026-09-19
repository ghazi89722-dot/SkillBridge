import Opportunity from '../models/Opportunity';
import User from '../models/User';
import Domain from '../models/Domain';
import { ISkill } from '../models/Skill';
import { OpportunityType } from '../config/constants';

export const seedSampleOpportunities = async (
  domain: any,
  industryUser: any,
  skills: ISkill[]
) => {
  console.log('💼 Seeding Sample Opportunities & Roles...');

  const getSkill = (name: string) => skills.find((s) => s.name === name);

  const panchakarma = getSkill('Panchakarma Technique');
  const documentation = getSkill('Patient Case History & Documentation');
  const comm = getSkill('Clinical Communication in Traditional Medicine');
  const gmp = getSkill('Good Manufacturing Practices (GMP) in AYUSH');
  const yoga = getSkill('Yoga Therapy Protocols for Lifestyle Disorders');
  const dravyaguna = getSkill('Ayurvedic Pharmacopoeia & Dravyaguna');
  const shodhana = getSkill('Standard Operating Procedures for Shodhana');
  const prakriti = getSkill('Prakriti Assessment & Analysis');

  if (!panchakarma || !documentation || !comm || !gmp) {
    console.warn('⚠️ Missing required skills for sample opportunity seed');
    return;
  }

  // 1. Panchakarma Therapist Intern (Flagship SIH sample role from PRD §8)
  await Opportunity.create({
    industryId: industryUser._id,
    domainId: domain._id,
    title: 'Panchakarma Therapist Intern',
    type: OpportunityType.INTERNSHIP,
    description:
      'Hands-on clinical internship at our NABH-accredited Ayurvedic wellness center. Assist senior Vaidyas in Purvakarma, Pradhanakarma procedures, patient intake, and clinical case tracking.',
    eligibility: 'Final year BAMS students or recent graduates.',
    requiredSkills: [
      {
        skillId: panchakarma._id,
        minProficiency: 75,
      },
      {
        skillId: documentation._id,
        minProficiency: 70,
      },
      {
        skillId: comm._id,
        minProficiency: 60,
      },
      {
        skillId: gmp._id,
        minProficiency: 65,
      },
    ],
    location: 'New Delhi / Jaipur',
    isRemote: false,
    durationWeeks: 12,
    status: 'open',
  });

  // 2. AYUSH Quality Control Analyst
  if (dravyaguna && shodhana) {
    await Opportunity.create({
      industryId: industryUser._id,
      domainId: domain._id,
      title: 'AYUSH Quality Control & Regulatory Analyst',
      type: OpportunityType.JOB,
      description:
        'Join our GMP-certified herbal extraction unit to oversee batch manufacturing records, raw material standardization, and Schedule T regulatory compliance.',
      eligibility: 'BAMS / B.Pharm (Ayurveda) / M.Sc Pharmacognosy.',
      requiredSkills: [
        {
          skillId: gmp._id,
          minProficiency: 80,
        },
        {
          skillId: dravyaguna._id,
          minProficiency: 70,
        },
        {
          skillId: shodhana._id,
          minProficiency: 75,
        },
      ],
      location: 'Haridwar / Pune',
      isRemote: false,
      durationWeeks: 24,
      status: 'open',
    });
  }

  // 3. Yoga & Lifestyle Wellness Mentor
  if (yoga && prakriti) {
    await Opportunity.create({
      industryId: industryUser._id,
      domainId: domain._id,
      title: 'Integrative Yoga Wellness Instructor',
      type: OpportunityType.INTERNSHIP,
      description:
        'Deliver guided evidence-based yoga therapy protocols for patients with lifestyle disorders. Evaluate individual Prakriti and tailor therapeutic yoga sequences.',
      eligibility: 'BNYS / BAMS / Certified Yoga Therapists (YCB Level 2+).',
      requiredSkills: [
        {
          skillId: yoga._id,
          minProficiency: 75,
        },
        {
          skillId: comm._id,
          minProficiency: 65,
        },
        {
          skillId: prakriti._id,
          minProficiency: 60,
        },
      ],
      location: 'Rishikesh / Bengaluru',
      isRemote: true,
      durationWeeks: 8,
      status: 'open',
    });
  }

  console.log('✅ Seeded 3 sample opportunities (including flagship Panchakarma role).');
};
