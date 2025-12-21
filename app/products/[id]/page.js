"use client";

import { use, useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

// Since this is a Client Component (for hook usage), we should fetch data or receive it. 
// However, to keep it simple without passing props from server component wrapper, 
// we will fetch from API we just created.
// Alternatively, we could make the main Page a Server Component and a separate Client Component for the logic.
// Let's do the Fetch approach for dynamic client updates. 

export default function ProductDetailPage({ params }) {
    const resolvedParams = use(params);
    const { id } = resolvedParams;

    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                const p = data.find(item => item.id == id);
                setProduct(p);
                if (p) {
                    setRelated(data.filter(item => item.category === p.category && item.id != p.id).slice(0, 3));
                }
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, [id]);

    if (loading) return <div className="section-padding page-section text-center">Loading...</div>;

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
        // Dispatch event for FlyCart if we implement it, handled by Context or component interaction
        // For now standard behavior
        alert(`Đã thêm ${qty} ${product.name} vào giỏ hàng!`);
    };

    return (
        <main className="section-padding page-section">
            <div className="container">
                <div className="about-container" style={{ alignItems: 'start' }}>
                    <div className="product-image" id="detail-img" style={{ height: 'auto', borderRadius: 8, overflow: 'hidden' }}>
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div className="product-info" style={{ textAlign: 'left' }}>
                        <span className="product-category">{product.category}</span>
                        <h1 className="product-title" style={{ fontSize: '2.5rem' }}>{product.name}</h1>
                        <span className="product-price" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                            {Number(product.price).toLocaleString('vi-VN')}₫
                        </span>
                        <p style={{ marginBottom: '2rem', color: '#666' }}>{product.desc}</p>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                            <div className="qty-controls">
                                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
                                <input type="text" className="qty-input" value={qty} readOnly />
                                <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
                            </div>
                            <button className="btn btn-primary" onClick={handleAddToCart}>Thêm Vào Giỏ</button>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <h3>Sản Phẩm Liên Quan</h3>
                    <div className="products-grid mt-2">
                        {related.map(p => (
                            <div key={p.id} className="product-card">
                                <div className="product-image">
                                    <Link href={`/products/${p.id}`}>
                                        <img src={p.image} alt={p.name} />
                                    </Link>
                                </div>
                                <div className="product-info">
                                    <Link href={`/products/${p.id}`}>
                                        <h3 className="product-title">{p.name}</h3>
                                    </Link>
                                    <span className="product-price">{Number(p.price).toLocaleString('vi-VN')}₫</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
