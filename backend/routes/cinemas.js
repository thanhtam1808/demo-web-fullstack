import { Router } from 'express';
import Cinema      from '../models/Cinema.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = Router();

// GET /api/cinemas
router.get('/', async (_req, res) => {
  try {
    res.json(await Cinema.find().sort({ name: 1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/cinemas/:id
router.get('/:id', async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    if (!cinema) return res.status(404).json({ message: 'Không tìm thấy rạp' });
    res.json(cinema);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/cinemas (admin)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    res.status(201).json(await Cinema.create(req.body));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/cinemas/:id (admin)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const cinema = await Cinema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cinema) return res.status(404).json({ message: 'Không tìm thấy rạp' });
    res.json(cinema);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/cinemas/:id (admin)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Cinema.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xoá rạp' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
