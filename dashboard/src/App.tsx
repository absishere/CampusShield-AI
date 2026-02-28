import { useEffect, useState } from 'react';
import { Shield, ShieldCheck } from 'lucide-react';
import { fetchThreatLogs, fetchThreatTrends } from './services/api';
import type { ThreatLog, ChartDataPoint } from './services/api';
import { AdminTable } from './components/AdminTable';
import { ThreatRadar } from './components/ThreatRadar';
import { ProgressionPath } from './components/ProgressionPath';
import type { PathNode } from './components/ProgressionPath';

// Sample Progression Data
const progressionNodes: PathNode[] = [
  { id: '1', title: 'Phishing Basics', status: 'completed' },
  { id: '2', title: 'Password Mastery', status: 'completed' },
  { id: '3', title: 'Safe Browsing', status: 'current' },
  { id: '4', title: 'QR Code Defense', status: 'locked' },
  { id: '5', title: 'Malware Detection', status: 'locked' },
  { id: '6', title: 'Advanced Threat Radar', status: 'locked' },
];

function App() {
  const [logs, setLogs] = useState<ThreatLog[]>([]);
  const [trends, setTrends] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [logsData, trendsData] = await Promise.all([
          fetchThreatLogs(),
          fetchThreatTrends()
        ]);
        setLogs(logsData);
        setTrends(trendsData);
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
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-emerald-500/30">

      {/* Top Navigation */}
      <nav className="border-b-4 border-slate-800 bg-slate-900 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 hover:scale-105 transition-transform cursor-pointer">
            <div className="p-2 bg-slate-800 rounded-lg pixel-box">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <span className="text-xl font-bold font-pixel text-slate-100 tracking-wider">
              CAMPUS<span className="text-emerald-400">SHIELD</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl pixel-box border-b-4 border-slate-900">
              <span className="text-amber-400 text-xl">⭐</span>
              <span className="font-pixel font-bold text-slate-200">1,240 XP</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-600 border-b-4 border-blue-800 flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors active:border-b-0 active:translate-y-1">
              <span className="text-white font-pixel text-sm">IT</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">

        {/* Left Column: The Path (Primary Action) */}
        <div className="w-full lg:w-2/3 bg-slate-900 border-4 border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>

          <div className="text-center mb-6">
            <h2 className="font-pixel text-xl text-slate-200 mb-2">Unit 3: Active Defense</h2>
            <p className="text-slate-400 font-medium">Clear nodes to unlock the remaining dashboard tools.</p>
          </div>

          {/* Gamified Progression Component */}
          <div className="bg-slate-950/50 rounded-2xl border-2 border-slate-800 p-4">
            <ProgressionPath nodes={progressionNodes} onNodeClick={(node) => console.log('Clicked', node.title)} />
          </div>
        </div>

        {/* Right Column: Dashboard Stats & Leaderboard */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">

          {/* Health Box */}
          <div className="bg-slate-900 border-4 border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col items-center text-center">
              <h3 className="font-pixel text-sm text-slate-400 mb-6 uppercase tracking-wider">Campus Health</h3>

              <div className="w-full h-8 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700 mb-4 pixel-box relative">
                <div className="absolute top-0 left-0 h-full w-[92%] bg-emerald-500 border-b-4 border-emerald-700"></div>
                {/* Segment lines for visual pixel effect */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSJ0cmFuc3BhcmVudCI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDggOCIgc3Ryb2tlPSJyZ2JhKDAsMCwwLDAuMSkiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPjwvc3ZnPg==')] opacity-50"></div>
              </div>

              <div className="flex justify-between w-full font-pixel text-[10px] text-slate-300 mb-2">
                <span>CRITICAL</span>
                <span className="text-emerald-400">92% OPTIMAL</span>
              </div>
            </div>
          </div>

          {/* Leaderboard - Retro Style */}
          <div className="bg-slate-900 border-4 border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6 border-b-2 border-slate-800 pb-4">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="font-pixel text-sm text-slate-200 leading-relaxed">Top Depts</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded-xl border-2 border-amber-500/30">
                <div className="flex items-center gap-3">
                  <span className="text-2xl drop-shadow-md">🥇</span>
                  <span className="font-pixel text-[10px] text-amber-400 pt-1">CompSci</span>
                </div>
                <span className="font-pixel text-[10px] text-slate-300">9.8k XP</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl border-2 border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-2xl drop-shadow-md opacity-90">🥈</span>
                  <span className="font-pixel text-[10px] text-slate-300 pt-1">Eng</span>
                </div>
                <span className="font-pixel text-[10px] text-slate-400">8.5k XP</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl border-2 border-slate-700/50 hover:bg-slate-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-2xl drop-shadow-md opacity-80">🥉</span>
                  <span className="font-pixel text-[10px] text-slate-400 pt-1">Business</span>
                </div>
                <span className="font-pixel text-[10px] text-slate-500">7.2k XP</span>
              </div>
            </div>

            <button className="w-full mt-6 py-3 duo-button duo-button-blue font-pixel text-[10px]">
              VIEW FULL LEAGUE
            </button>
          </div>

        </div>
      </main>

      {/* Advanced Tools Section (Below the fold) */}
      <section className="border-t-4 border-slate-900 bg-slate-950 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto space-y-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
          <h2 className="font-pixel text-sm text-slate-500 text-center mb-8">--- Advanced Terminal Access ---</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6">
              <ThreatRadar data={trends} />
            </div>
            <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6">
              <AdminTable logs={logs} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default App;
