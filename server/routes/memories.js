import express from 'express';
import mongoose from 'mongoose';
import { Memory } from '../models/Memory.js';

const router = express.Router();

// Fallback in-memory store if MongoDB is not active
let inMemoryMemories = [];

/**
 * GET /api/memories
 * Retrieves all stored relationship memories
 */
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const dbMemories = await Memory.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        source: 'database',
        data: dbMemories
      });
    }

    return res.status(200).json({
      success: true,
      source: 'memory-cache',
      data: inMemoryMemories
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch memories',
      error: error.message
    });
  }
});

/**
 * POST /api/memories
 * Adds a new custom memory
 */
router.post('/', async (req, res) => {
  try {
    const { title, date, location, caption, image, story, tag } = req.body;

    if (!title || !caption) {
      return res.status(400).json({
        success: false,
        message: 'Title and caption are required fields.'
      });
    }

    const newMemoryItem = {
      title,
      date: date || new Date().toLocaleDateString(),
      location: location || '',
      caption,
      image: image || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop',
      story: story || '',
      tag: tag || 'Special Memory',
      createdAt: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      const created = await Memory.create(newMemoryItem);
      return res.status(201).json({
        success: true,
        source: 'database',
        data: created
      });
    }

    inMemoryMemories.unshift({ ...newMemoryItem, _id: Date.now().toString() });
    return res.status(201).json({
      success: true,
      source: 'memory-cache',
      data: inMemoryMemories[0]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to save memory',
      error: error.message
    });
  }
});

export default router;
