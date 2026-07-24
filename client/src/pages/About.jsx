import { motion } from 'framer-motion';
import { 
  ShieldCheck, Database, Layers, Code2, Sparkles, 
  Server, Lock, CheckCircle2, Rocket
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const techStack = [
    {
      category: 'Frontend Core',
      icon: Code2,
      color: 'from-cyan-500 to-blue-500',
      items: ['React 18', 'Vite Build Engine', 'React Router v6', 'Context API State']
    },
    {
      category: 'UI & Styling',
      icon: Sparkles,
      color: 'from-indigo-500 to-purple-500',
      items: ['Tailwind CSS 3.4', 'Framer Motion', 'Recharts Analytics', 'Lucide React Icons']
    },
    {
      category: 'Backend & API',
      icon: Server,
      color: 'from-emerald-500 to-teal-500',
      items: ['Node.js Runtime', 'Express.js Framework', 'RESTful API Routes', 'Axios Interceptors']
    },
    {
      category: 'Database & Auth',
      icon: Database,
      color: 'from-amber-500 to-rose-500',
      items: ['MongoDB Atlas Cloud', 'Mongoose Schema ORM', 'JWT Session Tokens', 'Bcrypt Password Hashing']
    }
  ];

  const architecturalHighlights = [
    {
      title: 'Stateless Authentication',
      description: 'JSON Web Tokens (JWT) are stored securely on the client and passed via standard Bearer Authorization headers for API verification.'
    },
    {
      title: 'Database Isolation',
      description: 'Every transaction record is tied directly to the authenticated user ID in MongoDB Atlas, enforcing data isolation.'
    },
    {
      title: 'Responsive Analytics Engine',
      description: 'Aggregates spending totals, category breakdowns, and trend lines on the client side using memoized array calculations.'
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* HEADER SECTION */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border-brand-500/30 text-xs font-semibold text-brand-700 dark:text-brand-300">
          <Sparkles size={14} className="text-brand-500 animate-pulse" />
          <span>PROJECT ARCHITECTURE & STACK</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Full-Stack Student Expense Engine
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          ExpenseTrack is a full-stack MERN application built as a Cloud Computing assignment for VIT Chennai, combining clean RESTful APIs with interactive analytics.
        </p>
      </section>

      {/* OBJECTIVE & ARCHITECTURE OVERVIEW */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-3xl space-y-4 border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
          <div className="w-11 h-11 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold">
            <Rocket size={22} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Project Objective</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            To create a functional, secure, and intuitive money management tool for students. By bringing transaction logging, category distribution, and budget warnings into a unified interface, students can track daily spending easily in Indian Rupees (₹).
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl space-y-4 border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold">
            <Layers size={22} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Engineering Focus</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Demonstrating clean separation of concerns: React handles responsive UI states and reactive charts, Express manages routing middleware and JWT verification, and MongoDB Atlas ensures persistent cloud data storage.
          </p>
        </div>
      </section>

      {/* TECH STACK GRID */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="badge-primary">MERN STACK COMPONENTS</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Technology Specifications
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((stack, idx) => {
            const IconComponent = stack.icon;
            return (
              <div
                key={idx}
                className="glass-card p-6 rounded-3xl space-y-4 border-slate-200/80 dark:border-slate-800/80"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stack.color} text-white flex items-center justify-center shadow-md`}>
                  <IconComponent size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {stack.category}
                </h3>
                <ul className="space-y-2">
                  {stack.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE FLOW */}
      <section className="glass-panel p-8 sm:p-12 rounded-3xl border-slate-200/80 dark:border-slate-800/80 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <span className="badge-primary">PIPELINE DESIGN</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              End-to-End Application Architecture
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <Lock size={14} /> JWT Token Pipeline
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="p-5 glass-card rounded-2xl space-y-2">
            <div className="w-9 h-9 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto font-bold text-sm">
              01
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Client Interface</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              React + Vite application captures input, manages state, attaches Bearer tokens via Axios, and renders charts.
            </p>
          </div>

          <div className="p-5 glass-card rounded-2xl space-y-2">
            <div className="w-9 h-9 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mx-auto font-bold text-sm">
              02
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Express API Middleware</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Authenticates session tokens, validates payload parameters, and delegates CRUD tasks to database controllers.
            </p>
          </div>

          <div className="p-5 glass-card rounded-2xl space-y-2">
            <div className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto font-bold text-sm">
              03
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">MongoDB Atlas Cloud</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Persists user credentials and transaction records securely with indexed user queries.
            </p>
          </div>
        </div>
      </section>

      {/* ARCHITECTURAL HIGHLIGHTS */}
      <section className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <span className="badge-primary">KEY IMPLEMENTATION DETAILS</span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Security & Logic Principles
          </h2>
        </div>

        <div className="space-y-3">
          {architecturalHighlights.map((item, idx) => (
            <div key={idx} className="glass-card p-5 rounded-2xl border-slate-200/80 dark:border-slate-800/80 space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-brand-500" /> {item.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium pl-6">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ACTION CTA */}
      <section className="text-center py-6">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border-brand-500/30 max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Ready to manage your expenses?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto font-medium">
            Log in to view your personalized dashboard or create a new account to begin tracking.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-xl bg-gradient-primary text-white font-bold text-xs shadow-glow-primary"
              >
                Go to Dashboard
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;