// Simulated API Services for CampusShield AI Dashboard

export interface ThreatLog {
    id: string;
    url: string;
    category: string;
    riskScore: number;
    timestamp: string;
}

export interface ChartDataPoint {
    time: string;
    threats: number;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const fetchThreatLogs = async (): Promise<ThreatLog[]> => {
    try {
        const res = await fetch(`${API_BASE}/dashboard/stats`);
        const data = await res.json();
        return data.recent_threats.map((t: any) => ({
            id: t.id.toString(),
            url: t.original_url || (t.hashed_url.substring(0, 20) + '...'),
            category: t.category,
            riskScore: Math.round(t.risk_score),
            timestamp: t.time
        }));
    } catch (err) {
        console.error("Failed to fetch logs:", err);
        return [];
    }
};

export const fetchThreatTrends = async (): Promise<ChartDataPoint[]> => {
    // Keep dummy chart data for the radar as the DB doesn't have timeseries aggregation yet
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { time: '08:00', threats: 5 },
                { time: '09:00', threats: 12 },
                { time: '10:00', threats: 8 },
                { time: '11:00', threats: 24 },
                { time: '12:00', threats: 15 },
                { time: '13:00', threats: 32 },
                { time: '14:00', threats: 28 },
            ]);
        }, 500);
    });
};

export const fetchStats = async () => {
    try {
        const res = await fetch(`${API_BASE}/dashboard/stats`);
        const data = await res.json();
        return {
            totalScans: data.total_threats_blocked * 4 + 1205, // Estimate based on threats
            threatsBlocked: data.total_threats_blocked,
            activeClusters: data.active_clusters
        };
    } catch (err) {
        console.error("Failed to fetch stats:", err);
        return { totalScans: 0, threatsBlocked: 0, activeClusters: 0 };
    }
};
