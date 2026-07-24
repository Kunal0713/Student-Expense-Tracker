import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Send, MapPin, Github, Linkedin, 
  HelpCircle, CheckCircle2, Sparkles, Clock, ArrowUpRight 
} from 'lucide-react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    }, 1000);
  };

  const contactCards = [
    {
      icon: Mail,
      title: 'Email Support',
      detail: 'support@expensetrack.app',
      subtext: 'Academic Project Inquiries',
      action: 'mailto:support@expensetrack.app',
      color: 'text-brand-500 bg-brand-500/10'
    },
    {
      icon: Github,
      title: 'Repository',
      detail: 'github.com/expensetrack',
      subtext: 'View Source Code & Submit Issues',
      action: 'https://github.com',
      color: 'text-purple-500 bg-purple-500/10'
    },
    {
      icon: MapPin,
      title: 'Institution',
      detail: 'VIT Chennai Campus',
      subtext: 'Tamil Nadu, India',
      action: null,
      color: 'text-cyan-500 bg-cyan-500/10'
    }
  ];

  const quickFaqs = [
    {
      q: 'How do I export my transaction history?',
      a: 'Navigate to the Dashboard or Settings page and click "Export CSV" to download your complete record.'
    },
    {
      q: 'Where is my expense data stored?',
      a: 'All transactions are stored securely in your private cloud instance on MongoDB Atlas.'
    },
    {
      q: 'Can I change my budget limit?',
      a: 'Yes, you can monitor and manage your monthly budget thresholds directly from the Dashboard.'
    }
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 bg-grid-pattern">
      
      {/* HEADER SECTION */}
      <section className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border-brand-500/30 text-xs font-semibold text-brand-700 dark:text-brand-300">
          <Sparkles size={14} className="text-brand-500 animate-pulse" />
          <span>GET IN TOUCH</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Contact & Support
        </h1>

        <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Have questions about the application architecture, feedback, or feature requests? Reach out below.
        </p>
      </section>

      {/* CONTACT CARDS */}
      <section className="grid md:grid-cols-3 gap-6">
        {contactCards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div
              key={idx}
              className="glass-card p-6 rounded-3xl space-y-3 relative group border-slate-200/80 dark:border-slate-800/80"
            >
              <div className="flex items-center justify-between">
                <div className={`w-11 h-11 rounded-2xl ${card.color} flex items-center justify-center font-bold`}>
                  <IconComponent size={20} />
                </div>
                {card.action && (
                  <a
                    href={card.action}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label={card.title}
                  >
                    <ArrowUpRight size={18} />
                  </a>
                )}
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">{card.title}</h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{card.detail}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{card.subtext}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* FORM AND FAQ SECTION */}
      <section className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border-slate-200/80 dark:border-slate-800/80 shadow-glass-md space-y-5">
          <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Send a Message</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Fill out the form below to send feedback or inquiries.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full glass-input text-xs sm:text-sm px-4 py-3 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@vitstudent.ac.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full glass-input text-xs sm:text-sm px-4 py-3 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full glass-input text-xs sm:text-sm px-4 py-3 rounded-xl"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Feedback">Feedback</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Message *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Write your message here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full glass-input text-xs sm:text-sm p-4 rounded-xl resize-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-primary text-white font-bold text-xs sm:text-sm shadow-glow-primary flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : submitted ? (
                <span className="flex items-center gap-2 text-emerald-200">
                  <CheckCircle2 size={18} /> Message Sent!
                </span>
              ) : (
                <>
                  <Send size={16} /> Send Message
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Sidebar Info & FAQ */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-3 border-slate-200/80 dark:border-slate-800/80">
            <span className="badge-primary">DEVELOPER INFORMATION</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">VIT Chennai Assignment</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Developed as a Cloud Computing assignment demonstrating full-stack web development with React, Express, and MongoDB Atlas.
            </p>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-brand-500" />
                <span>Cloud Computing Assignment 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Linkedin size={15} className="text-cyan-500" />
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:underline">
                  Developer Profile
                </a>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-3 border-slate-200/80 dark:border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle size={16} className="text-brand-500" /> Common Questions
            </h3>

            <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/60">
              {quickFaqs.map((faq, i) => (
                <div key={i} className={i > 0 ? 'pt-2.5' : ''}>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{faq.q}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};

export default Contact;