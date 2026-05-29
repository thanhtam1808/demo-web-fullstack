import axiosClient from './axiosClient';

// ── Auth ─────────────────────────────────────────────────
export const authApi = {
  register : (data)   => axiosClient.post('/auth/register', data),
  login    : (data)   => axiosClient.post('/auth/login', data),
  getMe    : ()       => axiosClient.get('/auth/me'),
};

// ── Movies ───────────────────────────────────────────────
export const movieApi = {
  getAll   : (params) => axiosClient.get('/movies', { params }),
  getById  : (id)     => axiosClient.get(`/movies/${id}`),
  create   : (data)   => axiosClient.post('/movies', data),
  update   : (id, d)  => axiosClient.put(`/movies/${id}`, d),
  delete   : (id)     => axiosClient.delete(`/movies/${id}`),
};

// ── Cinemas ──────────────────────────────────────────────
export const cinemaApi = {
  getAll   : ()       => axiosClient.get('/cinemas'),
  getById  : (id)     => axiosClient.get(`/cinemas/${id}`),
};

// ── Bookings ─────────────────────────────────────────────
export const bookingApi = {
  create   : (data)   => axiosClient.post('/bookings', data),
  getMy    : ()       => axiosClient.get('/bookings/my'),
  getById  : (id)     => axiosClient.get(`/bookings/${id}`),
  cancel   : (id)     => axiosClient.patch(`/bookings/${id}/cancel`),
};

// ── Ratings ──────────────────────────────────────────────
export const ratingApi = {
  create        : (data) => axiosClient.post('/ratings', data),
  getByMovie    : (id)   => axiosClient.get(`/ratings/movie/${id}`),
};

// ── Admin ─────────────────────────────────────────────────
export const adminApi = {
  getStats      : ()     => axiosClient.get('/admin/stats'),
  getUsers      : ()     => axiosClient.get('/admin/users'),
  toggleUser    : (id)   => axiosClient.patch(`/admin/users/${id}/toggle`),
};
