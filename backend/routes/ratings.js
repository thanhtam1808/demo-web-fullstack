import { Router } from 'express';
import Rating      from '../models/Rating.js';
import Customer    from '../models/Customer.js';
import { auth }    from '../middleware/auth.js';

const router = Router();

// POST /api/ratings
router.post('/', auth, async (req, res) => {
  try {
    const { movieId, score, comment } = req.body;
    if (!movieId || !score)
      return res.status(400).json({ message: 'Cần có movieId và score' });
    if (score < 1 || score > 10)
      return res.status(400).json({ message: 'Score phải từ 1 đến 10' });

    const customer = await Customer.findOne({ accountId: req.user.id });
    if (!customer)
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ khách hàng' });

    const rating = await Rating.findOneAndUpdate(
      { customerId: customer._id, movieId },
      { score, comment: comment || '' },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json(rating);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/ratings/movie/:movieId
router.get('/movie/:movieId', async (req, res) => {
  try {
    const ratings = await Rating.find({ movieId: req.params.movieId })
      .populate('customerId', 'name')
      .sort({ createdAt: -1 });
    const avg = ratings.length
      ? (ratings.reduce((s, r) => s + r.score, 0) / ratings.length).toFixed(1)
      : null;
    res.json({ ratings, avgRating: avg, count: ratings.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
