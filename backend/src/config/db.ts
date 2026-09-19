import mongoose from 'mongoose';
import { env } from './env';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedInitialDomains } from '../seeds/initialDomains';
import { seedInitialOpportunities } from '../seeds/initialOpportunities';
import { seedCareerRoles } from '../seeds/careerRoles';

const seedDomainsIfEmpty = async (): Promise<void> => {
  await seedInitialDomains();
  await seedCareerRoles();
  await seedInitialOpportunities();
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
    console.warn(`⚠️  MongoDB connection failed (${error.message}). Falling back to in-memory database...`);
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
      await seedDomainsIfEmpty();
    } catch (fallbackError) {
      console.error('❌ In-Memory MongoDB fallback also failed:', fallbackError);
      process.exit(1);
    }
  }
};
