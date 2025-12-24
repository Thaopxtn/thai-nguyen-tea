"use client";

import { useEffect, useState } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: '',
        category: '',
        image: '',
        images: [],
        desc: ''
    });

    const fetchProducts = () => fetch('/api/products').then(res => res.json()).then(setProducts);

    useEffect(() => { fetchProducts(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = formData.id ? 'PUT' : 'POST';

        // SYNC LOGIC: The first image in the list is ALWAYS the main image
        const finalData = { ...formData };
        if (finalData.images && finalData.images.length > 0) {
            finalData.image = finalData.images[0];
        } else {
            finalData.image = '';
        }

        await fetch('/api/products', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalData)
        });
        setShowModal(false);
        fetchProducts();
        resetForm();
    };

    const handleDelete = async (id) => {
        if (confirm('Xóa sản phẩm này?')) {
            await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
            fetchProducts();
        }
    };

    const handleEdit = (p) => {
        // MIGRATION LOGIC: If existing product has 'image' but it's not in 'images', add it.
        let currentImages = p.images || [];
        if (p.image && !currentImages.includes(p.image)) {
            currentImages = [p.image, ...currentImages];
        }

        setFormData({
            ...p,
            price: p.price || '',
            images: currentImages
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({ id: '', name: '', price: '', category: '', image: '', images: [], desc: '' });
    };

    // Callback for gallery upload (appends to list)
    const handleImageUpload = (url) => {
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, url]
        }));
    };

    const removeImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const moveImage = (index, direction) => {
        const newImages = [...formData.images];
        if (direction === 'left' && index > 0) {
            [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
        } else if (direction === 'right' && index < newImages.length - 1) {
            [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
        }
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    return (
        <main className="section-padding page-section">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 className="section-title">Quản Lý Sản Phẩm - Admin</h1>
                    <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
                        + Thêm Sản Phẩm
                    </button>
                </div>

                <div style={{ overflowX: 'auto', background: 'white', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <table className="cart-table" style={{ minWidth: '800px', width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8f9fa' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Ảnh</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Tên Sản Phẩm</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Giá</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Danh Mục</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ width: 60, height: 60, borderRadius: 4, overflow: 'hidden', border: '1px solid #ddd' }}>
                                            <img src={p.image || '/images/hero-bg.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p.name} />
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600, fontSize: '1rem' }}>{p.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>ID: {p.id}</div>
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                                        {Number(p.price).toLocaleString()}₫
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ padding: '4px 8px', background: '#eef2ff', color: '#4f46e5', borderRadius: 4, fontSize: '0.9rem' }}>
                                            {p.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="btn btn-primary"
                                            style={{ marginRight: 8, padding: '6px 12px', fontSize: '0.9rem' }}
                                        >Sửa</button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="btn"
                                            style={{ background: '#fee2e2', color: '#b91c1c', padding: '6px 12px', fontSize: '0.9rem', border: 'none' }}
                                        >Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {showModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, padding: '20px' }}>
                        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: 12, width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111' }}>{formData.id ? 'Cập Nhật Sản Phẩm' : 'Thêm Mới Sản Phẩm'}</h3>
                                <button type="button" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>&times;</button>
                            </div>

                            <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>Tên sản phẩm <span style={{ color: 'red' }}>*</span></label>
                                    <input className="qty-input" style={{ width: '100%', padding: '10px' }} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="Ví dụ: Trà Tân Cương" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>Giá bán (VNĐ) <span style={{ color: 'red' }}>*</span></label>
                                    <input className="qty-input" style={{ width: '100%', padding: '10px' }} type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>Danh mục <span style={{ color: 'red' }}>*</span></label>
                                    <input className="qty-input" style={{ width: '100%', padding: '10px' }} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required list="categories" />
                                    <datalist id="categories">
                                        <option value="Cao Cấp" />
                                        <option value="Truyền Thống" />
                                        <option value="Thượng Hạng" />
                                    </datalist>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>Mô tả ngắn</label>
                                    <input className="qty-input" style={{ width: '100%', padding: '10px' }} value={formData.desc || ''} onChange={e => setFormData({ ...formData, desc: e.target.value })} placeholder="Mô tả ngắn về sản phẩm..." />
                                </div>
                            </div>

                            {/* UNIFIED IMAGE MANAGEMENT */}
                            <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <label style={{ fontWeight: 600, fontSize: '1.1rem' }}>Quản Lý Hình Ảnh</label>
                                    <ImageUpload onUpload={handleImageUpload} multiple={true} />
                                </div>
                                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                                    Ảnh đầu tiên sẽ là <strong>Ảnh Đại Diện</strong>. Sử dụng nút mũi tên để thay đổi vị trí.
                                </p>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px' }}>
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} style={{
                                            position: 'relative',
                                            aspectRatio: '1/1',
                                            borderRadius: 8,
                                            overflow: 'hidden',
                                            border: idx === 0 ? '3px solid var(--color-primary)' : '1px solid #ddd',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}>
                                            <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                                            {/* Badge for Main Image */}
                                            {idx === 0 && (
                                                <span style={{
                                                    position: 'absolute', top: 0, left: 0,
                                                    background: 'var(--color-primary)', color: 'white',
                                                    fontSize: '0.7rem', padding: '2px 8px',
                                                    borderBottomRightRadius: 8
                                                }}>★ ĐẠI DIỆN</span>
                                            )}

                                            {/* Overlay Controls */}
                                            <div style={{
                                                position: 'absolute', bottom: 0, left: 0, width: '100%',
                                                background: 'rgba(0,0,0,0.7)', padding: '5px',
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                            }}>
                                                <button
                                                    type="button"
                                                    onClick={() => moveImage(idx, 'left')}
                                                    disabled={idx === 0}
                                                    style={{ color: 'white', background: 'none', border: 'none', cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.3 : 1 }}
                                                >◀</button>

                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    style={{ color: '#ff6b6b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                                    title="Xóa ảnh"
                                                >✖</button>

                                                <button
                                                    type="button"
                                                    onClick={() => moveImage(idx, 'right')}
                                                    disabled={idx === formData.images.length - 1}
                                                    style={{ color: 'white', background: 'none', border: 'none', cursor: idx === formData.images.length - 1 ? 'default' : 'pointer', opacity: idx === formData.images.length - 1 ? 0.3 : 1 }}
                                                >▶</button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Upload Placeholder if empty */}
                                    {formData.images.length === 0 && (
                                        <div style={{
                                            border: '2px dashed #ddd', borderRadius: 8,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#999', fontSize: '0.9rem', flexDirection: 'column', gap: '5px'
                                        }}>
                                            <span>Chưa có ảnh</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1.5rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-accent" style={{ padding: '0.8rem 1.5rem', borderRadius: 6 }} onClick={() => setShowModal(false)}>Hủy Bỏ</button>
                                <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2.5rem', borderRadius: 6, fontWeight: 600 }}>
                                    {formData.id ? 'Cập Nhật' : 'Tạo Mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}
