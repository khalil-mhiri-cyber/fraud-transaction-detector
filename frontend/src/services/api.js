import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Users
export const getUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Transactions
export const getTransactions = () => api.get('/transactions');
export const getTransactionById = (id) => api.get(`/transactions/${id}`);
export const createTransaction = (transactionData) => api.post('/transactions', transactionData);
export const getTransactionsByUser = (userId) => api.get(`/transactions/user/${userId}`);

// Stats
export const getGlobalStats = () => api.get('/transactions/stats');
export const getUserStats = () => api.get('/transactions/stats/users');

// Search & Filter
export const searchByPlace = (place) => api.get('/transactions/search/place', { params: { place } });
export const searchByDevice = (device) => api.get('/transactions/search/device', { params: { device } });
export const filterByAmount = (min, max) => api.get('/transactions/filter/amount', { params: { min, max } });
export const getHighValueTransactions = (threshold = 1000) => 
  api.get('/transactions/high-value', { params: { threshold } });
export const filterByDate = (startDate, endDate) => 
  api.get('/transactions/filter/date', { params: { startDate, endDate } });

export default api;
