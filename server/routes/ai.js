import express from 'express';
import { generateRomanticMessage } from '../services/gemini.js';
import { BirthdayMessage } from '../models/BirthdayMessage.js';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * POST /api/ai/generate-message
 * Generates an AI-powered personalized romantic birthday message via Gemini
 */
router.post('/generate-message', async (req, res) => {
  try {
    const { girlfriendName, nickname, memories, tone, save } = req.body;

    const result = await generateRomanticMessage({
      girlfriendName: girlfriendName || 'Elena',
      nickname: nickname || '',
      memories: memories || [],
      tone: tone || 'poetic'
    });

    // Optionally save to MongoDB if connected and requested
    if (save && mongoose.connection.readyState === 1 && result.message) {
      try {
        await BirthdayMessage.create({
          girlfriendName: girlfriendName || 'Elena',
          message: result.message,
          source: result.source || 'ai'
        });
      } catch (dbErr) {
        console.warn('Could not save AI message to database:', dbErr.message);
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('AI route error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate message',
      error: error.message
    });
  }
});

export default router;
