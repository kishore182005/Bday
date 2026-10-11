import mongoose from 'mongoose';

const BirthdayMessageSchema = new mongoose.Schema(
  {
    girlfriendName: { type: String, default: 'My Love' },
    message: { type: String, required: true },
    senderName: { type: String, default: 'Your Love' },
    source: { type: String, enum: ['ai', 'custom', 'fallback'], default: 'ai' },
    savedToFavorites: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const BirthdayMessage =
  mongoose.models.BirthdayMessage || mongoose.model('BirthdayMessage', BirthdayMessageSchema);
