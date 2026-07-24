import { useEffect, useState, useMemo } from 'react';
import { 
  Calendar, ShieldCheck, Wallet, Clock, 
  TrendingUp, Award, Layers, Flame, Utensils
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getExpenses } from '../services/expenseService';
import { toast } from 'react-toastify';

const formatINR = (val) => {
  return '₹' + Number(val || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
};

const Profile = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingExpenses(true);
        const res = await getExpenses({});
        setExpenses(res.data || []);
      } catch (error) {
        toast.error('Unable to fetch profile stats');
      } finally {
        setLoadingExpenses(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  // All metrics dynamically calculated from actual user expense records
  const stats = useMemo(() => {
    const totalTransactions = expenses.length;
    const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    
    const amounts = expenses.map(e => Number(e.amount));
    const highestExpense = amounts.length > 0 ? Math.max(...amounts) : 0;
    const lowestExpense = amounts.length > 0 ? Math.min(...amounts) : 0;
    const averageTransaction = totalTransactions > 0 ? totalSpent / totalTransactions : 0;

    // Current month spending
    const now = new Date();
    const currentMonthSpending = expenses.filter(e => {
      const expDate = new Date(e.date);
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    }).reduce((sum, e) => sum + Number(e.amount), 0);

    // Category calculation
    const categoryTotals = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
      return acc;
    }, {});

    let mostUsedCategory = 'None';
    let maxCategoryTotal = 0;
    Object.entries(categoryTotals).forEach(([cat, amount]) => {
      if (amount > maxCategoryTotal) {
        maxCategoryTotal = amount;
        mostUsedCategory = cat;
      }
    });

    // Dynamic Financial Health Score based on actual data
    let score = 85;
    if (totalTransactions === 0) score = 100;
    else {
      if (currentMonthSpending > 15000) score -= 15;
      if (totalTransactions > 10) score += 5;
    }
    const healthScore = Math.min(Math.max(score, 50), 100);

    return {
      totalSpent,
      totalTransactions,
      highestExpense,
      lowestExpense,
      averageTransaction,
      currentMonthSpending,
      mostUsedCategory,
      healthScore
    };
  }, [expenses]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 bg-grid-pattern">
      
      {/* USER PROFILE HEADER CARD */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border-slate-200/80 dark:border-slate-800/80 shadow-glass-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-primary flex items-center justify-center text-white font-black text-4xl shadow-glow-primary uppercase tracking-wider shrink-0">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>

          <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {user?.name || 'Student User'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {user?.email}
              </p>
            </div>

            <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-500" /> Session Authenticated
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={16} className="text-brand-500" /> Member Since 2026
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* CALCULATED USER FINANCIAL METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-3xl space-y-1.5 border-slate-200/80 dark:border-slate-800/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Expenses</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatINR(stats.totalSpent)}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">Cumulative total spent</p>
        </div>

        <div className="glass-card p-5 rounded-3xl space-y-1.5 border-slate-200/80 dark:border-slate-800/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Transactions</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {stats.totalTransactions}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">Recorded logs in database</p>
        </div>

        <div className="glass-card p-5 rounded-3xl space-y-1.5 border-slate-200/80 dark:border-slate-800/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Month Spending</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatINR(stats.currentMonthSpending)}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">This month's expenses</p>
        </div>

        <div className="glass-card p-5 rounded-3xl space-y-1.5 border-slate-200/80 dark:border-slate-800/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Financial Health Score</span>
          <p className="text-2xl font-extrabold text-emerald-500 tracking-tight">
            {stats.healthScore}%
          </p>
          <p className="text-[10px] text-slate-400 font-medium">Calculated budget health</p>
        </div>

      </div>

      {/* SECONDARY DETAILED STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 glass-card rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Highest Expense</p>
            <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{formatINR(stats.highestExpense)}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-xs">
            Max
          </div>
        </div>

        <div className="p-4 glass-card rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Lowest Expense</p>
            <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{formatINR(stats.lowestExpense)}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
            Min
          </div>
        </div>

        <div className="p-4 glass-card rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Average Transaction</p>
            <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{formatINR(stats.averageTransaction)}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold text-xs">
            Avg
          </div>
        </div>

        <div className="p-4 glass-card rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Most Used Category</p>
            <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 truncate max-w-[110px]">{stats.mostUsedCategory}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs">
            Top
          </div>
        </div>

      </div>

      {/* RECENT ACTIVITY TIMELINE */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-200/80 dark:border-slate-800/80 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock size={18} className="text-brand-500" /> Recent Activity Log
        </h2>

        {loadingExpenses ? (
          <p className="text-xs text-slate-400 font-medium">Loading activity records...</p>
        ) : expenses.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <Wallet size={28} className="mx-auto text-slate-400" />
            <p className="text-xs text-slate-400 font-medium">No recent transaction activity recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {expenses.slice(0, 5).map((e) => (
              <div key={e._id} className="p-3.5 glass-card rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-brand-500" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{e.title}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{e.category} • {new Date(e.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white">-{formatINR(e.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;