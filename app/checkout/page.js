"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        note: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedPhone = localStorage.getItem('customerPhone');
        const savedName = localStorage.getItem('customerName');
        const savedAddress = localStorage.getItem('customerAddress');

        setFormData(prev => ({
            ...prev,
            phone: savedPhone || '',
            name: savedName || '',
            address: savedAddress || ''
        }));
    }, []);

    if (cart.length === 0) {
        return (
            <main className="section-padding page-section text-center">
                <h2>Giỏ hàng trống</h2>
            </main>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            customer: formData.name,
            phone: formData.phone,
            address: formData.address,
            note: formData.note,
            items: cart,
            total: totalPrice,
            date: new Date().toISOString(),
            status: 'Chờ xử lý'
        };

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (res.ok) {
                // Save phone for tracking
                localStorage.setItem('customerPhone', formData.phone);
                localStorage.setItem('customerName', formData.name);
                localStorage.setItem('customerAddress', formData.address);

                alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ sớm.');
                clearCart();
                router.push('/tracking'); // Redirect to tracking page instead of home
            } else {
                alert('Có lỗi xảy ra, vui lòng thử lại.');
            }
        } catch (err) {
            console.error(err);
            alert('Lỗi kết nối.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="section-padding page-section">
            <div className="container" style={{ maxWidth: 600 }}>
                <h1 className="section-title">Thanh Toán</h1>

                <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: 8, boxShadow: 'var(--shadow-sm)' }}>
                    <div className="mb-1">
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Họ và tên</label>
                        <input
                            type="text"
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: 4, border: '1px solid #ddd' }}
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="mb-1">
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Số điện thoại</label>
                        <input
                            type="tel"
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: 4, border: '1px solid #ddd' }}
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div className="mb-1">
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Địa chỉ nhận hàng</label>
                        <textarea
                            required
                            rows="3"
                            style={{ width: '100%', padding: '10px', borderRadius: 4, border: '1px solid #ddd' }}
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="mb-1">
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Ghi chú (tùy chọn)</label>
                        <textarea
                            rows="2"
                            style={{ width: '100%', padding: '10px', borderRadius: 4, border: '1px solid #ddd' }}
                            value={formData.note}
                            onChange={e => setFormData({ ...formData, note: e.target.value })}
                        ></textarea>
                    </div>

                    <div style={{ borderTop: '1px solid #eee', margin: '2rem 0', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Tạm tính:</span>
                            <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-primary)' }}>
                            <span>Tổng cộng:</span>
                            <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Xác Nhận Đặt Hàng'}
                    </button>
                </form>
            </div>
        </main>
    );
}
