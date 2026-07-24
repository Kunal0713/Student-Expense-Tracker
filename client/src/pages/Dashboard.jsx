import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  PieChart as RePieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Plus, Edit2, Trash2, Search, TrendingUp, TrendingDown, 
  Calendar, AlertCircle, Download, PieChart, Layers, X, 
  Utensils, Plane, ShoppingBag, GraduationCap, MoreHorizontal,
  Flame, Award, Lightbulb, Wallet, CheckCircle2
} from 'lucide-react';
import { createExpense, deleteExpense, getExpenses, updateExpense } from '../services/expenseService';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  title: '',
  amount: '',
  category: 'Food',
  date: new Date().toISOString().slice(0, 10)
};

const categories = ['Food', 'Travel', 'Shopping', 'Education', 'Other'];

const categoryColors = {
  'Food': '#EF4444',
  'Travel': '#06B6D4',
  'Shopping': '#F59E0B',
  'Education': '#6366F1',
  'Other': '#8B5CF6'
};

const categoryIcons = {
  'Food': Utensils,
  'Travel': Plane,
  'Shopping': ShoppingBag,
  'Education': GraduationCap,
  'Other': MoreHorizontal
};

// Helper for Indian Currency Formatting
const formatINR = (val) => {
  return '₹' + Number(val || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
};

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monthlyBudget] = useState(15000);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  const fetchExpenses = async () => {
    try {
      setLoadingExpenses(true);
      const res = await getExpenses({ search, category });
      setExpenses(res.data);
    } catch (error) {
      toast.error('Unable to load expenses');
    } finally {
      setLoadingExpenses(false);
    }
  };

  useEffect(() => {
    if (user) fetchExpenses();
  }, [user, search, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.date) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editingId) {
        await updateExpense(editingId, form);
        toast.success('Expense updated successfully!');
      } else {
        await createExpense(form);
        toast.success('Expense added successfully!');
      }
      setForm(emptyForm);
      setEditingId(null);
      setIsModalOpen(false);
      fetchExpenses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date.slice(0, 10)
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await deleteExpense(id);
      toast.success('Expense deleted successfully!');
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(false);
  };

  // Real Financial Analytics Calculations
  const summary = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    
    const thisMonth = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      const now = new Date();
      return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
    }).reduce((sum, e) => sum + Number(e.amount), 0);

    const today = expenses.filter(e => {
      const expenseDate = new Date(e.date).toDateString();
      return expenseDate === new Date().toDateString();
    }).reduce((sum, e) => sum + Number(e.amount), 0);

    const byCategory = expenses.reduce((acc, e) => {
      const existing = acc.find(item => item.name === e.category);
      if (existing) {
        existing.value += Number(e.amount);
      } else {
        acc.push({ name: e.category, value: Number(e.amount) });
      }
      return acc;
    }, []);

    const monthlyData = {};
    expenses.forEach(e => {
      const date = new Date(e.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + Number(e.amount);
    });

    const monthlyChart = Object.entries(monthlyData)
      .map(([month, value]) => ({
        month: new Date(month + '-01').toLocaleString('default', { month: 'short' }),
        amount: value
      }))
      .slice(-6);

    const highest = expenses.length > 0 ? Math.max(...expenses.map(e => Number(e.amount))) : 0;
    const dailyAverage = expenses.length > 0 ? total / 30 : 0;

    const topCategoryItem = byCategory.length > 0 
      ? [...byCategory].sort((a, b) => b.value - a.value)[0] 
      : null;

    const topCategory = topCategoryItem ? topCategoryItem.name : 'None';
    const topCategoryAmount = topCategoryItem ? topCategoryItem.value : 0;

    const budgetUsedPercentage = Math.min((thisMonth / monthlyBudget) * 100, 100);

    return {
      total,
      thisMonth,
      today,
      count: expenses.length,
      byCategory,
      monthlyChart,
      highest,
      dailyAverage,
      topCategory,
      topCategoryAmount,
      budgetUsedPercentage
    };
  }, [expenses, monthlyBudget]);

  // Real Expense Insights Generator
  const insights = useMemo(() => {
    if (expenses.length === 0) return [];
    
    const list = [];
    if (summary.topCategory !== 'None') {
      list.push(`You spent most on ${summary.topCategory} (${formatINR(summary.topCategoryAmount)}).`);
    }
    list.push(`Average daily spending is ${formatINR(summary.dailyAverage)}.`);
    
    if (summary.thisMonth > monthlyBudget) {
      list.push(`Monthly budget exceeded by ${formatINR(summary.thisMonth - monthlyBudget)}.`);
    } else {
      list.push(`You're within your monthly budget (${summary.budgetUsedPercentage.toFixed(0)}% used).`);
    }

    if (summary.highest > 0) {
      list.push(`Single highest expense recorded is ${formatINR(summary.highest)}.`);
    }

    return list;
  }, [expenses, summary, monthlyBudget]);

  const sortedExpenses = useMemo(() => {
    let sorted = [...expenses];
    if (sortBy === 'newest') sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === 'oldest') sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortBy === 'highest') sorted.sort((a, b) => Number(b.amount) - Number(a.amount));
    if (sortBy === 'lowest') sorted.sort((a, b) => Number(a.amount) - Number(b.amount));
    return sorted;
  }, [expenses, sortBy]);

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      toast.info('No transaction history to export');
      return;
    }
    const headers = ['Title', 'Amount (INR)', 'Category', 'Date'];
    const csvRows = [
      headers.join(','),
      ...expenses.map(e => `"${e.title}",${e.amount},"${e.category}",${e.date.slice(0, 10)}`)
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ExpenseTrack_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success('CSV Report downloaded');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grid-pattern">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* DASHBOARD HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-primary">{getGreeting()}, {user?.name?.split(' ')[0]}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Expense Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Real-time transaction tracking, budget progress, and spending analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl glass-card font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <Download size={15} /> Export CSV
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setIsModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-primary text-white font-bold text-xs shadow-glow-primary flex items-center gap-2 transition-all"
            >
              <Plus size={18} /> Add Expense
            </motion.button>
          </div>
        </div>

        {/* 4 TOP SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Today's Spending */}
          <div className="glass-card p-5 rounded-3xl space-y-3 relative overflow-hidden border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Today's Spending</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                <Flame size={18} />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {formatINR(summary.today)}
              </p>
              <p className="text-[11px] font-semibold text-slate-400 mt-1 flex items-center gap-1">
                <TrendingDown size={13} className="text-emerald-500" /> Daily Avg: {formatINR(summary.dailyAverage)}
              </p>
            </div>
          </div>

          {/* Card 2: Monthly Spending */}
          <div className="glass-card p-5 rounded-3xl space-y-3 relative overflow-hidden border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Monthly Spending</span>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold">
                <Calendar size={18} />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {formatINR(summary.thisMonth)}
              </p>
              <p className="text-[11px] font-semibold text-slate-400 mt-1 flex items-center gap-1">
                <Layers size={13} className="text-cyan-500" /> Total Spend: {formatINR(summary.total)}
              </p>
            </div>
          </div>

          {/* Card 3: Budget Progress */}
          <div className="glass-card p-5 rounded-3xl space-y-3 relative overflow-hidden border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Budget Progress</span>
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">
                <Wallet size={18} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {summary.budgetUsedPercentage.toFixed(0)}%
                </p>
                <span className="text-[11px] font-bold text-slate-400">Limit: {formatINR(monthlyBudget)}</span>
              </div>
              <div className="mt-2.5 h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    summary.budgetUsedPercentage > 90 ? 'bg-rose-500' : 'bg-gradient-primary'
                  }`}
                  style={{ width: `${summary.budgetUsedPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 4: Highest Spending Category */}
          <div className="glass-card p-5 rounded-3xl space-y-3 relative overflow-hidden border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Highest Spending Category</span>
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                <PieChart size={18} />
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
                {summary.topCategory}
              </p>
              <p className="text-[11px] font-semibold text-slate-400 mt-1 flex items-center gap-1">
                <Award size={13} className="text-purple-500" /> Peak Single: {formatINR(summary.highest)}
              </p>
            </div>
          </div>

        </div>

        {/* FINANCIAL INSIGHTS CARD */}
        {insights.length > 0 && (
          <div className="glass-panel p-5 rounded-3xl border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              <Lightbulb size={16} className="text-brand-500" /> Spending Insights
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {insights.map((insight, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHARTS ROW */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Pie Chart */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart size={18} className="text-brand-500" /> Category Breakdown
              </h3>
              <span className="badge-primary">Distribution</span>
            </div>

            {summary.byCategory.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <AlertCircle size={36} className="mx-auto text-slate-400" />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No expenses logged yet</p>
              </div>
            ) : (
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={summary.byCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {summary.byCategory.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={categoryColors[entry.name] || '#8B5CF6'} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val) => `${formatINR(val)}`}
                      contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#FFF' }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2">
              {summary.byCategory.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: categoryColors[item.name] }} />
                    <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-slate-900 dark:text-white font-bold">{formatINR(item.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Area Chart */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-cyan-500" /> Monthly Spending Trends
              </h3>
              <span className="badge-primary">History</span>
            </div>

            {summary.monthlyChart.length === 0 ? (
              <div className="py-24 text-center space-y-2">
                <AlertCircle size={36} className="mx-auto text-slate-400" />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Add transactions to visualize timeline trends</p>
              </div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={summary.monthlyChart}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip 
                      formatter={(val) => `${formatINR(val)}`}
                      contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#FFF' }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </div>

        {/* LOGS & FILTERS */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-200/80 dark:border-slate-800/80 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Transaction Logs</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Search, filter, edit, or delete logged expenses.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:w-56">
                <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full glass-input text-xs pl-10 pr-4 py-2.5 rounded-xl"
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input text-xs px-3 py-2.5 rounded-xl"
              >
                <option value="All">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="glass-input text-xs px-3 py-2.5 rounded-xl"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
          </div>

          {loadingExpenses ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-400">Loading Expense Log...</p>
            </div>
          ) : sortedExpenses.length === 0 ? (
            /* PROFESSIONAL EMPTY STATE */
            <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto font-bold">
                <Wallet size={32} />
              </div>
              <div className="space-y-1">
                <p className="text-base font-extrabold text-slate-900 dark:text-white">No expenses yet</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Start tracking your spending to unlock analytics.</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                  setIsModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-primary text-white font-bold text-xs shadow-glow-primary inline-flex items-center gap-2"
              >
                <Plus size={16} /> Add First Expense
              </motion.button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {sortedExpenses.map((expense) => {
                const IconComponent = categoryIcons[expense.category] || MoreHorizontal;
                return (
                  <div
                    key={expense._id}
                    className="p-4 glass-card rounded-2xl flex items-center justify-between gap-4 border-slate-200/60 dark:border-slate-800/60 hover:border-brand-500/40 transition-all group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: categoryColors[expense.category] || '#6366F1' }}
                      >
                        <IconComponent size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {expense.title}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="badge-primary text-[10px] py-0 px-1.5">{expense.category}</span>
                          <span>• {new Date(expense.date).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                        -{formatINR(expense.amount)}
                      </span>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="p-2 rounded-xl text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* ADD / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 shadow-glass-lg border-slate-200 dark:border-slate-800 relative space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {editingId ? <Edit2 size={18} className="text-brand-500" /> : <Plus size={18} className="text-brand-500" />}
                  {editingId ? 'Edit Expense' : 'Add New Expense'}
                </h3>
                <button 
                  onClick={handleCancel}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="exp-title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Title *
                  </label>
                  <input
                    id="exp-title"
                    type="text"
                    required
                    placeholder="e.g. Canteen Snacks or Books"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full glass-input text-xs sm:text-sm px-4 py-3 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="exp-amount" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Amount (₹) *
                    </label>
                    <input
                      id="exp-amount"
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      className="w-full glass-input text-xs sm:text-sm px-4 py-3 rounded-xl"
                    />
                  </div>

                  <div>
                    <label htmlFor="exp-category" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Category *
                    </label>
                    <select
                      id="exp-category"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full glass-input text-xs sm:text-sm px-3 py-3 rounded-xl"
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="exp-date" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Date *
                  </label>
                  <input
                    id="exp-date"
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full glass-input text-xs sm:text-sm px-4 py-3 rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 py-3 rounded-xl glass-card text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-primary text-white font-bold text-xs shadow-glow-primary transition-all"
                  >
                    {editingId ? 'Save Changes' : 'Add Expense'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;