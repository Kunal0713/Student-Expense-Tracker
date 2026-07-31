const ProgressBar = ({ value, color = 'bg-brand-500' }) => {
  const safeValue = Math.max(0, Math.min(value || 0, 100));

  return (
    <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${safeValue}%` }} />
    </div>
  );
};

export default ProgressBar;
