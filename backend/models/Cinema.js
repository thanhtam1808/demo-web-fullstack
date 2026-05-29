import mongoose from 'mongoose';

const cinemaSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  location:  { type: String, required: true },
  city:      { type: String, default: '' },
  phone:     { type: String, default: '' },
  seats:     { type: Number, default: 100 },
  showtimes: { type: [String], default: ['10:00', '13:00', '16:00', '19:00', '21:30'] },
}, { timestamps: true });

export default mongoose.model('Cinema', cinemaSchema);
