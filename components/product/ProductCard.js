"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { triggerFly } from '@/components/ui/FlyToCart';
import { useRef } from 'react';
import { FaStar } from 'react-icons/fa';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const imgRef = useRef(null);

    const handleAddToCart = (e) => {
        addToCart(product);
        // Pass the current DOM node from the ref
        triggerFly(imgRef.current, product.image);
    };

    return (
        <div className="product-card fade-in visible">
            <div className="product-image">
                {product.originalPrice && product.originalPrice > product.price && (
                    <div className="badge-discount">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                )}
                <Link href={`/products/${product.id}`}>
                    <Image
                        ref={imgRef}
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                    />
                </Link>
            </div>
            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <Link href={`/products/${product.id}`} className="no-underline">
                    <h3 className="product-title">{product.name}</h3>
                </Link>
                {product.rating > 0 && (
                    <div className="rating-group">
                        <FaStar />
                        <span className="rating-text">{product.rating} ({product.numReviews} đánh giá)</span>
                    </div>
                )}
                <div className="price-group">
                    <span className="price-current">
                        {Number(product.price).toLocaleString('vi-VN')}₫ <span className="price-unit">/ 500g</span>
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="price-old">
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
