import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, isDbConnected } from './config/db.js';
import destinationRoutes from './routes/destinations.js';
import questRoutes from './routes/quests.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/destinations', destinationRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/ai', aiRoutes);

// Health & Status Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    product: 'KHOJ AI - Real Local Discovery Engine',
    database: isDbConnected() ? 'MongoDB Connected' : 'Resilient Knowledge Store Active',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY'),
    timestamp: new Date().toISOString()
  });
});

// Production static file serving
const clientDistPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Catch-all to serve React SPA index.html
app.use((req: Request, res: Response) => {
  // If request is for an API route not matched above, return 404 JSON
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API route not found' });
  }
  // Otherwise serve React SPA index.html if it exists
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('KHOJ AI Backend is running. Vite dev server runs on port 5173.');
    }
  });
});

// Start Server
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`
=====================================================
🚀 KHOJ AI BACKEND RUNNING ON http://localhost:${PORT}
🧭 Your city is hiding stories.
📦 API Ready at http://localhost:${PORT}/api/health
=====================================================
`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
