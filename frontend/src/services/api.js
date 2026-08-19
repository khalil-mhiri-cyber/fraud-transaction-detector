import axios from 'axios';

// Authenticated API — adds JWT Bearer token to every request
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('jwt_user');
      localStorage.removeItem('sentinel_auth');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Public auth API (no token) ────────────────────────────────
export const authApi = axios.create({
  baseURL: 'http://localhost:8080/auth',
  headers: { 'Content-Type': 'application/json' },
});

// ── Users ─────────────────────────────────────────────────────
export const getUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// ── Transactions ──────────────────────────────────────────────
export const getTransactions = async () => {
  const res = await api.get('/simple-transactions');
  return res.data;
};
export const getTransactionById = (id) => api.get(`/simple-transactions/${id}`);
export const createTransaction = (data) => api.post('/transactions', data);
export const getTransactionsByUser = (userId) => api.get(`/transactions/user/${userId}`);

// ── Stats ─────────────────────────────────────────────────────
export const getTransactionStats = async () => {
  const res = await api.get('/transactions/stats');
  return res.data;
};
export const getUserStats = async () => {
  const res = await api.get('/transactions/stats/users');
  return res.data;
};

// ── Search & Filter ───────────────────────────────────────────
export const searchByPlace = (place) => api.get('/transactions/search/place', { params: { place } });
export const searchByDevice = (device) => api.get('/transactions/search/device', { params: { device } });
export const filterByAmount = (min, max) => api.get('/transactions/filter/amount', { params: { min, max } });
export const getHighValueTransactions = (threshold = 1000) =>
  api.get('/transactions/high-value', { params: { threshold } });
export const filterByDate = (startDate, endDate) =>
  api.get('/transactions/filter/date', { params: { startDate, endDate } });

// ── Payment Cards ─────────────────────────────────────────────
export const getMyCards = () => api.get('/cards');
export const getPrimaryCard = () => api.get('/cards/primary');
export const addCard = (data) => api.post('/cards', data);
export const deleteCard = (id) => api.delete(`/cards/${id}`);
