"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaLeaf, FaShoppingBag, FaSearch } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import clsx from 'clsx';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { totalItems } = useCart();
    const pathname = usePathname();

    // Search state
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/products?search=${encodeURIComponent(query)}`);
            setSearchOpen(false);
            setQuery('');
        }
    };

    return (
        <header id="header" className={clsx({ 'scrolled': scrolled })}>
            <div className="container">
                <nav>
                    <Link href="/" className="logo">
                        <FaLeaf /> Thái Nguyên<span>Tea</span>
                    </Link>

                    <ul className={clsx("nav-links", { active: mobileMenuOpen })}>
                        <li><Link href="/">Trang Chủ</Link></li>
                        <li><Link href="/products">Sản Phẩm</Link></li>
                        <li><Link href="/tracking">Tra Cứu Đơn</Link></li>
                        <li><Link href="/contact">Liên Hệ</Link></li>
                    </ul>

                    <div className="header-actions">
                        <div className="search-container">
                            <button
                                className="search-icon-btn"
                                onClick={() => setSearchOpen(!searchOpen)}
                                aria-label="Tìm kiếm"
                            >
                                <FaSearch />
                            </button>
                            <div className={clsx("search-input-wrapper", { active: searchOpen })}>
                                <form onSubmit={handleSearch} style={{ width: '100%' }}>
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="Tìm kiếm sản phẩm..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />
                                </form>
                            </div>
                        </div>

                        <Link href="/cart" className="cart-icon" id="cart-target">
                            <FaShoppingBag />
                            <span className="cart-count">{totalItems}</span>
                        </Link>

                        <div
                            className={clsx("menu-toggle", { open: mobileMenuOpen })}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}
