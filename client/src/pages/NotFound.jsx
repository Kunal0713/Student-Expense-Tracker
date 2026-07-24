import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-grid-pattern">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -z-10 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-lg text-center space-y-6"
      >
        <div className="glass-panel rounded-3xl p-8 sm:p-12 shadow-glass-lg border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden space-y-6">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-primary" />

          <div className="relative inline-block">
            <span className="text-7xl sm:text-9xl font-black text-gradient-primary tracking-tighter">
              404
            </span>
            <div className="absolute -top-2 -right-4 p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <AlertCircle size={22} />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
              The page or route you are looking for does not exist or has been moved within ExpenseTrack.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-primary text-white font-bold text-xs shadow-glow-primary flex items-center justify-center gap-2"
              >
                <Home size={16} /> Return Home
              </motion.button>
            </Link>

            <Link to="/dashboard" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl glass-card font-bold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all flex items-center justify-center gap-2"
              >
                <Compass size={16} /> Dashboard
              </motion.button>
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;