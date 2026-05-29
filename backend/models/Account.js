import mongoose from 'mongoose';
import bcrypt   from 'bcryptjs';

const accountSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['admin', 'customer'], default: 'customer' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

accountSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

accountSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model('Account', accountSchema);
