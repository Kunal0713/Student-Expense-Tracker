import Expense from '../models/Expense.js';
import Income from '../models/Income.js';
import FinancialGoal from '../models/FinancialGoal.js';

const startOfCurrentMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const endOfCurrentMonth = () => {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
};

const getGoalProgress = (goals, monthlyIncome, monthlyExpenses) =>
  goals.map((goal) => {
    const dynamicCurrentAmount =
      goal.type === 'spending'
        ? monthlyExpenses
        : Math.max(monthlyIncome - monthlyExpenses, 0);

    const percentage =
      goal.targetAmount > 0
        ? Math.min((dynamicCurrentAmount / goal.targetAmount) * 100, 100)
        : 0;

    return {
      _id: goal._id,
      title: goal.title,
      type: goal.type,
      targetAmount: goal.targetAmount,
      currentAmount: Number(dynamicCurrentAmount.toFixed(2)),
      month: goal.month,
      year: goal.year,
      progress: Number(percentage.toFixed(2))
    };
  });

export const getSavingsSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const monthStart = startOfCurrentMonth();
    const monthEnd = endOfCurrentMonth();
    const now = new Date();

    const [
      incomes,
      expenses,
      monthlyIncomeRecords,
      monthlyExpenseRecords,
      goals
    ] = await Promise.all([
      Income.find({ user: userId }),
      Expense.find({ user: userId }),
      Income.find({
        user: userId,
        date: { $gte: monthStart, $lte: monthEnd }
      }),
      Expense.find({
        user: userId,
        date: { $gte: monthStart, $lte: monthEnd }
      }),
      FinancialGoal.find({
        user: userId,
        month: now.getMonth() + 1,
        year: now.getFullYear()
      })
    ]);

    const totalIncome = incomes.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    const totalExpenses = expenses.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    const monthlyIncome = monthlyIncomeRecords.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    const monthlyExpenses = monthlyExpenseRecords.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    const remainingSavings = totalIncome - totalExpenses;
    const monthlySavings = monthlyIncome - monthlyExpenses;

    const spendingGoal = goals.find(
      (goal) => goal.type === 'spending'
    );

    const warnings = [];

    if (spendingGoal && monthlyExpenses > spendingGoal.targetAmount) {
      warnings.push({
        type: 'budget_exceeded',
        message: `Spending goal exceeded by ₹${(
          monthlyExpenses - spendingGoal.targetAmount
        ).toLocaleString('en-IN', {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })}`,
        goalId: spendingGoal._id
      });
    }

    return res.status(200).json({
      totalIncome,
      totalExpenses,
      remainingSavings,
      monthlyIncome,
      monthlyExpenses,
      monthlySavings,
      goals: getGoalProgress(
        goals,
        monthlyIncome,
        monthlyExpenses
      ),
      warnings
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};