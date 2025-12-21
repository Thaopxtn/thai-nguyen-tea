"use client";

import { useEffect, useState } from 'react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/orders')
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    if (loading) return <div className="section-padding page-section container">Loading...</div>;

    return (
        <main className="section-padding page-section">
            <div className="container">
                <h1 className="section-title">Quản Lý Đơn Hàng</h1>
                <table className="cart-table" style={{ fontSize: '0.9rem' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ngày</th>
                            <th>Khách Hàng</th>
                            <th>Tổng Tiền</th>
                            <th>Trạng Thái</th>
                            <th>Chi Tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <strong>{order.customer}</strong><br />
                                    {order.phone}
                                </td>
                                <td>{order.total.toLocaleString('vi-VN')}₫</td>
                                <td>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: 4,
                                        background: order.status === 'Chờ xử lý' ? '#ffc107' : '#28a745',
                                        color: order.status === 'Chờ xử lý' ? 'black' : 'white',
                                        fontSize: '0.8rem'
                                    }}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <details>
                                        <summary style={{ cursor: 'pointer', color: 'blue' }}>Xem</summary>
                                        <div style={{ marginTop: 10, padding: 10, background: '#f9f9f9' }}>
                                            <p><strong>Địa chỉ:</strong> {order.address}</p>
                                            <p><strong>Note:</strong> {order.note}</p>
                                            <ul>
                                                {order.items.map((item, idx) => (
                                                    <li key={idx}>{item.name} x {item.quantity}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </details>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
