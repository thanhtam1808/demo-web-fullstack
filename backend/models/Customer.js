import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  phone:     { type: String, default: '' },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true, unique: true },
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);
