import mongoose from 'mongoose';
import { Destination } from '../models/Destination.js';
import { seedDestinations } from '../data/seedData.js';

let isConnected = false;

export async function connectDB(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/khoj_ai';

  try {
    console.log(`[MongoDB] Attempting connection to: ${mongoUri.replace(/:([^:@]{4})[^:@]*@/, ':****@')}`);
    mongoose.set('strictQuery', false);
    
    // Connect with a reasonable timeout so we don't hang if no server is running
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });

    isConnected = true;
    console.log('✅ [MongoDB] Connected successfully via Mongoose.');

    // Seed destinations if empty
    const count = await Destination.countDocuments();
    if (count === 0) {
      console.log(`[MongoDB] Seeding ${seedDestinations.length} verified destinations...`);
      await Destination.insertMany(seedDestinations as any);
      console.log('✅ [MongoDB] Seeding complete.');
    } else {
      console.log(`[MongoDB] Database already has ${count} destinations.`);
    }
  } catch (error: any) {
    console.warn(`⚠️ [MongoDB] Live MongoDB connection not established (${error.message}).`);
    console.log('ℹ️ [KHOJ AI] Activating in-memory resilience store for seamless operation.');
    isConnected = false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

