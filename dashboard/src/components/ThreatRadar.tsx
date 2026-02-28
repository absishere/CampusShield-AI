import React from 'react';
import type { ChartDataPoint } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

interface Props {
    data: ChartDataPoint[];
}

export const ThreatRadar: React.FC<Props> = ({ data }) => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-[400px] flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-slate-200">Campus Threat Radar</h3>
            </div>

            <div className="flex-grow w-full h-full text-sm">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#475569" tick={{ fill: '#94a3b8' }} />
                        <YAxis stroke="#475569" tick={{ fill: '#94a3b8' }} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                            itemStyle={{ color: '#ef4444' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="threats"
                            stroke="#ef4444"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorThreats)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
