// In-memory store for demo expenses
const demoExpenses = new Map();

export const getDemoExpenses = (userId) => {
  return demoExpenses.get(userId) || [];
};

export const addDemoExpense = (userId, expenseData) => {
  const expenses = demoExpenses.get(userId) || [];
  const expense = {
    _id: Math.random().toString(36).substr(2, 9),
    ...expenseData,
    user: userId,
    createdAt: new Date()
  };
  expenses.push(expense);
  demoExpenses.set(userId, expenses);
  return expense;
};

export const updateDemoExpense = (userId, expenseId, updates) => {
  const expenses = demoExpenses.get(userId) || [];
  const index = expenses.findIndex(e => e._id === expenseId);
  if (index >= 0) {
    expenses[index] = { ...expenses[index], ...updates };
    demoExpenses.set(userId, expenses);
    return expenses[index];
  }
  return null;
};

export const deleteDemoExpense = (userId, expenseId) => {
  const expenses = demoExpenses.get(userId) || [];
  const filtered = expenses.filter(e => e._id !== expenseId);
  demoExpenses.set(userId, filtered);
  return true;
};
