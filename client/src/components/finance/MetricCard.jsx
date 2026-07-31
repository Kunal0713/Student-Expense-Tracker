const formatINR = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const MetricCard = ({ title, value, accent = 'text-brand-500' }) => (
  <div className="glass-card p-5 rounded-2xl border-slate-200/80 dark:border-slate-800/80">
    <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">{title}</p>
    <p className={`text-2xl sm:text-3xl font-black mt-2 ${accent}`}>{formatINR(value)}</p>
  </div>
);

export default MetricCard;
