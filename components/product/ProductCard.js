"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { triggerFly } from '@/components/ui/FlyToCart';
import { useRef } from 'react';
import { FaStar } from 'react-icons/fa';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const imgRef = useRef(null);

    const handleAddToCart = (e) => {
        addToCart(product);
        triggerFly(imgRef.current, product.image);
        // alert(`Đã thêm ${product.name} vào giỏ!`); // Disabled alert as requested (implied by "except Toast" meaning no annoying popups, assuming fly is enough feedback)
    };

    return (
        <div className="product-card fade-in visible">
            <div className="product-image" style={{ position: 'relative' }}>
                {product.originalPrice && product.originalPrice > product.price && (
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#e74c3c',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        zIndex: 2
                    }}>
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                )}
                <Link href={`/products/${product.id}`}>
                    <img ref={imgRef} src={product.image} alt={product.name} />
                </Link>
            </div>
            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 className="product-title">{product.name}</h3>
                </Link>
                {product.rating > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '8px', color: '#fbbf24' }}>
                        <FaStar />
                        <span style={{ color: '#4b5563', fontSize: '0.875rem' }}>{product.rating} ({product.numReviews} đánh giá)</span>
                    </div>
                )}
                <div className="product-price" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.2 }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{Number(product.price).toLocaleString('vi-VN')}₫ <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>/ 500g</span></span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9rem' }}>
                            {Number(product.originalPrice).toLocaleString('vi-VN')}₫
                        </span>
                    )}
                </div>
                <button
                    className="btn btn-primary add-to-cart"
                    onClick={handleAddToCart}
                >
                    Thêm Vào Giỏ
                </button>
            </div>
        </div>
    );
}
