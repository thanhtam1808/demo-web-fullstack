import { Router } from 'express';
import Movie       from '../models/Movie.js';
import Rating      from '../models/Rating.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = Router();

async function withRating(movie) {
  const ratings = await Rating.find({ movieId: movie._id });
  const avg = ratings.length
    ? (ratings.reduce((s, r) => s + r.score, 0) / ratings.length).toFixed(1)
    : null;
  return { ...movie.toObject(), avgRating: avg, ratingCount: ratings.length };
}

// GET /api/movies
router.get('/', async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    const result = await Promise.all(movies.map(withRating));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/movies/:id
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Không tìm thấy phim' });

    const ratings = await Rating.find({ movieId: movie._id })
      .populate('customerId', 'name')
      .sort({ createdAt: -1 });

    const avg = ratings.length
      ? (ratings.reduce((s, r) => s + r.score, 0) / ratings.length).toFixed(1)
      : null;

    res.json({ ...movie.toObject(), avgRating: avg, ratingCount: ratings.length, ratings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/movies (admin)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/movies/:id (admin)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!movie) return res.status(404).json({ message: 'Không tìm thấy phim' });
    res.json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/movies/:id (admin)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Không tìm thấy phim' });
    res.json({ message: 'Đã xoá phim thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
