import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  daysLeft: {
    type: Number,
    required: true,
  },
  progress: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: true,
    enum: ['all', 'cafe', 'social'],
  },
}, {
  timestamps: true,
});

export default mongoose.model('Business', businessSchema); 