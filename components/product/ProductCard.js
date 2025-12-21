"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { triggerFly } from '@/components/ui/FlyToCart';
import { useRef } from 'react';

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
            <div className="product-image">
                <Link href={`/products/${product.id}`}>
                    <img ref={imgRef} src={product.image} alt={product.name} />
                </Link>
            </div>
            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 className="product-title">{product.name}</h3>
                </Link>
                <span className="product-price">{Number(product.price).toLocaleString('vi-VN')}₫ / 500g</span>
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
