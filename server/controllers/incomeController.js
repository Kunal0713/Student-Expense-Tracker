import Income from '../models/Income.js';
import { logActivity } from '../utils/activityLogger.js';

export const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 });
    return res.status(200).json(incomes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createIncome = async (req, res) => {
  try {
    const { title, amount, source, date, notes } = req.body;
    if (!title || !amount || !source || !date) {
      return res.status(400).json({ message: 'Title, amount, source and date are required' });
    }

    const normalizedAmount = Number(amount);
    if (Number.isNaN(normalizedAmount) || normalizedAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const income = await Income.create({
      title,
      amount: normalizedAmount,
      source,
      date,
      notes: notes || '',
      user: req.user._id
    });

    await logActivity({
      userId: req.user._id,
      actionType: 'income_created',
      message: `Income "${income.title}" added`,
      metadata: { amount: income.amount, source: income.source, incomeId: income._id }
    });

    return res.status(201).json(income);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.amount !== undefined) {
      const normalizedAmount = Number(updates.amount);
      if (Number.isNaN(normalizedAmount) || normalizedAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than 0' });
      }
      updates.amount = normalizedAmount;
    }

    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    await logActivity({
      userId: req.user._id,
      actionType: 'income_updated',
      message: `Income "${income.title}" updated`,
      metadata: { incomeId: income._id }
    });

    return res.status(200).json(income);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    await logActivity({
      userId: req.user._id,
      actionType: 'income_deleted',
      message: `Income "${income.title}" deleted`,
      metadata: { incomeId: income._id }
    });

    return res.status(200).json({ message: 'Income deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
