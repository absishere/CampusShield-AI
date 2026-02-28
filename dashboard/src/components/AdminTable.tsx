import React from 'react';
import type { ThreatLog } from '../services/api';
import { ExternalLink, ShieldAlert } from 'lucide-react';

interface Props {
    logs: ThreatLog[];
}

export const AdminTable: React.FC<Props> = ({ logs }) => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-primary-500" />
                    Recent Threats Detected
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="text-xs uppercase bg-slate-800/50 text-slate-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">Timestamp</th>
                            <th scope="col" className="px-6 py-3">Flagged URL</th>
                            <th scope="col" className="px-6 py-3">Category</th>
                            <th scope="col" className="px-6 py-3">Risk Score</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-200 truncate max-w-xs" title={log.url}>
                                    {log.url}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 rounded text-xs font-semibold">
                                        {log.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-semibold ${log.riskScore > 80 ? 'text-red-500' : 'text-amber-500'}`}>
                                            {log.riskScore}/100
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-blue-400 hover:text-blue-300 transition-colors" title="Investigate">
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    No recent threats detected.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
