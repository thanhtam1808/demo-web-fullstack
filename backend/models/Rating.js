import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  movieId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Movie',    required: true },
  score:      { type: Number, min: 1, max: 10, required: true },
  comment:    { type: String, default: '' },
}, { timestamps: true });

ratingSchema.index({ customerId: 1, movieId: 1 }, { unique: true });

export default mongoose.model('Rating', ratingSchema);
