import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Activity, Bell, Coins, PiggyBank, RefreshCw, Repeat, Trash2 } from 'lucide-react';
import MetricCard from '../components/finance/MetricCard';
import ProgressBar from '../components/finance/ProgressBar';
import {
  createGoal,
  createIncome,
  createRecurringExpense,
  deleteGoal,
  deleteIncome,
  deleteRecurringExpense,
  getGoals,
  getIncomes,
  getRecentActivity,
  getRecurringExpenses,
  getSavingsSummary,
  processDueRecurringExpenses
} from '../services/financeService';

const emptyIncomeForm = {
  title: '',
  amount: '',
  source: '',
  date: new Date().toISOString().slice(0, 10),
  notes: ''
};

const now = new Date();
const emptyGoalForm = {
  title: '',
  type: 'saving',
  targetAmount: '',
  month: now.getMonth() + 1,
  year: now.getFullYear()
};

const emptyRecurringForm = {
  title: '',
  amount: '',
  category: 'Food',
  nextDueDate: new Date().toISOString().slice(0, 10)
};

const categories = ['Food', 'Travel', 'Shopping', 'Education', 'Other'];

const FinanceHub = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [goals, setGoals] = useState([]);
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [activity, setActivity] = useState([]);

  const [incomeForm, setIncomeForm] = useState(emptyIncomeForm);
  const [goalForm, setGoalForm] = useState(emptyGoalForm);
  const [recurringForm, setRecurringForm] = useState(emptyRecurringForm);
  const [processingRecurring, setProcessingRecurring] = useState(false);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const [summaryRes, incomeRes, goalsRes, recurringRes, activityRes] = await Promise.all([
        getSavingsSummary(),
        getIncomes(),
        getGoals({ month: goalForm.month, year: goalForm.year }),
        getRecurringExpenses(),
        getRecentActivity(10)
      ]);

      setSummary(summaryRes.data);
      setIncomes(incomeRes.data);
      setGoals(goalsRes.data);
      setRecurringExpenses(recurringRes.data);
      setActivity(activityRes.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load finance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  useEffect(() => {
    if (!summary?.warnings?.length) {
      return;
    }

    summary.warnings.forEach((warning) => {
      toast.warn(warning.message);
    });
  }, [summary]);

  const totalMonthlyIncome = useMemo(
    () => incomes.filter((income) => {
      const d = new Date(income.date);
      return d.getMonth() + 1 === Number(goalForm.month) && d.getFullYear() === Number(goalForm.year);
    }).reduce((sum, income) => sum + Number(income.amount), 0),
    [incomes, goalForm.month, goalForm.year]
  );

  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (!incomeForm.title || !incomeForm.amount || !incomeForm.source || !incomeForm.date) {
      toast.error('Please fill all income fields');
      return;
    }

    try {
      await createIncome(incomeForm);
      toast.success('Income added');
      setIncomeForm(emptyIncomeForm);
      fetchFinanceData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to add income');
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!goalForm.title || !goalForm.targetAmount || !goalForm.month || !goalForm.year) {
      toast.error('Please complete goal details');
      return;
    }

    try {
      await createGoal(goalForm);
      toast.success('Goal created');
      setGoalForm(emptyGoalForm);
      fetchFinanceData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create goal');
    }
  };

  const handleAddRecurringExpense = async (e) => {
    e.preventDefault();
    if (!recurringForm.title || !recurringForm.amount || !recurringForm.category || !recurringForm.nextDueDate) {
      toast.error('Please complete recurring expense details');
      return;
    }

    try {
      await createRecurringExpense(recurringForm);
      toast.success('Recurring expense created');
      setRecurringForm(emptyRecurringForm);
      fetchFinanceData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create recurring expense');
    }
  };

  const handleProcessRecurring = async () => {
    try {
      setProcessingRecurring(true);
      const res = await processDueRecurringExpenses();
      toast.success(res.data.message);
      fetchFinanceData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to process recurring expenses');
    } finally {
      setProcessingRecurring(false);
    }
  };

  const handleDeleteIncome = async (id) => {
    if (!window.confirm('Delete this income entry?')) {
      return;
    }

    try {
      await deleteIncome(id);
      toast.success('Income deleted');
      fetchFinanceData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete income');
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Delete this goal?')) {
      return;
    }

    try {
      await deleteGoal(id);
      toast.success('Goal deleted');
      fetchFinanceData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete goal');
    }
  };

  const handleDeleteRecurringExpense = async (id) => {
    if (!window.confirm('Delete this recurring expense?')) {
      return;
    }

    try {
      await deleteRecurringExpense(id);
      toast.success('Recurring expense deleted');
      fetchFinanceData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete recurring expense');
    }
  };

  if (loading && !summary) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading finance hub...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <section className="glass-panel rounded-3xl p-6 border-slate-200/80 dark:border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-brand-500/30 text-xs font-semibold text-brand-700 dark:text-brand-300">
              <Coins size={14} className="text-brand-500" />
              <span>FINANCE HUB</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">Savings Dashboard</h1>
          </div>
          <button
            onClick={fetchFinanceData}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-white text-xs font-bold shadow-glow-primary"
          >
            <RefreshCw size={15} />
            Refresh Data
          </button>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard title="Total Income" value={summary?.totalIncome} />
        <MetricCard title="Total Expenses" value={summary?.totalExpenses} accent="text-rose-500" />
        <MetricCard title="Remaining Savings" value={summary?.remainingSavings} accent={summary?.remainingSavings >= 0 ? 'text-emerald-500' : 'text-rose-500'} />
        <MetricCard title="Monthly Savings" value={summary?.monthlySavings} accent={summary?.monthlySavings >= 0 ? 'text-cyan-500' : 'text-rose-500'} />
      </section>

      {summary?.warnings?.length > 0 && (
        <section className="glass-card rounded-2xl p-4 border border-rose-300/60 dark:border-rose-600/40 bg-rose-50/70 dark:bg-rose-900/20">
          <div className="flex items-start gap-2">
            <Bell size={18} className="text-rose-500 mt-0.5" />
            <div className="space-y-1">
              {summary.warnings.map((warning) => (
                <p key={warning.goalId} className="text-sm font-semibold text-rose-700 dark:text-rose-300">{warning.message}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-5 border-slate-200/80 dark:border-slate-800/80">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Income Tracking</h2>
          <form onSubmit={handleAddIncome} className="grid gap-3 sm:grid-cols-2">
            <input value={incomeForm.title} onChange={(e) => setIncomeForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Income title" className="input-primary sm:col-span-2" />
            <input type="number" min="0" step="0.01" value={incomeForm.amount} onChange={(e) => setIncomeForm((prev) => ({ ...prev, amount: e.target.value }))} placeholder="Amount" className="input-primary" />
            <input value={incomeForm.source} onChange={(e) => setIncomeForm((prev) => ({ ...prev, source: e.target.value }))} placeholder="Source" className="input-primary" />
            <input type="date" value={incomeForm.date} onChange={(e) => setIncomeForm((prev) => ({ ...prev, date: e.target.value }))} className="input-primary" />
            <input value={incomeForm.notes} onChange={(e) => setIncomeForm((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Notes (optional)" className="input-primary" />
            <button type="submit" className="sm:col-span-2 rounded-xl bg-gradient-primary text-white py-2.5 text-xs font-bold">Add Income</button>
          </form>

          <div className="mt-5 space-y-2 max-h-64 overflow-y-auto pr-1">
            {incomes.map((income) => (
              <div key={income._id} className="glass-card rounded-xl p-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{income.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{income.source} • {new Date(income.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-black text-emerald-500">₹{Number(income.amount).toLocaleString('en-IN')}</p>
                  <button onClick={() => handleDeleteIncome(income._id)} className="text-rose-500 hover:text-rose-600"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
            {incomes.length === 0 && <p className="text-xs text-slate-500 dark:text-slate-400">No income entries yet.</p>}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-5 border-slate-200/80 dark:border-slate-800/80">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Financial Goals</h2>
          <form onSubmit={handleAddGoal} className="grid gap-3 sm:grid-cols-2">
            <input value={goalForm.title} onChange={(e) => setGoalForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Goal title" className="input-primary sm:col-span-2" />
            <select value={goalForm.type} onChange={(e) => setGoalForm((prev) => ({ ...prev, type: e.target.value }))} className="input-primary">
              <option value="saving">Saving Goal</option>
              <option value="spending">Spending Goal</option>
            </select>
            <input type="number" min="0" step="0.01" value={goalForm.targetAmount} onChange={(e) => setGoalForm((prev) => ({ ...prev, targetAmount: e.target.value }))} placeholder="Target amount" className="input-primary" />
            <input type="number" min="1" max="12" value={goalForm.month} onChange={(e) => setGoalForm((prev) => ({ ...prev, month: e.target.value }))} placeholder="Month" className="input-primary" />
            <input type="number" min="2000" value={goalForm.year} onChange={(e) => setGoalForm((prev) => ({ ...prev, year: e.target.value }))} placeholder="Year" className="input-primary" />
            <button type="submit" className="sm:col-span-2 rounded-xl bg-gradient-primary text-white py-2.5 text-xs font-bold">Create Goal</button>
          </form>

          <div className="mt-5 space-y-3 max-h-64 overflow-y-auto pr-1">
            {(summary?.goals || []).map((goal) => (
              <div key={goal._id} className="glass-card rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{goal.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{goal.type === 'saving' ? 'Saving' : 'Spending'} • {goal.month}/{goal.year}</p>
                  </div>
                  <button onClick={() => handleDeleteGoal(goal._id)} className="text-rose-500 hover:text-rose-600"><Trash2 size={16} /></button>
                </div>
                <ProgressBar value={goal.progress} color={goal.type === 'saving' ? 'bg-emerald-500' : 'bg-amber-500'} />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  ₹{goal.currentAmount.toLocaleString('en-IN')} / ₹{goal.targetAmount.toLocaleString('en-IN')} ({goal.progress.toFixed(1)}%)
                </p>
              </div>
            ))}
            {(summary?.goals || []).length === 0 && <p className="text-xs text-slate-500 dark:text-slate-400">No goals for this month yet.</p>}
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-5 border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recurring Expenses</h2>
            <button
              onClick={handleProcessRecurring}
              disabled={processingRecurring}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold disabled:opacity-60"
            >
              <Repeat size={14} />
              {processingRecurring ? 'Processing...' : 'Process Due'}
            </button>
          </div>

          <form onSubmit={handleAddRecurringExpense} className="grid gap-3 sm:grid-cols-2">
            <input value={recurringForm.title} onChange={(e) => setRecurringForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Recurring title" className="input-primary sm:col-span-2" />
            <input type="number" min="0" step="0.01" value={recurringForm.amount} onChange={(e) => setRecurringForm((prev) => ({ ...prev, amount: e.target.value }))} placeholder="Amount" className="input-primary" />
            <select value={recurringForm.category} onChange={(e) => setRecurringForm((prev) => ({ ...prev, category: e.target.value }))} className="input-primary">
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input type="date" value={recurringForm.nextDueDate} onChange={(e) => setRecurringForm((prev) => ({ ...prev, nextDueDate: e.target.value }))} className="input-primary sm:col-span-2" />
            <button type="submit" className="sm:col-span-2 rounded-xl bg-gradient-primary text-white py-2.5 text-xs font-bold">Add Recurring Expense</button>
          </form>

          <div className="mt-5 space-y-2 max-h-64 overflow-y-auto pr-1">
            {recurringExpenses.map((item) => (
              <div key={item._id} className="glass-card rounded-xl p-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.category} • Due {new Date(item.nextDueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-black text-rose-500">₹{Number(item.amount).toLocaleString('en-IN')}</p>
                  <button onClick={() => handleDeleteRecurringExpense(item._id)} className="text-rose-500 hover:text-rose-600"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
            {recurringExpenses.length === 0 && <p className="text-xs text-slate-500 dark:text-slate-400">No recurring expenses yet.</p>}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-5 border-slate-200/80 dark:border-slate-800/80">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Recent Activity</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Latest actions from your account</p>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {activity.map((entry) => (
              <div key={entry._id} className="glass-card rounded-xl p-3 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                  <Activity size={14} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{entry.message}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(entry.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {activity.length === 0 && <p className="text-xs text-slate-500 dark:text-slate-400">No activity yet.</p>}
          </div>

          <div className="mt-6 glass-card rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank size={15} className="text-emerald-500" />
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Monthly Snapshot</p>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">This month income: <span className="font-bold text-emerald-500">₹{totalMonthlyIncome.toLocaleString('en-IN')}</span></p>
            <p className="text-sm text-slate-700 dark:text-slate-300">This month expenses: <span className="font-bold text-rose-500">₹{Number(summary?.monthlyExpenses || 0).toLocaleString('en-IN')}</span></p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinanceHub;
