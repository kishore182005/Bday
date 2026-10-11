import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import aiRoutes from './routes/ai.js';
import memoriesRoutes from './routes/memories.js';
import birthdayRoutes from './routes/birthday.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/memories', memoriesRoutes);
app.use('/api/birthday', birthdayRoutes);

// Serve static frontend assets if built
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected (using memory/fallback)',
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE')
  });
});

// Root API info fallback (only if frontend is not served)
app.get('/api', (req, res) => {
  res.json({
    message: 'Love Story API Server is online! 💖',
    healthCheck: '/api/health',
    endpoints: [
      '/api/ai/generate-message',
      '/api/memories',
      '/api/birthday',
      '/api/health'
    ]
  });
});

// SPA fallback for frontend client-side routing
if (fs.existsSync(distPath)) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'Love Story API Server is online! 💖 (Run "npm run build" to serve the frontend here too)',
      healthCheck: '/api/health'
    });
  });
}

// Optional MongoDB Connection with fast timeout
if (MONGODB_URI && MONGODB_URI !== 'mongodb://localhost:27017/birthday_db') {
  mongoose
    .connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    })
    .then(() => console.log('✨ [Database] MongoDB successfully connected!'))
    .catch((err) => {
      console.warn('⚠️ [Database] MongoDB connection skipped or failed:', err.message);
      console.log('ℹ️ [Database] App is running seamlessly using internal romantic data and fallback cache.');
    });
} else {
  console.log('ℹ️ [Database] Running in standalone mode. MongoDB is optional and all features are fully active via local data.');
}

app.listen(PORT, () => {
  console.log(`🌌 [Love Story Server] Running on http://localhost:${PORT}`);
  console.log(`✨ [API Endpoints] /api/ai/generate-message | /api/memories | /api/birthday | /api/health`);
});
