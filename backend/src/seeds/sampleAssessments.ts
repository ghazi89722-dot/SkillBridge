import Assessment from '../models/Assessment';
import { ISkill } from '../models/Skill';

export const seedSampleAssessments = async (skills: ISkill[]) => {
  console.log('📝 Seeding Assessment Question Banks...');

  const getSkill = (name: string) => skills.find((s) => s.name === name);

  // 1. Panchakarma Technique Assessment
  const panchakarmaSkill = getSkill('Panchakarma Technique');
  if (panchakarmaSkill) {
    await Assessment.create({
      skillId: panchakarmaSkill._id,
      type: 'mcq',
      durationMinutes: 20,
      questions: [
        {
          text: 'Which of the following is considered the primary Purvakarma (preparatory procedure) before Vamana karma?',
          options: [
            'Snehadhara and Swedana for 3–7 days',
            'Immediate administration of Madanaphala',
            'Total fasting for 48 hours',
            'Nasya therapy with Anu Taila',
          ],
          correctOptionIndex: 0,
        },
        {
          text: 'What is the standard Vega Lakshana indicating successful Vamana (Samyak Vanta)?',
          options: [
            'Passing blood in stool',
            'Expulsion of Kapha, followed by Pitta, ending with lightness in chest',
            'Severe abdominal cramps and thirst',
            'Dizziness and profuse perspiration',
          ],
          correctOptionIndex: 1,
        },
        {
          text: 'In standard Panchakarma practice, what is the optimum retention time for Matra Basti?',
          options: ['1–2 minutes', '10–15 minutes', '3–9 hours (Hrisva Kala)', '24 hours'],
          correctOptionIndex: 2,
        },
        {
          text: 'Which formulation is most commonly used as the drug of choice for Vamana in Classical Ayurveda?',
          options: ['Trivrit Lehya', 'Madanaphala Pippali Churna with Honey & Saindhava', 'Triphala Kashaya', 'Castor Oil with Milk'],
          correctOptionIndex: 1,
        },
        {
          text: 'What is the absolute contraindication for Virechana karma?',
          options: ['Pitta-dominant skin diseases', 'Garbhini (Pregnancy) and acute fever (Nava Jwara)', 'Chronic constipation', 'Obesity'],
          correctOptionIndex: 1,
        },
        {
          text: 'During Nasya administration, what should be the head position of the patient?',
          options: ['Erect 90 degrees', 'Kinchit Prapadita (slightly extended/tilted backward)', 'Prone lying face down', 'Left lateral position'],
          correctOptionIndex: 1,
        },
        {
          text: 'Which form of Swedana is classified as Niragni (non-fire) Swedana?',
          options: ['Nadi Sweda', 'Bashpa Sweda', 'Guru Pravarana (heavy blankets/exercise)', 'Patra Pinda Sweda'],
          correctOptionIndex: 2,
        },
        {
          text: 'What post-procedure dietary regimen is mandatory after major Panchakarma therapies?',
          options: ['Immediate heavy meal with ghee', 'Samsarjana Krama (Peya, Vilepi, Akrita Yusha, Krita Yusha)', 'Raw vegetable salads', 'Continuous fasting for 3 days'],
          correctOptionIndex: 1,
        },
        {
          text: 'In Shirodhara, what is the recommended height of the Dhara vessel above the forehead?',
          options: ['2–4 inches (4 Angula)', '12–15 inches', 'Touching the forehead', 'Over 2 feet'],
          correctOptionIndex: 0,
        },
        {
          text: 'Which complication indicates Asamyak (deficient) Virechana?',
          options: ['Lightness of body', 'Kapha and Pitta obstruction, heaviness in abdomen, itching', 'Dehydration', 'Clear sensory perception'],
          correctOptionIndex: 1,
        },
      ],
    });
  }

  // 2. Nadi Pariksha Assessment
  const nadiSkill = getSkill('Nadi Pariksha (Pulse Diagnosis)');
  if (nadiSkill) {
    await Assessment.create({
      skillId: nadiSkill._id,
      type: 'mcq',
      durationMinutes: 15,
      questions: [
        {
          text: 'Which finger detects the Vata component during radial pulse examination (Nadi Pariksha)?',
          options: ['Index finger (Tarjani)', 'Middle finger (Madhyama)', 'Ring finger (Anamika)', 'Little finger (Kanishthika)'],
          correctOptionIndex: 0,
        },
        {
          text: 'What is the classical movement characteristic of a Pitta-dominant pulse?',
          options: ['Sarpa Gati (snake-like, zigzag)', 'Manduka Gati (frog-like, jumping/bounding)', 'Hamsa Gati (swan-like, slow/steady)', 'Ashwa Gati (galloping)'],
          correctOptionIndex: 1,
        },
        {
          text: 'What is the recommended ideal time for performing accurate Nadi Pariksha?',
          options: ['Prabhata Kala (early morning on an empty stomach)', 'Immediately after lunch', 'Late night after exercise', 'After a hot water bath'],
          correctOptionIndex: 0,
        },
        {
          text: 'Which finger position reflects the Kapha dosha pulse wave?',
          options: ['Index finger', 'Middle finger', 'Ring finger (Anamika)', 'Thumb'],
          correctOptionIndex: 2,
        },
        {
          text: 'How should radial pulse be examined in male vs female patients traditionally?',
          options: ['Right wrist for males, Left wrist for females', 'Left wrist for both', 'Right wrist for both', 'Femoral artery for females'],
          correctOptionIndex: 0,
        },
      ],
    });
  }

  // 3. GMP Assessment
  const gmpSkill = getSkill('Good Manufacturing Practices (GMP) in AYUSH');
  if (gmpSkill) {
    await Assessment.create({
      skillId: gmpSkill._id,
      type: 'mcq',
      durationMinutes: 15,
      questions: [
        {
          text: 'Under the Drugs & Cosmetics Act, 1940, which Schedule governs Good Manufacturing Practices (GMP) for ASU drugs?',
          options: ['Schedule M', 'Schedule T', 'Schedule Y', 'Schedule H'],
          correctOptionIndex: 1,
        },
        {
          text: 'What is the primary requirement for raw herb storage under AYUSH GMP guidelines?',
          options: ['Open floor storage under direct sunlight', 'Segregated, well-ventilated, pest-controlled rooms off the floor on pallets', 'Freezer storage for all herbs', 'Plastic bags in humid basements'],
          correctOptionIndex: 1,
        },
        {
          text: 'What documentation is mandatory for every manufactured batch of Ayurvedic formulation?',
          options: ['Only the sales invoice', 'Batch Manufacturing Record (BMR) with raw material release certificates', 'Marketing brochure', 'Informal diary notes'],
          correctOptionIndex: 1,
        },
        {
          text: 'What is the maximum permissible limit for lead (Pb) in Ayurvedic herbal products as per Pharmacopoeial standards?',
          options: ['10 ppm', '100 ppm', '0.01 ppm', 'No limit exists'],
          correctOptionIndex: 0,
        },
        {
          text: 'In an ASU manufacturing facility, why is differential air pressure maintained between processing areas?',
          options: ['To reduce electricity bills', 'To prevent cross-contamination between different drug formulations', 'To maintain a warm temperature', 'To prevent noise transmission'],
          correctOptionIndex: 1,
        },
      ],
    });
  }

  // 4. Patient Case History Assessment
  const caseHistorySkill = getSkill('Patient Case History & Documentation');
  if (caseHistorySkill) {
    await Assessment.create({
      skillId: caseHistorySkill._id,
      type: 'mcq',
      durationMinutes: 15,
      questions: [
        {
          text: 'Which parameter of Dashavidha Pariksha evaluates the patient’s physical endurance and functional capacity?',
          options: ['Desha Pariksha', 'Bala Pariksha', 'Kala Pariksha', 'Agni Pariksha'],
          correctOptionIndex: 1,
        },
        {
          text: 'In standardized AYUSH clinical documentation, what does "Asatmya" refer to?',
          options: ['Compatible wholesome food', 'Incompatible or unwholesome factors that trigger disease', 'The patient’s birth place', 'Blood pressure readings'],
          correctOptionIndex: 1,
        },
        {
          text: 'Why is recording "Koshtha" (bowel habit) critical before prescribing therapeutic purgation?',
          options: ['To determine Krura vs Mridu Koshtha for appropriate dosage of purgative drug', 'To determine patient height', 'Only for billing records', 'It is not relevant in Ayurveda'],
          correctOptionIndex: 0,
        },
        {
          text: 'What is the ethical and legal requirement before starting any invasive Ayurvedic procedure like Ksharasutra or Raktamokshana?',
          options: ['Verbal notification only', 'Signed Informed Written Consent with risks explained', 'Approval from police', 'No consent is necessary'],
          correctOptionIndex: 1,
        },
        {
          text: 'Which diagnostic examination evaluates the patient’s tongue coating and digestive fire status?',
          options: ['Jihwa Pariksha', 'Druk Pariksha', 'Shabda Pariksha', 'Sparsha Pariksha'],
          correctOptionIndex: 0,
        },
      ],
    });
  }

  // 5. Yoga Therapy Assessment
  const yogaSkill = getSkill('Yoga Therapy Protocols for Lifestyle Disorders');
  if (yogaSkill) {
    await Assessment.create({
      skillId: yogaSkill._id,
      type: 'mcq',
      durationMinutes: 15,
      questions: [
        {
          text: 'Which pranayama is contraindicated in patients with severe, uncontrolled essential hypertension?',
          options: ['Sheetali Pranayama', 'Bhastrika & vigorous Kapalabhati', 'Bhramari Pranayama', 'Nadi Shodhana'],
          correctOptionIndex: 1,
        },
        {
          text: 'Which yogic practice is clinically proven to enhance insulin sensitivity in Type 2 Diabetes management?',
          options: ['Mandukasana and Ardha Matsyendrasana (abdominal compression)', 'Shavasana exclusively', 'Shirshasana for 30 minutes', 'Trataka only'],
          correctOptionIndex: 0,
        },
        {
          text: 'What is the key mechanism through which Bhramari Pranayama promotes autonomic nervous system balance?',
          options: ['Vigorous cardiac strain', 'Increased nitric oxide production and enhanced parasympathetic vagal tone', 'Rapid hyperventilation', 'Elevating sympathetic adrenaline release'],
          correctOptionIndex: 1,
        },
        {
          text: 'In managing chronic lumbar spondylosis, which asana group must be strictly avoided during acute pain?',
          options: ['Gentle Bhujangasana', 'Extreme unsupported forward bending (Paschimottanasana)', 'Makarasana', 'Supported Setu Bandhasana'],
          correctOptionIndex: 1,
        },
        {
          text: 'According to classical Hatha Yoga texts, which shatkarma is specific for balancing Kapha and clearing respiratory passages?',
          options: ['Neti and Kapalabhati', 'Nauli exclusively', 'Basti karma', 'Trataka'],
          correctOptionIndex: 0,
        },
      ],
    });
  }

  const additionalAssessments = [
    {
      skillName: 'Ksharasutra Preparation & Application',
      question: {
        text: 'What is the primary clinical use of Ksharasutra?',
        options: [
          'Management of fistula-in-ano through a medicated seton',
          'Treatment of acute fever',
          'Replacement for all surgical procedures',
          'Diagnosis of pulse disorders',
        ],
        correctOptionIndex: 0,
      },
    },
    {
      skillName: 'Ayurvedic Pharmacopoeia & Dravyaguna',
      question: {
        text: 'Which reference establishes official quality standards for Ayurvedic drugs in India?',
        options: [
          'Ayurvedic Pharmacopoeia of India',
          'Indian Penal Code',
          'National Building Code',
          'Food safety menu guidelines',
        ],
        correctOptionIndex: 0,
      },
    },
    {
      skillName: 'Standard Operating Procedures for Shodhana',
      question: {
        text: 'What is the main purpose of a documented Shodhana standard operating procedure?',
        options: [
          'To ensure the purification process is repeatable and safe',
          'To replace patient assessment',
          'To avoid recording batch details',
          'To permit any dose without review',
        ],
        correctOptionIndex: 0,
      },
    },
    {
      skillName: 'Prakriti Assessment & Analysis',
      question: {
        text: 'What does Prakriti assessment primarily describe?',
        options: [
          'An individual’s stable psychosomatic constitution',
          'Only the patient’s current temperature',
          'The expiry date of a medicine',
          'The manufacturing cost of a formulation',
        ],
        correctOptionIndex: 0,
      },
    },
    {
      skillName: 'Clinical Communication in Traditional Medicine',
      question: {
        text: 'Which practice best supports safe communication with a patient?',
        options: [
          'Explain the treatment plan, expected benefits, risks, and adherence requirements',
          'Use technical terms without checking understanding',
          'Avoid documenting patient questions',
          'Change the plan without informing the patient',
        ],
        correctOptionIndex: 0,
      },
    },
  ];

  for (const { skillName, question } of additionalAssessments) {
    const skill = getSkill(skillName);
    if (skill) {
      await Assessment.create({
        skillId: skill._id,
        type: 'mcq',
        durationMinutes: 10,
        questions: [question],
      });
    }
  }

  console.log('✅ Seeded MCQ assessments for all AYUSH skills.');
};
