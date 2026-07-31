import Expense from '../models/Expense.js';
import { getDemoExpenses, addDemoExpense, updateDemoExpense, deleteDemoExpense } from '../utils/demoExpenses.js';
import { logActivity } from '../utils/activityLogger.js';

export const getExpenses = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { user: req.user._id };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    let expenses;
    try {
      expenses = await Expense.find(filter).maxTimeMS(2000).sort({ date: -1 });
    } catch (dbError) {
      // Use demo mode
      const allExpenses = getDemoExpenses(req.user._id);
      expenses = allExpenses.filter(e => {
        if (category && category !== 'All' && e.category !== category) return false;
        if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    let expense;
    try {
      expense = await Expense.create({
        title,
        amount: Number(amount),
        category,
        date,
        user: req.user._id
      });
    } catch (dbError) {
      // Use demo mode
      expense = addDemoExpense(req.user._id, {
        title,
        amount: Number(amount),
        category,
        date
      });
    }

    await logActivity({
      userId: req.user._id,
      actionType: 'expense_created',
      message: `Expense "${expense.title}" added`,
      metadata: { expenseId: expense._id, amount: expense.amount, category: expense.category }
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    let expense;
    try {
      expense = await Expense.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true }).maxTimeMS(2000);
    } catch (dbError) {
      // Use demo mode
      expense = updateDemoExpense(req.user._id, req.params.id, req.body);
    }

    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    await logActivity({
      userId: req.user._id,
      actionType: 'expense_updated',
      message: `Expense "${expense.title}" updated`,
      metadata: { expenseId: expense._id }
    });

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    let deleted = false;
    let deletedExpenseId = req.params.id;
    let deletedExpenseTitle = 'Expense';
    try {
      const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id }).maxTimeMS(2000);
      deleted = !!expense;
      if (expense) {
        deletedExpenseId = expense._id;
        deletedExpenseTitle = expense.title;
      }
    } catch (dbError) {
      // Use demo mode
      deleted = deleteDemoExpense(req.user._id, req.params.id);
    }

    if (!deleted) return res.status(404).json({ message: 'Expense not found' });

    await logActivity({
      userId: req.user._id,
      actionType: 'expense_deleted',
      message: `Expense "${deletedExpenseTitle}" deleted`,
      metadata: { expenseId: deletedExpenseId }
    });

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
