"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        setLoading(true);
        fetch('/api/orders')
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleStatusChange = async (id, newStatus) => {
        const confirmMsg = newStatus === 'Đã hủy'
            ? 'Bạn có chắc chắn muốn hủy đơn này? Doanh thu của khách hàng sẽ bị trừ đi.'
            : `Đổi trạng thái đơn hàng thành "${newStatus}"?`;

        if (!confirm(confirmMsg)) return;

        let reason = '';
        if (newStatus === 'Đã hủy') {
            reason = prompt('Nhập lý do hủy (admin):', 'Admin hủy');
            if (reason === null) return;
        }

        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: newStatus,
                    cancelReason: reason
                })
            });

            if (res.ok) {
                alert('Cập nhật thành công');
                fetchOrders(); // Refresh
            } else {
                alert('Lỗi cập nhật');
            }
        } catch (e) {
            alert('Lỗi kết nối');
        }
    };

    const statusOptions = [
        'Chờ xử lý',
        'Đang xử lý',
        'Đang giao',
        'Đã giao',
        'Đã hủy'
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Chờ xử lý': return '#e67e22';
            case 'Đang xử lý': return '#3498db';
            case 'Đang giao': return '#f1c40f';
            case 'Đã giao': return '#27ae60';
            case 'Đã hủy': return '#e74c3c';
            default: return '#333';
        }
    };

    return (
        <main className="section-padding page-section">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 className="section-title" style={{ marginBottom: 0 }}>Quản Lý Đơn Hàng</h1>
                    <Link href="/admin" className="btn btn-primary">Quay lại Dashboard</Link>
                </div>

                <div style={{ overflowX: 'auto', background: 'white', borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                        <thead>
                            <tr style={{ background: 'var(--color-primary)', color: 'white', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Mã Đơn</th>
                                <th style={{ padding: '1rem' }}>Ngày Đặt</th>
                                <th style={{ padding: '1rem' }}>Khách Hàng</th>
                                <th style={{ padding: '1rem' }}>Tổng Tiền</th>
                                <th style={{ padding: '1rem' }}>Trạng Thái</th>
                                <th style={{ padding: '1rem' }}>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Chưa có đơn hàng nào.</td></tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <strong>#{order.id}</strong>
                                            {order.cancelReason && (
                                                <div style={{ fontSize: '0.8rem', color: '#e74c3c', marginTop: '0.2rem' }}>
                                                    Lý do hủy: {order.cancelReason}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {new Date(order.createdAt).toLocaleString()}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 'bold' }}>{order.customer}</div>
                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>{order.phone}</div>
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                                            {Number(order.total).toLocaleString()}₫
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                color: getStatusColor(order.status),
                                                fontWeight: 'bold',
                                                border: `1px solid ${getStatusColor(order.status)}`,
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.9rem'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                style={{ padding: '0.3rem', borderRadius: '4px' }}
                                            >
                                                {statusOptions.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
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
