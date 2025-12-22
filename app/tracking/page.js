"use client";

import { useState, useEffect } from 'react';

export default function OrderTracking() {
    const [phone, setPhone] = useState('');
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedPhone = localStorage.getItem('customerPhone');
        if (savedPhone) {
            setPhone(savedPhone);
            fetchOrders(savedPhone);
        }
    }, []);

    const fetchOrders = async (phoneStr) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/orders?phone=${phoneStr}`);
            const data = await res.json();
            setOrders(data);
        } catch (e) {
            alert('Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchOrders(phone);
        // Save phone for next time
        localStorage.setItem('customerPhone', phone);
    };

    const handleCancel = async (orderId) => {
        if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;

        const reason = prompt('Vui lòng nhập lý do hủy đơn:', '');
        if (reason === null) return; // User pressed Cancel on prompt

        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'Đã hủy',
                    cancelReason: reason || 'Không có lý do'
                })
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.error || 'Lỗi khi hủy đơn');
                return;
            }

            alert('Đã hủy đơn hàng thành công');
            // Refresh list
            fetchOrders(phone);
        } catch (e) {
            alert('Lỗi kết nối');
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
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', alignItems: 'center' }}>
                                            <div>
                                                <strong>#{order.id}</strong>
                                                <span className="ml-1" style={{
                                                    color: order.status === 'Chờ xử lý' ? '#e67e22' :
                                                        order.status === 'Đã hủy' ? '#e74c3c' : '#27ae60',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            {order.status === 'Chờ xử lý' && (
                                                <button
                                                    onClick={() => handleCancel(order.id)}
                                                    style={{
                                                        background: '#ff4d4d', color: 'white', border: 'none',
                                                        padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'
                                                    }}
                                                >
                                                    Hủy Đơn
                                                </button>
                                            )}
                                        </div>
                                        <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</p>
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
