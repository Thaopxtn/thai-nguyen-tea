"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminCustomers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/customers')
            .then(res => {
                if (res.status === 401) window.location.href = '/admin/login';
                return res.json();
            })
            .then(data => {
                setCustomers(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <main className="section-padding page-section">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 className="section-title" style={{ marginBottom: 0 }}>Quản Lý Khách Hàng</h1>
                    <Link href="/admin" className="btn btn-primary">Quay lại Dashboard</Link>
                </div>

                <div style={{ overflowX: 'auto', background: 'white', borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: 'var(--color-primary)', color: 'white', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>SĐT</th>
                                <th style={{ padding: '1rem' }}>Họ Tên</th>
                                <th style={{ padding: '1rem' }}>Địa Chỉ</th>
                                <th style={{ padding: '1rem' }}>Số Đơn</th>
                                <th style={{ padding: '1rem' }}>Tổng Chi</th>
                                <th style={{ padding: '1rem' }}>Đơn Cuối</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Đang tải dữ liệu...</td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Chưa có khách hàng nào.</td>
                                </tr>
                            ) : (
                                customers.map(c => (
                                    <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '1rem' }}>{c.phone}</td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>{c.name}</td>
                                        <td style={{ padding: '1rem', maxWidth: '300px' }}>{c.address}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>{c.totalOrders}</td>
                                        <td style={{ padding: '1rem', color: '#d35400', fontWeight: 'bold' }}>
                                            {c.totalSpent.toLocaleString()}₫
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#666' }}>
                                            {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : 'N/A'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
