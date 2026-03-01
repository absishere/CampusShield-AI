import { useEffect, useState } from 'react';
import { Shield, ShieldCheck, Activity, Users } from 'lucide-react';
import { fetchThreatLogs, fetchThreatTrends, fetchStats } from './services/api';
import type { ThreatLog, ChartDataPoint } from './services/api';
import { AdminTable } from './components/AdminTable';
import { ThreatRadar } from './components/ThreatRadar';

function App() {
  const [logs, setLogs] = useState<ThreatLog[]>([]);
  const [trends, setTrends] = useState<ChartDataPoint[]>([]);
  const [stats, setStats] = useState({ totalScans: 0, threatsBlocked: 0, activeClusters: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [logsData, trendsData, statsData] = await Promise.all([
          fetchThreatLogs(),
          fetchThreatTrends(),
          fetchStats()
        ]);
        setLogs(logsData);
        setTrends(trendsData);
        setStats(statsData as any);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-pulse flex flex-col items-center">
          <Shield className="w-12 h-12 text-blue-500 mb-4" />
          <h1 className="text-xl text-slate-400 font-semibold tracking-wide">Initializing CampusShield AI...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans">
      {/* Top Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              CampusShield AI
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <a
              href="/campusshield-extension.zip"
              download
              className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg transition-colors border border-blue-400/50 flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Download Extension
            </a>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hidden sm:inline-block">
              System: Online
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-700 transition">
              <span className="text-slate-400">IT</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 font-medium">Total Scans (24h)</span>
              <Users className="text-blue-500 w-5 h-5" />
            </div>
            <div className="text-3xl font-bold text-slate-100">{stats.totalScans.toLocaleString()}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between border-l-4 border-l-red-500 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 font-medium">Threats Blocked</span>
              <ShieldCheck className="text-red-500 w-5 h-5" />
            </div>
            <div className="text-3xl font-bold text-red-400">{stats.threatsBlocked.toLocaleString()}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between border-l-4 border-l-amber-500 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 font-medium">Active Scam Clusters</span>
              <Activity className="text-amber-500 w-5 h-5" />
            </div>
            <div className="text-3xl font-bold text-amber-500">{stats.activeClusters}</div>
          </div>
        </div>

        {/* Gamified Health & Leaderboard Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Health Shield */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
            <div className="relative z-10 text-center">
              <h3 className="text-slate-400 font-medium mb-4 uppercase tracking-wider text-sm">Campus Defense Health</h3>
              <div className="w-32 h-32 rounded-full border-4 border-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4 animate-[pulse_3s_ease-in-out_infinite]">
                <span className="text-4xl font-black text-emerald-400">92%</span>
              </div>
              <p className="text-emerald-500 text-sm font-semibold">Status: Optimal</p>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-200 font-semibold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Department Leaderboard
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🥇</span>
                  <span className="font-medium text-slate-200">Computer Science</span>
                </div>
                <span className="text-emerald-400 font-mono font-bold">98 XP</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🥈</span>
                  <span className="font-medium text-slate-300">Engineering</span>
                </div>
                <span className="text-emerald-400/80 font-mono font-bold">85 XP</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🥉</span>
                  <span className="font-medium text-slate-400">Business</span>
                </div>
                <span className="text-emerald-400/60 font-mono font-bold">72 XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <ThreatRadar data={trends} />
        </div>

        {/* Data Table Section */}
        <div className="grid grid-cols-1">
          <AdminTable logs={logs} />
        </div>

      </main>
    </div>
  );
}

export default App;
