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

// Generate some dummy data for the dashboard
const dummyLogs: ThreatLog[] = [
    { id: '1', url: 'http://my-campus-login.update-info.com', category: 'Phishing', riskScore: 92, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: '2', url: 'http://student-grants-2024.org/apply', category: 'Scam', riskScore: 85, timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
    { id: '3', url: 'https://internship-portal-india.com/register', category: 'Fake Portal', riskScore: 78, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: '4', url: 'http://pay-hostel-fees.xyx', category: 'UPI Fraud', riskScore: 95, timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: '5', url: 'http://library-renewal.net', category: 'Phishing', riskScore: 65, timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
];

const dummyChartData: ChartDataPoint[] = [
    { time: '08:00', threats: 12 },
    { time: '09:00', threats: 25 },
    { time: '10:00', threats: 18 },
    { time: '11:00', threats: 45 },
    { time: '12:00', threats: 30 },
    { time: '13:00', threats: 60 },
    { time: '14:00', threats: 55 },
];

export const fetchThreatLogs = async (): Promise<ThreatLog[]> => {
    // Simulate network delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(dummyLogs);
        }, 800);
    });
};

export const fetchThreatTrends = async (): Promise<ChartDataPoint[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(dummyChartData);
        }, 800);
    });
};

export const fetchStats = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                totalScans: 15420,
                threatsBlocked: 842,
                activeClusters: 3
            });
        }, 800);
    });
}
