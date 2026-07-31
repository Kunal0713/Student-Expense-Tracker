import FinancialGoal from '../models/FinancialGoal.js';
import { logActivity } from '../utils/activityLogger.js';

const getMonthYear = (query) => {
  const now = new Date();
  const month = Number(query.month || now.getMonth() + 1);
  const year = Number(query.year || now.getFullYear());
  return { month, year };
};

export const getGoals = async (req, res) => {
  try {
    const { month, year } = getMonthYear(req.query);
    const goals = await FinancialGoal.find({ user: req.user._id, month, year }).sort({ createdAt: -1 });
    return res.status(200).json(goals);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createGoal = async (req, res) => {
  try {
    const { title, type, targetAmount, currentAmount = 0, month, year } = req.body;
    if (!title || !type || !targetAmount || !month || !year) {
      return res.status(400).json({ message: 'Title, type, target amount, month and year are required' });
    }

    const normalizedTarget = Number(targetAmount);
    const normalizedCurrent = Number(currentAmount);
    if (Number.isNaN(normalizedTarget) || normalizedTarget <= 0) {
      return res.status(400).json({ message: 'Target amount must be greater than 0' });
    }
    if (Number.isNaN(normalizedCurrent) || normalizedCurrent < 0) {
      return res.status(400).json({ message: 'Current amount must be 0 or more' });
    }

    const goal = await FinancialGoal.create({
      title,
      type,
      targetAmount: normalizedTarget,
      currentAmount: normalizedCurrent,
      month: Number(month),
      year: Number(year),
      user: req.user._id
    });

    await logActivity({
      userId: req.user._id,
      actionType: 'goal_created',
      message: `${goal.type === 'saving' ? 'Saving' : 'Spending'} goal "${goal.title}" created`,
      metadata: { goalId: goal._id, targetAmount: goal.targetAmount }
    });

    return res.status(201).json(goal);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.targetAmount !== undefined) {
      const targetAmount = Number(updates.targetAmount);
      if (Number.isNaN(targetAmount) || targetAmount <= 0) {
        return res.status(400).json({ message: 'Target amount must be greater than 0' });
      }
      updates.targetAmount = targetAmount;
    }

    if (updates.currentAmount !== undefined) {
      const currentAmount = Number(updates.currentAmount);
      if (Number.isNaN(currentAmount) || currentAmount < 0) {
        return res.status(400).json({ message: 'Current amount must be 0 or more' });
      }
      updates.currentAmount = currentAmount;
    }

    const goal = await FinancialGoal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await logActivity({
      userId: req.user._id,
      actionType: 'goal_updated',
      message: `Goal "${goal.title}" updated`,
      metadata: { goalId: goal._id }
    });

    return res.status(200).json(goal);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const goal = await FinancialGoal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await logActivity({
      userId: req.user._id,
      actionType: 'goal_deleted',
      message: `Goal "${goal.title}" deleted`,
      metadata: { goalId: goal._id }
    });

    return res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
