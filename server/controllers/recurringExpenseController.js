import Expense from '../models/Expense.js';
import RecurringExpense from '../models/RecurringExpense.js';
import { logActivity } from '../utils/activityLogger.js';

const addOneMonth = (dateValue) => {
  const date = new Date(dateValue);
  date.setMonth(date.getMonth() + 1);
  return date;
};

export const getRecurringExpenses = async (req, res) => {
  try {
    const recurringExpenses = await RecurringExpense.find({ user: req.user._id }).sort({ nextDueDate: 1 });
    return res.status(200).json(recurringExpenses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createRecurringExpense = async (req, res) => {
  try {
    const { title, amount, category, nextDueDate, isActive = true } = req.body;
    if (!title || !amount || !category || !nextDueDate) {
      return res.status(400).json({ message: 'Title, amount, category and next due date are required' });
    }

    const normalizedAmount = Number(amount);
    if (Number.isNaN(normalizedAmount) || normalizedAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const recurringExpense = await RecurringExpense.create({
      title,
      amount: normalizedAmount,
      category,
      nextDueDate,
      isActive,
      user: req.user._id
    });

    await logActivity({
      userId: req.user._id,
      actionType: 'recurring_expense_created',
      message: `Recurring expense "${recurringExpense.title}" created`,
      metadata: { recurringExpenseId: recurringExpense._id }
    });

    return res.status(201).json(recurringExpense);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateRecurringExpense = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.amount !== undefined) {
      const normalizedAmount = Number(updates.amount);
      if (Number.isNaN(normalizedAmount) || normalizedAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than 0' });
      }
      updates.amount = normalizedAmount;
    }

    const recurringExpense = await RecurringExpense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!recurringExpense) {
      return res.status(404).json({ message: 'Recurring expense not found' });
    }

    await logActivity({
      userId: req.user._id,
      actionType: 'recurring_expense_updated',
      message: `Recurring expense "${recurringExpense.title}" updated`,
      metadata: { recurringExpenseId: recurringExpense._id }
    });

    return res.status(200).json(recurringExpense);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteRecurringExpense = async (req, res) => {
  try {
    const recurringExpense = await RecurringExpense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!recurringExpense) {
      return res.status(404).json({ message: 'Recurring expense not found' });
    }

    await logActivity({
      userId: req.user._id,
      actionType: 'recurring_expense_deleted',
      message: `Recurring expense "${recurringExpense.title}" deleted`,
      metadata: { recurringExpenseId: recurringExpense._id }
    });

    return res.status(200).json({ message: 'Recurring expense deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const processDueRecurringExpenses = async (req, res) => {
  try {
    const now = new Date();
    const dueRecurringExpenses = await RecurringExpense.find({
      user: req.user._id,
      isActive: true,
      nextDueDate: { $lte: now }
    });

    const createdExpenses = [];
    for (const recurring of dueRecurringExpenses) {
      const expense = await Expense.create({
        title: recurring.title,
        amount: recurring.amount,
        category: recurring.category,
        date: recurring.nextDueDate,
        user: req.user._id,
        isRecurring: true,
        recurringExpense: recurring._id
      });

      recurring.lastProcessedAt = now;
      recurring.nextDueDate = addOneMonth(recurring.nextDueDate);
      await recurring.save();

      createdExpenses.push(expense);

      await logActivity({
        userId: req.user._id,
        actionType: 'recurring_expense_processed',
        message: `Recurring expense "${recurring.title}" processed`,
        metadata: { recurringExpenseId: recurring._id, expenseId: expense._id, amount: expense.amount }
      });
    }

    return res.status(200).json({
      message: `${createdExpenses.length} recurring expenses processed`,
      createdExpenses
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
