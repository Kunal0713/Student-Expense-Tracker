import axios from 'axios';

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

export const getSavingsSummary = () => api.get('/dashboard/savings-summary');
export const getRecentActivity = (limit = 20) => api.get('/activity', { params: { limit } });

export const getIncomes = () => api.get('/incomes');
export const createIncome = (data) => api.post('/incomes', data);
export const updateIncome = (id, data) => api.put(`/incomes/${id}`, data);
export const deleteIncome = (id) => api.delete(`/incomes/${id}`);

export const getGoals = (params) => api.get('/goals', { params });
export const createGoal = (data) => api.post('/goals', data);
export const updateGoal = (id, data) => api.put(`/goals/${id}`, data);
export const deleteGoal = (id) => api.delete(`/goals/${id}`);

export const getRecurringExpenses = () => api.get('/recurring-expenses');
export const createRecurringExpense = (data) => api.post('/recurring-expenses', data);
export const updateRecurringExpense = (id, data) => api.put(`/recurring-expenses/${id}`, data);
export const deleteRecurringExpense = (id) => api.delete(`/recurring-expenses/${id}`);
export const processDueRecurringExpenses = () => api.post('/recurring-expenses/process-due');
