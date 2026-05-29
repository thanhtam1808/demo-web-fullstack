import { Router } from 'express';
import Booking     from '../models/Booking.js';
import Customer    from '../models/Customer.js';
import { auth }    from '../middleware/auth.js';

const router = Router();
const PRICE_PER_SEAT = 85000;

// POST /api/bookings
router.post('/', auth, async (req, res) => {
  try {
    const { movieId, cinemaId, showDate, showTime, seats } = req.body;

    if (!movieId || !cinemaId || !showDate || !showTime || !seats?.length)
      return res.status(400).json({ message: 'Thiếu thông tin: movieId, cinemaId, showDate, showTime, seats' });

    const customer = await Customer.findOne({ accountId: req.user.id });
    if (!customer)
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ khách hàng' });

    const booking = await Booking.create({
      customerId: customer._id,
      movieId, cinemaId, showDate, showTime, seats,
      totalPrice: seats.length * PRICE_PER_SEAT,
    });

    const populated = await booking.populate([
      { path: 'movieId',  select: 'title poster' },
      { path: 'cinemaId', select: 'name location' },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/bookings/my
router.get('/my', auth, async (req, res) => {
  try {
    const customer = await Customer.findOne({ accountId: req.user.id });
    if (!customer)
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ khách hàng' });

    const bookings = await Booking.find({ customerId: customer._id })
      .populate('movieId',  'title poster genre duration')
      .populate('cinemaId', 'name location')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bookings/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movieId',  'title poster genre duration')
      .populate('cinemaId', 'name location');
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy vé' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    if (!booking) return res.status(404).json({ message: 'Không tìm thấy vé' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
