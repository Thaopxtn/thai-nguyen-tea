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

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [productsCount, setProductsCount] = useState(0);

    useEffect(() => {
        fetch('/api/orders').then(res => res.json()).then(setOrders);
        fetch('/api/products').then(res => res.json()).then(data => setProductsCount(data.length));
    }, []);

    // Helper for chart data
    const chartData = {
        labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
        datasets: [
            {
                label: 'Doanh Thu (Tuần Này)',
                data: [0, 0, 0, 0, 0, 0, 0], // Mock for now
                borderColor: '#0F4C3A',
                backgroundColor: 'rgba(15, 76, 58, 0.5)',
            }
        ],
    };

    return (
        <main className="section-padding page-section">
            <div className="container">
                <h1 className="section-title">Admin Dashboard</h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    <div style={{ padding: '2rem', background: 'white', borderRadius: 8, boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
                        <h3>Đơn Hàng</h3>
                        <p style={{ fontSize: '3rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>{orders.length}</p>
                    </div>
                    <div style={{ padding: '2rem', background: 'white', borderRadius: 8, boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
                        <h3>Sản Phẩm</h3>
                        <p style={{ fontSize: '3rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>{productsCount}</p>
                    </div>
                    <div style={{ padding: '2rem', background: 'white', borderRadius: 8, boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
                        <h3>Doanh Thu</h3>
                        <p style={{ fontSize: '2rem', color: '#333', fontWeight: 'bold' }}>
                            {orders
                                .filter(o => o.status !== 'Đã hủy')
                                .reduce((sum, o) => sum + parseInt(o.total || 0), 0)
                                .toLocaleString()}₫
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                    <Link href="/admin/products" className="btn btn-primary">Quản Lý Sản Phẩm</Link>
                    <Link href="/admin/news" className="btn btn-primary">Quản Lý Tin Tức</Link>
                    <Link href="/admin/orders" className="btn btn-primary">Quản Lý Đơn Hàng</Link>
                    <Link href="/admin/customers" className="btn btn-primary">Quản Lý Khách Hàng</Link>
                    <Link href="/admin/analytics" className="btn btn-primary">Báo Cáo Phân Tích</Link>
                    <button className="btn btn-accent" onClick={() => {
                        document.cookie = 'admin_auth=; Max-Age=0; path=/;';
                        window.location.href = '/admin/login';
                    }}>Đăng Xuất</button>
                </div>

                <div style={{ background: 'white', padding: '2rem', borderRadius: 8 }}>
                    <h3>Biểu Đồ Doanh Thu</h3>
                    <div style={{ height: '300px' }}>
                        <Line options={{ responsive: true, maintainAspectRatio: false }} data={chartData} />
                    </div>
                </div>
            </div>
        </main>
    );
}
