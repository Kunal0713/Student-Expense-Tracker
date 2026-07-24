import axios from 'axios';

const token = localStorage.getItem('student-expense-token');

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use((config) => {
  const authToken = localStorage.getItem('student-expense-token');
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export const getExpenses = (params) => api.get('/expenses', { params });
export const createExpense = (data) => api.post('/expenses', data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
