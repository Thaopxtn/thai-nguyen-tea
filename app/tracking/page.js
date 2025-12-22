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
            const res = await fetch(`/api/orders?phone=${phoneStr}`, { cache: 'no-store' });
            const data = await res.json();
            setOrders(data);
        } catch (e) {
            alert('Lỗi kết nối khi tải đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchOrders(phone);
        localStorage.setItem('customerPhone', phone);
    };

    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancelReason, setCancelReason] = useState('');

    const openCancelModal = (orderId) => {
        setSelectedOrder(orderId);
        setCancelReason('');
        setShowModal(true);
    };

    const confirmCancel = async () => {
        if (!cancelReason.trim()) {
            alert('Vui lòng nhập lý do hủy đơn');
            return;
        }

        try {
            const res = await fetch(`/api/orders/${selectedOrder}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'Đã hủy',
                    cancelReason: cancelReason
                }),
                cache: 'no-store'
            });
            const data = await res.json();

            if (!res.ok) {
                alert(`Không thể hủy đơn: ${data.error}`);
                return;
            }

            alert('Đã hủy đơn hàng thành công');
            setShowModal(false);
            fetchOrders(phone); // Refresh without reload
        } catch (e) {
            alert('Lỗi kết nối: ' + e.message);
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
                                            {(order.status === 'Chờ xử lý' || order.status === 'Đang xử lý') && (
                                                <button
                                                    onClick={() => openCancelModal(order.id)}
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

            {/* Modal Custom */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: 8, width: '90%', maxWidth: '400px' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Xác nhận hủy đơn</h3>
                        <p style={{ marginBottom: '1rem' }}>Vui lòng nhập lý do hủy đơn hàng:</p>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: 4, minHeight: '80px', marginBottom: '1rem' }}
                            placeholder="Ví dụ: Đổi ý, đặt nhầm số lượng..."
                            autoFocus
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button onClick={() => setShowModal(false)} className="btn" style={{ background: '#ecf0f1', color: '#333' }}>Đóng</button>
                            <button onClick={confirmCancel} className="btn" style={{ background: '#e74c3c', color: 'white' }}>Xác nhận Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
