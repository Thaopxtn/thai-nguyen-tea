"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function AnalyticsReport() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/analytics')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Placeholder chart data
    const chartData = {
        labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
        datasets: [
            {
                label: 'Lượt Truy Cập (Tuần Này)',
                data: [12, 19, 3, 5, 2, 3, stats?.todayVisits || 0], // Mock integration
                borderColor: '#0F4C3A',
                backgroundColor: 'rgba(15, 76, 58, 0.5)',
            }
        ],
    };

    return (
        <main className="section-padding page-section">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 className="section-title" style={{ marginBottom: 0 }}>Báo Cáo Phân Tích</h1>
                    <Link href="/admin" className="btn btn-primary">Quay lại Dashboard</Link>
                </div>

                {loading ? <p>Đang tải dữ liệu...</p> : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                            <div style={{ padding: '2rem', background: 'white', borderRadius: 8, boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
                                <h3>Tổng Lượt Vào</h3>
                                <p style={{ fontSize: '3rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>{stats?.totalVisits || 0}</p>
                            </div>
                            <div style={{ padding: '2rem', background: 'white', borderRadius: 8, boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
                                <h3>Hôm Nay</h3>
                                <p style={{ fontSize: '3rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>{stats?.todayVisits || 0}</p>
                            </div>
                        </div>

                        <div style={{ background: 'white', padding: '2rem', borderRadius: 8, marginBottom: '2rem' }}>
                            <h3>Biểu Đồ Truy Cập</h3>
                            <div style={{ height: '300px' }}>
                                <Line options={{ responsive: true, maintainAspectRatio: false }} data={chartData} />
                            </div>
                        </div>

                        <div style={{ background: 'white', padding: '2rem', borderRadius: 8 }}>
                            <h3>Nhật Ký Truy Cập Gần Đây</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                                        <th style={{ padding: '0.5rem' }}>Thời Gian</th>
                                        <th style={{ padding: '0.5rem' }}>IP</th>
                                        <th style={{ padding: '0.5rem' }}>Thiết Bị</th>
                                        <th style={{ padding: '0.5rem' }}>Vị Trí (Dự đoán)</th>
                                        <th style={{ padding: '0.5rem' }}>Trang Xem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.recentLogs?.map((log, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '0.5rem' }}>{new Date(log.createdAt).toLocaleString()}</td>
                                            <td style={{ padding: '0.5rem' }}>{log.ip}</td>
                                            <td style={{ padding: '0.5rem' }}>{log.device}</td>
                                            <td style={{ padding: '0.5rem' }}>{log.city !== 'Unknown' ? `${log.city}, ${log.country}` : 'Chưa xác định'}</td>
                                            <td style={{ padding: '0.5rem' }}>{log.path}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
