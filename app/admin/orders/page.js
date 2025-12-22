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

    const [filterStatus, setFilterStatus] = useState('All');
    const [searchPhone, setSearchPhone] = useState('');
    const [sortOrder, setSortOrder] = useState('date-desc');

    const getFilteredAndSortedOrders = () => {
        let result = [...orders];

        if (filterStatus !== 'All') {
            result = result.filter(order => order.status === filterStatus);
        }

        if (searchPhone) {
            result = result.filter(order => order.phone.includes(searchPhone));
        }

        result.sort((a, b) => {
            if (sortOrder === 'date-desc') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortOrder === 'date-asc') return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortOrder === 'total-desc') return b.total - a.total;
            if (sortOrder === 'total-asc') return a.total - b.total;
            return 0;
        });

        return result;
    };

    const displayedOrders = getFilteredAndSortedOrders();

    return (
        <main className="section-padding page-section">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h1 className="section-title" style={{ marginBottom: 0 }}>Quản Lý Đơn Hàng</h1>
                    <Link href="/admin" className="btn btn-primary">Quay lại Dashboard</Link>
                </div>

                {/* Filters */}
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: 8, marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>Lọc theo trạng thái:</label>
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #ddd' }}
                        >
                            <option value="All">Tất cả</option>
                            {statusOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>Tìm số điện thoại:</label>
                        <input
                            type="text"
                            placeholder="Nhập SĐT..."
                            value={searchPhone}
                            onChange={e => setSearchPhone(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #ddd' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>Sắp xếp:</label>
                        <select
                            value={sortOrder}
                            onChange={e => setSortOrder(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #ddd' }}
                        >
                            <option value="date-desc">Mới nhất trước</option>
                            <option value="date-asc">Cũ nhất trước</option>
                            <option value="total-desc">Giá trị cao nhất</option>
                            <option value="total-asc">Giá trị thấp nhất</option>
                        </select>
                    </div>
                </div>

                <div style={{ overflowX: 'auto', background: 'white', borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                        <thead>
                            <tr style={{ background: 'var(--color-primary)', color: 'white', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Mã Đơn / Ngày</th>
                                <th style={{ padding: '1rem' }}>Khách Hàng</th>
                                <th style={{ padding: '1rem' }}>Tổng Tiền</th>
                                <th style={{ padding: '1rem' }}>Trạng Thái / Lý Do Hủy</th>
                                <th style={{ padding: '1rem' }}>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</td></tr>
                            ) : displayedOrders.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Không tìm thấy đơn hàng nào.</td></tr>
                            ) : (
                                displayedOrders.map(order => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <strong>#{order.id}</strong>
                                            <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                                {new Date(order.createdAt).toLocaleString()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 'bold' }}>{order.customer}</div>
                                            <div style={{ fontSize: '0.9rem', color: '#666' }}>{order.phone}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#888', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.address}</div>
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                                            {Number(order.total).toLocaleString()}₫
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ marginBottom: '0.5rem' }}>
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
                                            </div>
                                            {order.cancelReason && (
                                                <div style={{ fontSize: '0.85rem', color: '#e74c3c', background: '#ffebee', padding: '0.3rem', borderRadius: 4 }}>
                                                    <strong>Lý do:</strong> {order.cancelReason}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #bbb' }}
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
