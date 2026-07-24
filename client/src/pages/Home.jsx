import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, PiggyBank, ShieldCheck, 
  BarChart3, Sparkles, CheckCircle2, ChevronDown, Layers, 
  Cpu, ArrowUpRight, PieChart, Download, Lock
} from 'lucide-react';

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const coreCapabilities = [
    {
      title: 'Secure Authentication',
      desc: 'Protected with JWT tokens & MongoDB isolation.',
      icon: Lock,
      color: 'text-brand-500 bg-brand-500/10'
    },
    {
      title: 'Expense Analytics',
      desc: 'Visual category distribution & spending trends.',
      icon: BarChart3,
      color: 'text-cyan-500 bg-cyan-500/10'
    },
    {
      title: 'Budget Tracking',
      desc: 'Set limits & monitor monthly threshold usage.',
      icon: PiggyBank,
      color: 'text-emerald-500 bg-emerald-500/10'
    },
    {
      title: 'CSV Export',
      desc: 'Download your full transaction history anytime.',
      icon: Download,
      color: 'text-amber-500 bg-amber-500/10'
    }
  ];

  const features = [
    {
      icon: PiggyBank,
      title: 'Real-Time Budget Tracking',
      description: 'Categorize expenses dynamically with visual budget progress meters and threshold notifications.'
    },
    {
      icon: BarChart3,
      title: 'Interactive Analytics',
      description: 'Gain clear financial visibility through breakdown pie charts, monthly timeline curves, and custom filters.'
    },
    {
      icon: ShieldCheck,
      title: 'Encrypted Data Security',
      description: 'Your financial logs are protected with JSON Web Token authentication and MongoDB Atlas cloud storage.'
    },
    {
      icon: Cpu,
      title: 'Calculated Spend Insights',
      description: 'Automated math highlights your top expense category, daily average spend, and peak single transaction.'
    },
    {
      icon: Layers,
      title: 'Responsive Layout',
      description: 'Seamlessly log and view expenses across laptop, tablet, and smartphone screens with mobile navigation.'
    },
    {
      icon: Sparkles,
      title: 'Fast & Reactive UX',
      description: 'Built on React 18 and Vite for instant state updates, responsive inputs, and fluid UI interactions.'
    }
  ];

  const steps = [
    { step: '01', title: 'Create Account', description: 'Sign up in under 30 seconds with secure JWT credentialing.' },
    { step: '02', title: 'Log Daily Expenses', description: 'Add transactions with title, category, date, and exact monetary amount in ₹.' },
    { step: '03', title: 'Analyze Insights', description: 'Watch your dashboard update instantly with accurate spending breakdowns.' }
  ];

  const faqs = [
    { q: 'Is ExpenseTrack free to use?', a: 'Yes! ExpenseTrack is 100% free with unlimited expense logging, analytical charts, and full CSV export capabilities.' },
    { q: 'How secure is my transaction data?', a: 'We use JSON Web Tokens (JWT) for session authentication, and all database operations are secured via isolated MongoDB Atlas backend logic.' },
    { q: 'Can I export my expense records?', a: 'Yes. You can filter, search, and export your entire transaction history to a CSV file anytime from the dashboard.' },
    { q: 'Is the application mobile friendly?', a: 'Yes, the interface is built with responsive Tailwind CSS components, working smoothly across all screen sizes.' }
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-grid-pattern">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border-brand-500/30 text-xs font-semibold text-brand-700 dark:text-brand-300 shadow-sm">
                <Sparkles size={14} className="text-brand-500 animate-pulse" />
                <span>Student Personal Finance Engine</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                Master your college <br className="hidden sm:inline" />
                finances with <span className="text-gradient-primary">precision.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Eliminate budget stress with real-time transaction tracking, intuitive spending distribution charts, and clear financial summaries built for campus life.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/register" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-primary text-white font-bold text-sm shadow-glow-primary flex items-center justify-center gap-2 group transition-all"
                  >
                    <span>Start Tracking Free</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>

                <Link to="/about" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card font-bold text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Explore Architecture</span>
                    <ArrowUpRight size={16} className="text-slate-400" />
                  </motion.button>
                </Link>
              </div>

              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Free to Use
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Instant CSV Download
                </span>
              </div>
            </motion.div>

            {/* Right Visual Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Floating Preview Card */}
                <div className="absolute -top-6 -left-6 z-20 glass-card p-4 rounded-2xl shadow-glass-md hidden sm:flex items-center gap-3 border-emerald-500/30">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                    +₹
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Monthly Budget</p>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white">₹15,000.00 Limit</p>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 z-20 glass-card p-4 rounded-2xl shadow-glass-md hidden sm:flex items-center gap-3 border-brand-500/30">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                    <PieChart size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Top Spend Category</p>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white">Food & Dining</p>
                  </div>
                </div>

                {/* Dashboard Mockup Component */}
                <div className="glass-panel p-6 rounded-3xl shadow-glass-lg border-slate-200/80 dark:border-slate-800/80 space-y-6 relative z-10">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-400">Dashboard Preview</span>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-gradient-primary text-white shadow-glow-primary">
                      <p className="text-xs font-medium opacity-80">Total Expense Balance</p>
                      <p className="text-3xl font-black tracking-tight mt-1">₹4,825.00</p>
                      <div className="mt-4 flex items-center justify-between text-xs opacity-90 font-mono">
                        <span>Active Session</span>
                        <span>2026 Log</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300">Campus Canteen</span>
                        <span className="text-rose-600 dark:text-rose-400 font-bold">-₹450.00</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300">Textbooks & Notes</span>
                        <span className="text-rose-600 dark:text-rose-400 font-bold">-₹1,200.00</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES HIGHLIGHTS (Replaces fake marketing stats) */}
      <section className="py-12 border-y border-slate-200/80 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreCapabilities.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="glass-card p-5 rounded-2xl flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0 font-bold`}>
                    <IconComp size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{item.title}</h3>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="badge-primary">SYSTEM CAPABILITIES</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Designed for clarity. Engineered for control.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Everything you need to log, organize, and analyze your financial transactions in Indian Rupees (₹).
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div key={idx} className="glass-card-hover p-7 rounded-3xl space-y-3 relative group">
                <div className="w-11 h-11 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold group-hover:bg-gradient-primary group-hover:text-white transition-all shadow-sm">
                  <IconComponent size={22} />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section className="py-16 bg-slate-100/50 dark:bg-slate-950/50 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge-primary">SIMPLE WORKFLOW</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
              Up and running in 3 easy steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {steps.map((s, idx) => (
              <div key={idx} className="glass-card p-7 rounded-3xl space-y-3 relative">
                <span className="text-3xl font-black text-brand-500/40 dark:text-brand-400/30 font-mono">
                  {s.step}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center space-y-3 mb-10">
          <span className="badge-primary">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Have questions? We've got answers.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card rounded-2xl overflow-hidden transition-colors border-slate-200 dark:border-slate-800">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-5 flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown size={18} className={`transition-transform duration-300 text-slate-400 ${openFaq === idx ? 'rotate-180 text-brand-500' : ''}`} />
              </button>

              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium border-t border-slate-100 dark:border-slate-800/60 pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;