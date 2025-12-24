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
        images: []
    });

    const fetchProducts = () => fetch('/api/products').then(res => res.json()).then(setProducts);

    useEffect(() => { fetchProducts(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = formData.id ? 'PUT' : 'POST';
        // Ensure images array includes the main image if it's empty, or vice versa if needed.
        // For simplicity, we keep them somewhat independent but synced logic could be added.

        await fetch('/api/products', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
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
        // Ensure p.images is an array
        setFormData({ ...p, images: p.images || [] });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({ id: '', name: '', price: '', category: '', image: '', images: [] });
    };

    // Callback for main image upload
    const handleMainImageUpload = (url) => {
        setFormData(prev => ({ ...prev, image: url }));
    };

    // Callback for gallery upload
    const handleGalleryUpload = (url) => {
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, url]
        }));
    };

    const removeGalleryImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
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

                <div style={{ overflowX: 'auto' }}>
                    <table className="cart-table" style={{ minWidth: '800px' }}>
                        <thead>
                            <tr>
                                <th>Ảnh</th>
                                <th>Tên</th>
                                <th>Giá</th>
                                <th>Danh Mục</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id}>
                                    <td>
                                        <div style={{ width: 50, height: 50, position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
                                            <img src={p.image || '/images/hero-bg.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p.name} />
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>ID: {p.id}</div>
                                    </td>
                                    <td>{Number(p.price).toLocaleString()}₫</td>
                                    <td>{p.category}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn-icon" onClick={() => handleEdit(p)} title="Sửa">✏️</button>
                                            <button className="btn-icon" onClick={() => handleDelete(p.id)} title="Xóa" style={{ color: 'red' }}>🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {showModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
                        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: 8, width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{formData.id ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-2">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Tên sản phẩm</label>
                                    <input className="qty-input" style={{ width: '100%' }} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className="mb-2">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Giá (VND)</label>
                                    <input className="qty-input" style={{ width: '100%' }} type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                </div>
                                <div className="mb-2">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Danh mục</label>
                                    <input className="qty-input" style={{ width: '100%' }} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
                                </div>
                            </div>

                            <div className="mb-4" style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Ảnh Đại Diện</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: 80, height: 80, border: '1px dashed #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: 4 }}>
                                        {formData.image ? <img src={formData.image} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '0.8rem', color: '#999' }}>Chưa có</span>}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <input
                                            className="qty-input"
                                            style={{ width: '100%', marginBottom: '0.5rem' }}
                                            value={formData.image}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="Dán link ảnh hoặc tải lên..."
                                        />
                                        <ImageUpload onUpload={handleMainImageUpload} />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Bộ Sưu Tập Ảnh (Gallery)</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem' }}>
                                    {formData.images && formData.images.map((img, idx) => (
                                        <div key={idx} style={{ position: 'relative', width: 60, height: 60 }}>
                                            <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(idx)}
                                                style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', width: 18, height: 18, border: 'none', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >X</button>
                                        </div>
                                    ))}
                                    <div style={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ImageUpload onUpload={handleGalleryUpload} multiple={true} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-accent" style={{ padding: '0.8rem 1.5rem' }} onClick={() => setShowModal(false)}>Hủy Bỏ</button>
                                <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Lưu Sản Phẩm</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}

