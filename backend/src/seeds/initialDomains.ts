import mongoose from 'mongoose';
import Assessment from '../models/Assessment';
import Domain from '../models/Domain';
import Skill from '../models/Skill';
import SkillCategory from '../models/SkillCategory';

interface SeedSkill {
  category: string;
  name: string;
  description: string;
  question: {
    text: string;
    options: string[];
    correctOptionIndex: number;
  };
}

const buildQuestionBank = (
  skillName: string,
  question: SeedSkill['question']
): SeedSkill['question'][] => [
  question,
  {
    text: `Which approach best demonstrates practical competence in ${skillName}?`,
    options: ['Apply the principle correctly and verify the result', 'Skip requirements', 'Avoid checking the result', 'Use an unrelated method'],
    correctOptionIndex: 0,
  },
  {
    text: `What should be done first when solving a ${skillName} problem?`,
    options: ['Clarify the requirement and relevant constraints', 'Change the goal', 'Ignore available evidence', 'Start without understanding the task'],
    correctOptionIndex: 0,
  },
  {
    text: `Which practice improves reliability when working with ${skillName}?`,
    options: ['Document decisions and test the expected outcome', 'Rely on memory only', 'Remove validation', 'Avoid feedback'],
    correctOptionIndex: 0,
  },
  {
    text: `How should a learner improve their ${skillName} proficiency?`,
    options: ['Practice progressively difficult, realistic tasks', 'Repeat an answer without understanding it', 'Avoid practical work', 'Skip review'],
    correctOptionIndex: 0,
  },
  {
    text: `Which result indicates responsible use of ${skillName}?`,
    options: ['The result is explainable, checked, and appropriate to the context', 'The result cannot be explained', 'The result ignores constraints', 'The result is never reviewed'],
    correctOptionIndex: 0,
  },
  {
    text: `What is a useful way to communicate work involving ${skillName}?`,
    options: ['State the approach, assumptions, and evidence clearly', 'Provide no context', 'Hide limitations', 'Use unrelated terminology'],
    correctOptionIndex: 0,
  },
  {
    text: `When an error is found in ${skillName}, what is the best response?`,
    options: ['Reproduce it, identify the cause, and verify the fix', 'Ignore it', 'Delete the evidence', 'Blame the user'],
    correctOptionIndex: 0,
  },
  {
    text: `Which behavior supports safe and ethical ${skillName} practice?`,
    options: ['Respect requirements, limits, and the people affected by the result', 'Bypass all safeguards', 'Share sensitive data freely', 'Treat every context as identical'],
    correctOptionIndex: 0,
  },
  {
    text: `What distinguishes verified ability in ${skillName}?`,
    options: ['Consistent performance on an objective assessment', 'An unsupported claim', 'A copied answer', 'A job title alone'],
    correctOptionIndex: 0,
  },
];

const proficiencyScale = {
  beginner: [0, 39],
  developing: [40, 59],
  intermediate: [60, 74],
  advanced: [75, 89],
  expert: [90, 100],
};

const domainDefinitions = [
  {
    name: 'Engineering',
    slug: 'engineering',
    description: 'Software engineering, data, web platforms, and cloud systems.',
    categories: [
      {
        name: 'Programming',
        description: 'Core programming concepts and maintainable software development.',
      },
      {
        name: 'Data & Systems',
        description: 'Algorithms, databases, APIs, and system fundamentals.',
      },
      {
        name: 'Web & Cloud',
        description: 'Modern web application development and cloud delivery.',
      },
    ],
    skills: [
      {
        category: 'Programming',
        name: 'JavaScript & TypeScript',
        description: 'Writing type-safe, maintainable applications with modern JavaScript.',
        question: {
          text: 'Which TypeScript feature catches many invalid values before runtime?',
          options: ['Static type checking', 'CSS modules', 'HTTP caching', 'Database indexing'],
          correctOptionIndex: 0,
        },
      },
      {
        category: 'Data & Systems',
        name: 'Data Structures & Algorithms',
        description: 'Selecting data structures and algorithms appropriate to a problem.',
        question: {
          text: 'What is the average lookup complexity of a hash table by key?',
          options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
          correctOptionIndex: 0,
        },
      },
      {
        category: 'Data & Systems',
        name: 'Database Design',
        description: 'Designing reliable schemas, indexes, and queries for application data.',
        question: {
          text: 'What is a primary purpose of a database index?',
          options: ['Speed up selected queries', 'Encrypt every row', 'Replace backups', 'Validate UI colors'],
          correctOptionIndex: 0,
        },
      },
      {
        category: 'Web & Cloud',
        name: 'Frontend Development',
        description: 'Building accessible, responsive interfaces with component-based frameworks.',
        question: {
          text: 'Which practice improves accessibility for a form control?',
          options: ['Associating it with a descriptive label', 'Removing its label', 'Using color alone', 'Disabling keyboard focus'],
          correctOptionIndex: 0,
        },
      },
      {
        category: 'Data & Systems',
        name: 'REST API Design',
        description: 'Designing predictable, secure HTTP APIs and resource contracts.',
        question: {
          text: 'Which HTTP method is conventionally used to create a new resource?',
          options: ['POST', 'GET', 'HEAD', 'OPTIONS'],
          correctOptionIndex: 0,
        },
      },
      {
        category: 'Web & Cloud',
        name: 'Cloud & DevOps Fundamentals',
        description: 'Understanding deployment, observability, and reliable cloud delivery.',
        question: {
          text: 'What is the main purpose of a CI pipeline?',
          options: ['Automatically build and validate changes', 'Replace source control', 'Store passwords in code', 'Avoid testing'],
          correctOptionIndex: 0,
        },
      },
    ] as SeedSkill[],
  },
  {
    name: 'Medical / Healthcare',
    slug: 'medical-healthcare',
    description: 'Foundational healthcare knowledge, safe clinical practice, and communication.',
    categories: [
      {
        name: 'Anatomy & Physiology',
        description: 'Foundations of body structure and normal function.',
      },
      {
        name: 'Clinical Practice',
        description: 'Safe clinical skills, terminology, and medication fundamentals.',
      },
      {
        name: 'Patient Safety & Communication',
        description: 'Documentation, safety, teamwork, and patient-centered care.',
      },
    ],
    skills: [
      {
        category: 'Anatomy & Physiology',
        name: 'Anatomy & Physiology',
        description: 'Understanding major body systems and their normal functions.',
        question: {
          text: 'Which organ is primarily responsible for pumping blood through the body?',
          options: ['Heart', 'Liver', 'Kidney', 'Pancreas'],
          correctOptionIndex: 0,
        },
      },
      {
        category: 'Clinical Practice',
        name: 'Pharmacology Fundamentals',
        description: 'Applying core concepts of medication safety, dosage, and effects.',
        question: {
          text: 'What should be checked before administering a medication?',
          options: ['The right patient, medication, dose, route, and time', 'Only the package color', 'Only the room number', 'The patient social media profile'],
          correctOptionIndex: 0,
        },
      },
      {
        category: 'Clinical Practice',
        name: 'Basic Clinical Skills',
        description: 'Performing foundational observations and routine clinical procedures safely.',
        question: {
          text: 'Why is hand hygiene performed before patient contact?',
          options: ['To reduce transmission of microorganisms', 'To measure blood pressure', 'To replace gloves in every case', 'To diagnose infection'],
          correctOptionIndex: 0,
        },
      },
      {
        category: 'Patient Safety & Communication',
        name: 'Patient Safety',
        description: 'Recognizing preventable risks and applying safe care practices.',
        question: {
          text: 'What is a reliable way to identify a patient before care?',
          options: ['Use at least two approved identifiers', 'Use the bed location only', 'Ask another patient', 'Guess from appearance'],
          correctOptionIndex: 0,
        },
      },
      {
        category: 'Clinical Practice',
        name: 'Medical Terminology',
        description: 'Using common clinical terms accurately in care and documentation.',
        question: {
          text: 'The prefix “brady-” generally indicates what?',
          options: ['Slow', 'Fast', 'Around', 'Within'],
          correctOptionIndex: 0,
        },
      },
      {
        category: 'Patient Safety & Communication',
        name: 'Clinical Communication',
        description: 'Communicating clearly with patients and multidisciplinary care teams.',
        question: {
          text: 'Which communication practice supports informed consent?',
          options: ['Explain benefits, risks, alternatives, and confirm understanding', 'Use unexplained jargon', 'Skip questions', 'Document consent after the procedure only'],
          correctOptionIndex: 0,
        },
      },
    ] as SeedSkill[],
  },
];

export const seedInitialDomains = async (): Promise<void> => {
  for (const definition of domainDefinitions) {
    let domain = await Domain.findOne({ slug: definition.slug });
    if (!domain) {
      domain = await Domain.create({
        name: definition.name,
        slug: definition.slug,
        description: definition.description,
        isFlagship: definition.slug === 'engineering',
      });
    }

    const categories = new Map<string, string>();
    for (const categoryDefinition of definition.categories) {
      let category = await SkillCategory.findOne({
        domainId: domain._id,
        name: categoryDefinition.name,
      });
      if (!category) {
        category = await SkillCategory.create({
          domainId: domain._id,
          name: categoryDefinition.name,
          description: categoryDefinition.description,
        });
      }
      categories.set(categoryDefinition.name, category._id.toString());
    }

    for (const skillDefinition of definition.skills) {
      let skill = await Skill.findOne({
        domainId: domain._id,
        name: skillDefinition.name,
      });
      if (!skill) {
        skill = await Skill.create({
          domainId: domain._id,
          categoryId: categories.get(skillDefinition.category),
          name: skillDefinition.name,
          description: skillDefinition.description,
          proficiencyScale,
          assessmentTypesSupported: ['mcq'],
        });
      }

      const questions = buildQuestionBank(skillDefinition.name, skillDefinition.question).map(
        (question) => ({ ...question, _id: new mongoose.Types.ObjectId() })
      );
      const assessment = await Assessment.findOne({ skillId: skill._id });
      if (!assessment) {
        await Assessment.create({
          skillId: skill._id,
          type: 'mcq',
          durationMinutes: 15,
          questions,
        });
      } else if (assessment.questions.length < 10) {
        assessment.questions = questions;
        assessment.durationMinutes = 15;
        await assessment.save();
      }
    }
  }
};
