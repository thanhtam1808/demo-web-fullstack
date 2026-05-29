import express  from 'express';
import mongoose from 'mongoose';
import cors     from 'cors';
import 'dotenv/config';

import authRouter    from './routes/auth.js';
import moviesRouter  from './routes/movies.js';
import cinemasRouter from './routes/cinemas.js';
import bookingsRouter from './routes/bookings.js';
import ratingsRouter from './routes/ratings.js';
import adminRouter   from './routes/admin.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',     authRouter);
app.use('/api/movies',   moviesRouter);
app.use('/api/cinemas',  cinemasRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/ratings',  ratingsRouter);
app.use('/api/admin',    adminRouter);

app.get('/', (_req, res) => res.json({ message: 'Moonlight Tickets API ✨' }));

const PORT      = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/moonlight';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });
