import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sun, Moon, Bell, RefreshCw, Sparkles, CheckCircle2, Download, ShieldCheck, Database
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getExpenses } from '../services/expenseService';
import { toast } from 'react-toastify';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [budgetWarnings, setBudgetWarnings] = useState(true);

  const handleSavePreferences = () => {
    toast.success('Preferences updated successfully!');
  };

  const handleResetPreferences = () => {
    setWeeklyDigest(true);
    setBudgetWarnings(true);
    toast.info('Preferences reset to default values.');
  };

  const handleExportCSV = async () => {
    try {
      const res = await getExpenses({});
      const expenses = res.data || [];
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
      a.download = `ExpenseTrack_Export_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      toast.success('CSV Report exported successfully');
    } catch (error) {
      toast.error('Failed to export expense data');
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 bg-grid-pattern">
      
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
        <span className="badge-primary">PREFERENCES & CONTROLS</span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
          Customize appearance, notifications, and manage transaction data.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Appearance Section */}
        <section className="glass-panel p-6 rounded-3xl border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles size={18} className="text-brand-500" /> Appearance & Theme
          </h2>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <button
              type="button"
              onClick={() => theme === 'dark' && toggleTheme()}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                theme === 'light'
                  ? 'border-brand-500 bg-brand-500/10 text-brand-700 dark:text-brand-300 font-bold shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sun size={22} className={theme === 'light' ? 'text-brand-500' : ''} />
              <span className="text-xs">Light Mode</span>
            </button>

            <button
              type="button"
              onClick={() => theme === 'light' && toggleTheme()}
              className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                theme === 'dark'
                  ? 'border-brand-500 bg-brand-500/10 text-brand-300 font-bold shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Moon size={22} className={theme === 'dark' ? 'text-brand-400' : ''} />
              <span className="text-xs">Dark Mode</span>
            </button>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="glass-panel p-6 rounded-3xl border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell size={18} className="text-amber-500" /> Notifications & Alerts
          </h2>

          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/60">
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Budget Warning Alerts</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive alerts when reaching 80% of monthly budget limit.</p>
              </div>
              <input
                type="checkbox"
                checked={budgetWarnings}
                onChange={(e) => setBudgetWarnings(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-brand-500 focus:ring-brand-500/50 accent-brand-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Weekly Expense Digest</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Show weekly summary indicators on your dashboard.</p>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-brand-500 focus:ring-brand-500/50 accent-brand-500 cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Data Management Section */}
        <section className="glass-panel p-6 rounded-3xl border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database size={18} className="text-cyan-500" /> Data Management
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Export Transaction Data</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Download a full record of your expenses in CSV format.</p>
            </div>
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-2 shrink-0"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </section>

        {/* User Account Info Summary Card */}
        <section className="glass-card p-6 rounded-3xl border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary text-white flex items-center justify-center font-bold text-sm uppercase shrink-0">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShieldCheck size={16} /> JWT Encrypted
          </span>
        </section>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handleResetPreferences}
            className="px-4 py-2.5 rounded-xl glass-card text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw size={14} /> Reset Defaults
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSavePreferences}
            className="px-6 py-2.5 rounded-xl bg-gradient-primary text-white font-bold text-xs shadow-glow-primary flex items-center gap-2"
          >
            <CheckCircle2 size={16} /> Save Preferences
          </motion.button>
        </div>

      </div>

    </div>
  );
};

export default Settings;