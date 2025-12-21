"use client";

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { FaTrashAlt } from 'react-icons/fa';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

    if (cart.length === 0) {
        return (
            <main className="section-padding page-section text-center">
                <div className="container">
                    <div className="empty-cart">
                        <i className="fas fa-box-open empty-icon"></i>
                        {/* Note: FontAwesome classes might not work if we didn't include the CDN or library. 
                            I used react-icons elsewhere. Let's stick to text or use FaBoxOpen from react-icons if needed.
                        */}
                        <h2>Giỏ hàng trống</h2>
                        <p className="mb-2">Bạn chưa chọn sản phẩm nào.</p>
                        <Link href="/products" className="btn btn-primary">Mua Sắm Ngay</Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="section-padding page-section">
            <div className="container cart-container">
                <h1 className="section-title">Giỏ Hàng</h1>

                <table className="cart-table">
                    <thead>
                        <tr>
                            <th>Sản Phẩm</th>
                            <th>Đơn Giá</th>
                            <th>Số Lượng</th>
                            <th>Thành Tiền</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="cart-body">
                        {cart.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <img src={item.image} className="cart-item-image" alt={item.name} />
                                        <div>
                                            <h4 style={{ margin: 0 }}>{item.name}</h4>
                                            <span style={{ fontSize: '0.9rem', color: '#666' }}>{item.category}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{Number(item.price).toLocaleString('vi-VN')}₫</td>
                                <td>
                                    <div className="qty-controls">
                                        <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                                        <input type="text" className="qty-input" value={item.quantity} readOnly />
                                        <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                                    </div>
                                </td>
                                <td style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                    {Number(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                </td>
                                <td>
                                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="cart-summary">
                    <p>Tổng tiền:</p>
                    <div className="total-price" id="cart-total">{totalPrice.toLocaleString('vi-VN')}₫</div>
                    <Link href="/checkout" className="btn btn-primary">Tiến Hành Thanh Toán</Link>
                </div>
            </div>
        </main>
    );
}
