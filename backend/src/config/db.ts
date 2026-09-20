import mongoose from 'mongoose';
import { env } from './env';
import Domain from '../models/Domain';
import { seedInitialDomains } from '../seeds/initialDomains';
import { seedInitialOpportunities } from '../seeds/initialOpportunities';
import { seedCareerRoles } from '../seeds/careerRoles';

const seedDomainsIfEmpty = async (): Promise<void> => {
  const domainCount = await Domain.countDocuments();
  if (domainCount >= 2) {
    console.log('✅ Seed data already exists, skipping seed.');
    return;
  }
  console.log('🌱 Seeding initial data...');
  await seedInitialDomains();
  await seedCareerRoles();
  await seedInitialOpportunities();
  console.log('✅ Seed complete.');
};

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await seedDomainsIfEmpty();

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

  } catch (error: any) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.error('Please ensure MONGODB_URI in your .env points to a running, persistent MongoDB instance.');
    console.error('Example: MONGODB_URI=mongodb://localhost:27017/skillbridge');
    process.exit(1);
  }
};

