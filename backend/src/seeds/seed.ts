import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables before anything else
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { env } from '../config/env';

import { seedInitialDomains } from './initialDomains';
import { seedInitialOpportunities } from './initialOpportunities';

export const runFullSeed = async () => {
  try {
    console.log(`🚀 Connecting to MongoDB: ${env.MONGODB_URI}`);
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB.');

    console.log('🗑️  Wiping existing database collections (domain-as-config reset)...');
    const collections = await mongoose.connection.db!.collections();
    for (const collection of collections) {
      await collection.drop();
    }
    console.log('✅ Database wiped cleanly.');

    console.log('=========================================');
    console.log('   STARTING SKILLBRIDGE DATA SEEDING     ');
    console.log('=========================================');

    await seedInitialDomains();
    await seedInitialOpportunities();

    console.log('=========================================');
    console.log('✅ ALL SEED OPERATIONS COMPLETED SUCCESSFULLY');
    console.log('=========================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ FATAL ERROR DURING SEEDING:');
    console.error(error);
    process.exit(1);
  }
};

runFullSeed();
