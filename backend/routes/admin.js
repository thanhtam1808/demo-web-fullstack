import { Router } from 'express';
import Account     from '../models/Account.js';
import Customer    from '../models/Customer.js';
import Booking     from '../models/Booking.js';
import Movie       from '../models/Movie.js';
import Cinema      from '../models/Cinema.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = Router();

// GET /api/admin/stats
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const [userCount, movieCount, cinemaCount, bookings] = await Promise.all([
      Account.countDocuments({ role: 'customer' }),
      Movie.countDocuments(),
      Cinema.countDocuments(),
      Booking.find({ status: 'confirmed' }),
    ]);
    const revenue = bookings.reduce((s, b) => s + b.totalPrice, 0);
    res.json({ userCount, movieCount, cinemaCount, bookingCount: bookings.length, revenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const accounts = await Account.find().select('-password').sort({ createdAt: -1 });
    const users = await Promise.all(accounts.map(async (acc) => {
      const profile      = await Customer.findOne({ accountId: acc._id });
      const bookingCount = profile ? await Booking.countDocuments({ customerId: profile._id }) : 0;
      return { ...acc.toObject(), name: profile?.name || '', phone: profile?.phone || '', bookingCount };
    }));
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/users/:id/toggle
router.patch('/users/:id/toggle', auth, adminOnly, async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Không tìm thấy user' });
    account.isActive = !account.isActive;
    await account.save();
    res.json({ message: account.isActive ? 'Đã mở khoá tài khoản' : 'Đã khoá tài khoản', isActive: account.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
