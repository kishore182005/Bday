import express from 'express';
import mongoose from 'mongoose';
import { BirthdayMessage } from '../models/BirthdayMessage.js';

const router = express.Router();

let inMemoryMessages = [];

/**
 * GET /api/birthday
 * Fetches saved birthday notes
 */
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const messages = await BirthdayMessage.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        source: 'database',
        data: messages
      });
    }

    return res.status(200).json({
      success: true,
      source: 'memory-cache',
      data: inMemoryMessages
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch birthday notes',
      error: error.message
    });
  }
});

/**
 * POST /api/birthday
 * Saves a birthday note
 */
router.post('/', async (req, res) => {
  try {
    const { girlfriendName, message, senderName, source } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required.'
      });
    }

    const newMsg = {
      girlfriendName: girlfriendName || 'Elena',
      message,
      senderName: senderName || 'Kishore',
      source: source || 'custom',
      createdAt: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      const created = await BirthdayMessage.create(newMsg);
      return res.status(201).json({
        success: true,
        source: 'database',
        data: created
      });
    }

    inMemoryMessages.unshift({ ...newMsg, _id: Date.now().toString() });
    return res.status(201).json({
      success: true,
      source: 'memory-cache',
      data: inMemoryMessages[0]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to save birthday note',
      error: error.message
    });
  }
});

export default router;
