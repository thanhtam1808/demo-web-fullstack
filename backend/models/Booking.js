import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  movieId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Movie',    required: true },
  cinemaId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Cinema',   required: true },
  showDate:   { type: String, required: true },
  showTime:   { type: String, required: true },
  seats:      { type: [String], required: true },
  totalPrice: { type: Number, default: 0 },
  status:     { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
