import mongoose from 'mongoose';

const MemorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, default: '' },
    caption: { type: String, required: true },
    image: { type: String, required: true },
    story: { type: String, default: '' },
    tag: { type: String, default: 'Moment' }
  },
  { timestamps: true }
);

export const Memory = mongoose.models.Memory || mongoose.model('Memory', MemorySchema);
