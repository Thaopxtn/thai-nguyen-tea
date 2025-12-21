"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [mounted, setMounted] = useState(false);

    // Initial Load
    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('thai_nguyen_tea_cart');
        if (stored) {
            try {
                setCart(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Sync to LocalStorage
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('thai_nguyen_tea_cart', JSON.stringify(cart));
        }
    }, [cart, mounted]);

    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.id == product.id);
            if (existing) {
                return prev.map(item =>
                    item.id == product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });

        // Optional: Toast notification here if we add ToastContext later
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id != productId));
    };

    const updateQuantity = (productId, change) => {
        setCart(prev => prev.map(item => {
            if (item.id == productId) {
                const newQty = item.quantity + change;
                return { ...item, quantity: newQty < 1 ? 1 : newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
