import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  poster:      { type: String, default: '' },
  banner:      { type: String, default: '' },
  genre:       { type: String, default: '' },
  duration:    { type: String, default: '' },
  language:    { type: String, default: '' },
  releaseDate: { type: String, default: '' },
  trailer:     { type: String, default: '' },
  status:      { type: String, enum: ['showing', 'upcoming', 'ended'], default: 'showing' },
}, { timestamps: true });

export default mongoose.model('Movie', movieSchema);
