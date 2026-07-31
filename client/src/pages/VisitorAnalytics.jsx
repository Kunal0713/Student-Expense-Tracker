import { useEffect, useState } from 'react';
import { Activity, Globe, Monitor, RefreshCw, ServerCrash } from 'lucide-react';

const VisitorAnalytics = () => {
  const [data, setData] = useState({
    totalVisitors: 0,
    latestVisitors: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchVisitors = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/visitors');

      if (!response.ok) {
        throw new Error('Failed to load visitor analytics');
      }

      const result = await response.json();

      setData({
        totalVisitors: result.totalVisitors || 0,
        latestVisitors: result.latestVisitors || []
      });
    } catch (err) {
      setError(err.message || 'Unable to fetch visitor analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">

      <section className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-200/80 dark:border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-brand-500/30 text-xs font-semibold text-brand-700 dark:text-brand-300">
              <Activity size={14} className="text-brand-500" />
              <span>VISITOR ANALYTICS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-3">
              Website Visitor Insights
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
              Latest visitor logs captured from MongoDB.
            </p>
          </div>

          <button
            onClick={fetchVisitors}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-white text-xs font-bold shadow-glow-primary hover:opacity-95 transition-all"
          >
            <RefreshCw size={15} />
            Refresh
          </button>

        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-6">

        <div className="glass-card p-6 rounded-3xl border-slate-200/80 dark:border-slate-800/80">
          <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
            Total Visitors
          </p>

          <p className="text-4xl font-black text-brand-500 mt-2">
            {data.totalVisitors}
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border-slate-200/80 dark:border-slate-800/80">
          <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
            Latest Records
          </p>

          <p className="text-4xl font-black text-slate-900 dark:text-white mt-2">
            {data.latestVisitors.length}
          </p>
        </div>

      </section>

      <section className="glass-panel rounded-3xl border-slate-200/80 dark:border-slate-800/80 overflow-hidden">

        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Latest 10 Visitors
          </h2>
        </div>

        {loading ? (

          <div className="p-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Loading visitor data...
          </div>

        ) : error ? (

          <div className="p-8 flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-400">
            <ServerCrash size={16} />
            <span>{error}</span>
          </div>

        ) : data.latestVisitors.length === 0 ? (

          <div className="p-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
            No visitor records yet.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px] text-left">

              <thead className="bg-slate-100/80 dark:bg-slate-900/60">
                <tr className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-4 py-3 font-bold">Timestamp</th>
                  <th className="px-4 py-3 font-bold">IP</th>
                  <th className="px-4 py-3 font-bold">Browser</th>
                  <th className="px-4 py-3 font-bold">Operating System</th>
                  <th className="px-4 py-3 font-bold">Device</th>
                  <th className="px-4 py-3 font-bold">User Agent</th>
                </tr>
              </thead>

              <tbody>

                {data.latestVisitors.map((visitor) => (

                  <tr
                    key={visitor._id}
                    className="border-t border-slate-200/70 dark:border-slate-800/70 text-sm"
                  >

                    <td className="px-4 py-3">
                      {new Date(visitor.timestamp).toLocaleString()}
                    </td>

                    <td className="px-4 py-3">
                      {visitor.ip}
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        <Globe size={14} className="text-brand-500" />
                        {visitor.browser}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {visitor.os}
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        <Monitor size={14} className="text-cyan-500" />
                        {visitor.device}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-mono text-xs break-all">
                      {visitor.userAgent}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
};

export default VisitorAnalytics;