import LearningResource from '../models/LearningResource';
import { ISkill } from '../models/Skill';

export const seedSampleResources = async (skills: ISkill[]) => {
  console.log('📚 Seeding Curated Learning Resources...');

  const getSkill = (name: string) => skills.find((s) => s.name === name);

  const resourcesToCreate = [];

  const panchakarma = getSkill('Panchakarma Technique');
  if (panchakarma) {
    resourcesToCreate.push(
      {
        skillId: panchakarma._id,
        title: 'NCISM Practical Guidelines: Shodhana Chikitsa',
        url: 'https://ncism.gov.in/curriculum/panchakarma',
        type: 'article',
        estimatedHours: 4,
      },
      {
        skillId: panchakarma._id,
        title: 'Clinical Execution of Vamana & Virechana - Case Studies',
        url: 'https://youtube.com/watch?v=sample-panchakarma',
        type: 'video',
        estimatedHours: 2,
      }
    );
  }

  const gmp = getSkill('Good Manufacturing Practices (GMP) in AYUSH');
  if (gmp) {
    resourcesToCreate.push(
      {
        skillId: gmp._id,
        title: 'Schedule T: GMP Guidelines for ASU Drugs',
        url: 'https://ayush.gov.in/docs/schedule-t-gmp.pdf',
        type: 'article',
        estimatedHours: 3,
      },
      {
        skillId: gmp._id,
        title: 'Drafting Batch Manufacturing Records (BMR)',
        url: 'https://skillbridge.ayush/training/bmr-compliance',
        type: 'course',
        estimatedHours: 6,
      }
    );
  }

  const comm = getSkill('Clinical Communication in Traditional Medicine');
  if (comm) {
    resourcesToCreate.push(
      {
        skillId: comm._id,
        title: 'Counseling Patients on Pathya-Apathya',
        url: 'https://mooc.ayush/clinical-communication',
        type: 'course',
        estimatedHours: 5,
      }
    );
  }

  const yoga = getSkill('Yoga Therapy Protocols for Lifestyle Disorders');
  if (yoga) {
    resourcesToCreate.push(
      {
        skillId: yoga._id,
        title: 'YCB Therapeutic Yoga Protocols specific to Diabetes & Hypertension',
        url: 'https://yogacertificationboard.nic.in/therapy',
        type: 'article',
        estimatedHours: 4,
      }
    );
  }

  if (resourcesToCreate.length > 0) {
    await LearningResource.create(resourcesToCreate);
    console.log(`✅ Seeded ${resourcesToCreate.length} learning resources mapping to gap skills.`);
  }
};
