import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isDbConnected } from '../server/config/db.js';
import destinationRoutes from '../server/routes/destinations.js';
import questRoutes from '../server/routes/quests.js';
import aiRoutes from '../server/routes/ai.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Initialize DB connection on lambda cold-start
let dbInitPromise: Promise<void> | null = null;
app.use(async (req, res, next) => {
  if (!isDbConnected()) {
    if (!dbInitPromise) {
      dbInitPromise = connectDB();
    }
    try {
      await dbInitPromise;
    } catch (e) {
      // Handled by resilient fallback in store
    }
  }
  next();
});

// Mount API routes
app.use('/api/destinations', destinationRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    product: 'KHOJ AI - Real Local Discovery Engine',
    database: isDbConnected() ? 'MongoDB Connected' : 'Resilient Knowledge Store Active',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY'),
    timestamp: new Date().toISOString()
  });
});

export default app;
