"use client";

import { useState } from 'react';

export default function OrderTracking() {
    const [phone, setPhone] = useState('');
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/orders');
            const allOrders = await res.json();
            // Client-side filtering for simplicity. Ideally API should support filtering.
            const myOrders = allOrders.filter(o => o.phone.includes(phone));
            setOrders(myOrders);
        } catch (e) {
            alert('Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="section-padding page-section">
            <div className="container" style={{ maxWidth: 800 }}>
                <h1 className="section-title">Tra Cứu Đơn Hàng</h1>

                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', justifyContent: 'center' }}>
                    <input
                        type="tel"
                        placeholder="Nhập số điện thoại của bạn..."
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                        style={{ padding: '1rem', width: '300px', borderRadius: 4, border: '1px solid #ddd' }}
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Đang tìm...' : 'Tra Cứu'}
                    </button>
                </form>

                {orders && (
                    <div className="search-results fade-in visible">
                        {orders.length === 0 ? (
                            <p className="text-center">Không tìm thấy đơn hàng nào với số điện thoại này.</p>
                        ) : (
                            <div>
                                {orders.map(order => (
                                    <div key={order.id} style={{ background: 'white', padding: '1.5rem', borderRadius: 8, boxShadow: 'var(--shadow-sm)', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                                            <strong>#{order.id}</strong>
                                            <span style={{ color: order.status === 'Chờ xử lý' ? '#e67e22' : '#27ae60', fontWeight: 'bold' }}>{order.status}</span>
                                        </div>
                                        <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                        <p><strong>Tổng tiền:</strong> {Number(order.total).toLocaleString('vi-VN')}₫</p>
                                        <div style={{ marginTop: '1rem' }}>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                                                    <span>{item.name} x {item.quantity}</span>
                                                    <span>{Number(item.price * item.quantity).toLocaleString()}₫</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
