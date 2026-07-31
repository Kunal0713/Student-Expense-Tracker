import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, BarChart3, Settings, User, LogOut, Home, Zap, 
  Sun, Moon, ChevronDown, Compass, MessageSquare, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const authenticatedNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/visitor-analytics', label: 'Visitors', icon: Activity },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const publicNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: Compass },
    { path: '/contact', label: 'Contact', icon: MessageSquare },
    { path: '/visitor-analytics', label: 'Visitors', icon: Activity },
  ];

  const navItems = user ? authenticatedNavItems : publicNavItems;

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 pt-3 pb-1 transition-all duration-300">
      <nav 
        aria-label="Main Navigation"
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
          scrolled
            ? 'glass-panel shadow-glass-md py-2.5 px-4 sm:px-6 border-slate-200/80 dark:border-slate-800/80'
            : 'bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 py-3.5 px-4 sm:px-6'
        }`}
      >
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl p-1">
            <motion.div 
              whileHover={{ rotate: 12, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary text-white font-bold text-lg relative overflow-hidden shrink-0"
            >
              <Zap className="text-white fill-white/20" size={22} />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                ExpenseTrack
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink key={path} to={path} className="relative">
                {({ isActive }) => (
                  <div className="relative px-4 py-2 rounded-lg transition-colors text-xs font-semibold flex items-center gap-2 z-10">
                    <Icon size={16} className={isActive ? 'text-brand-500 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400'} />
                    <span className={isActive ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}>
                      {label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm -z-10 border border-slate-200/60 dark:border-slate-700/60"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </div>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2.5">
            
            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleTheme}
              aria-label="Toggle Light or Dark Theme"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800/60 transition-colors"
            >
              <AnimatePresence mode="wait">
                {theme === 'light' ? (
                  <motion.div key="moon" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                    <Moon size={18} className="text-slate-700" />
                  </motion.div>
                ) : (
                  <motion.div key="sun" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
                    <Sun size={18} className="text-amber-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/40 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden sm:inline-block max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-56 glass-panel rounded-2xl shadow-glass-lg p-2 border border-slate-200 dark:border-slate-800 z-50"
                    >
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl mb-2 border border-slate-200/50 dark:border-slate-800/50">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>

                      <div className="space-y-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <BarChart3 size={15} className="text-brand-500" /> Dashboard
                        </Link>
                        <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <User size={15} className="text-secondary" /> Profile
                        </Link>
                        <Link to="/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <Settings size={15} className="text-accent" /> Settings
                        </Link>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-xs font-semibold"
                        >
                          <LogOut size={15} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Log In
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 rounded-xl bg-gradient-primary text-white text-xs font-bold shadow-glow-primary hover:opacity-95 transition-all"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Mobile Drawer Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              className="md:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>

          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden pt-4 mt-3 border-t border-slate-200 dark:border-slate-800"
            >
              <div className="flex flex-col gap-1.5 pb-3">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <NavLink key={path} to={path}>
                    {({ isActive }) => (
                      <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-gradient-primary text-white shadow-glow-primary'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                        }`}
                      >
                        <Icon size={18} />
                        <span>{label}</span>
                      </div>
                    )}
                  </NavLink>
                ))}

                {!user && (
                  <div className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t border-slate-200 dark:border-slate-800">
                    <Link to="/login" className="w-full">
                      <button className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white">
                        Log In
                      </button>
                    </Link>
                    <Link to="/register" className="w-full">
                      <button className="w-full py-2.5 rounded-xl bg-gradient-primary text-white text-xs font-bold shadow-glow-primary">
                        Get Started
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;