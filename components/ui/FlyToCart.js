"use client";

import { useEffect, useState } from 'react';

export default function FlyToCart() {
    const [flyingItems, setFlyingItems] = useState([]);

    useEffect(() => {
        const handleFly = (e) => {
            const { startRect, imageSrc } = e.detail;

            // Target the specific ID we added in Header
            const cartIcon = document.getElementById('cart-target');
            if (!cartIcon) return;
            const endRect = cartIcon.getBoundingClientRect();

            // Calculate center of the target icon
            const targetX = endRect.left + (endRect.width / 2) - 10; // -10 for half of flying item width (20px)
            const targetY = endRect.top + (endRect.height / 2) - 10;

            const newItem = {
                id: Date.now(),
                src: imageSrc,
                start: { top: startRect.top, left: startRect.left, width: startRect.width, height: startRect.height },
                end: { top: targetY, left: targetX }
            };

            setFlyingItems(prev => [...prev, newItem]);

            // Remove after animation
            setTimeout(() => {
                setFlyingItems(prev => prev.filter(i => i.id !== newItem.id));
            }, 800); // Animation duration
        };

        window.addEventListener('fly-to-cart', handleFly);
        return () => window.removeEventListener('fly-to-cart', handleFly);
    }, []);

    return (
        <>
            {flyingItems.map(item => (
                <img
                    key={item.id}
                    src={item.src}
                    className="flying-img"
                    style={{
                        position: 'fixed',
                        top: item.start.top,
                        left: item.start.left,
                        width: item.start.width,
                        height: item.start.height,
                        zIndex: 9999,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        animation: `flyToCartClean 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards`
                    }}
                />
            ))}
            <style jsx global>{`
                @keyframes flyToCartClean {
                    0% { opacity: 0.8; }
                    100% { 
                        top: 20px; 
                        left: calc(100vw - 120px); /* fallback */
                        width: 20px; 
                        height: 20px; 
                        opacity: 0.2; 
                    }
                }
            `}</style>
        </>
    );
}

// Helper to trigger
export function triggerFly(targetElement, imageSrc) {
    if (!targetElement) return;
    const rect = targetElement.getBoundingClientRect();
    window.dispatchEvent(new CustomEvent('fly-to-cart', {
        detail: { startRect: rect, imageSrc: imageSrc }
    }));
}
