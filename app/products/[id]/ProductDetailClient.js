"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

export default function ProductDetailClient({ product, related }) {
    const [qty, setQty] = useState(1);
    const { addToCart } = useCart();

    if (!product) {
        return (
            <div className="section-padding page-section text-center">
                <h2>Không tìm thấy sản phẩm</h2>
                <Link href="/products" className="btn btn-primary mt-2">Quay lại cửa hàng</Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product, qty);
        // Simple visual feedback could be added here

        // Optional: Trigger a custom event or state to show the fly-to-cart animation if we can access the refs, 
        // but for now let's just use a simple pulse or toast.
        // Since toast was removed, we can rely on the header badge updating.
    };

    return (
        <main className="section-padding page-section">
            <div className="container">
                <div className="about-container" style={{ alignItems: 'start' }}>
                    <div className="product-image" style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', width: '100%', maxWidth: '500px', aspectRatio: '1/1' }}>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <div className="badge-discount" style={{ fontSize: '1.2rem', padding: '8px 16px', top: '20px', right: '20px' }}>
                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </div>
                        )}
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                            sizes="(max-width: 768px) 100vw, 500px"
                        />
                    </div>
                    <div className="product-info" style={{ textAlign: 'left', flex: 1 }}>
                        <span className="product-category" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{product.category}</span>
                        <h1 className="product-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{product.name}</h1>

                        {product.rating > 0 && (
                            <div className="rating-group" style={{ justifyContent: 'flex-start', marginBottom: '1rem' }}>
                                <FaStar />
                                <span className="rating-text" style={{ fontSize: '1rem' }}>{product.rating} ({product.numReviews} đánh giá)</span>
                            </div>
                        )}

                        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                            <span className="price-current" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>
                                {Number(product.price).toLocaleString('vi-VN')}₫
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="price-old" style={{ fontSize: '1.2rem' }}>
                                    {Number(product.originalPrice).toLocaleString('vi-VN')}₫
                                </span>
                            )}
                        </div>

                        <p style={{ marginBottom: '2rem', color: 'var(--color-text-light)', lineHeight: 1.8 }}>{product.desc}</p>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
                            <div className="qty-controls">
                                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Giảm số lượng">-</button>
                                <input type="text" className="qty-input" value={qty} readOnly aria-label="Số lượng" />
                                <button className="qty-btn" onClick={() => setQty(q => q + 1)} aria-label="Tăng số lượng">+</button>
                            </div>
                            <button className="btn btn-primary" onClick={handleAddToCart} style={{ padding: '0.8rem 2.5rem' }}>Thêm Vào Giỏ</button>
                        </div>

                        <div style={{ padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
                            <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Cam kết chất lượng:</h4>
                            <ul style={{ paddingLeft: '1.2rem', color: '#666' }}>
                                <li>100% Chè búp tươi Thái Nguyên</li>
                                <li>Không chất bảo quản, hương liệu</li>
                                <li>Đổi trả trong vòng 7 ngày</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-4" style={{ marginTop: '5rem' }}>
                    <h3 className="section-title text-center" style={{ fontSize: '2rem', marginBottom: '3rem' }}>Sản Phẩm Liên Quan</h3>
                    <div className="products-grid">
                        {related.map(p => (
                            <div key={p.id} className="product-card">
                                <div className="product-image" style={{ position: 'relative', height: '300px' }}>
                                    <Link href={`/products/${p.id}`}>
                                        <Image
                                            src={p.image}
                                            alt={p.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </Link>
                                </div>
                                <div className="product-info text-center" style={{ padding: '1.5rem' }}>
                                    <Link href={`/products/${p.id}`} className="no-underline">
                                        <h3 className="product-title" style={{ fontSize: '1.2rem' }}>{p.name}</h3>
                                    </Link>
                                    <span className="product-price" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                                        {Number(p.price).toLocaleString('vi-VN')}₫
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
