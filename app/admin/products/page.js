"use client";

import { useEffect, useState } from 'react';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ id: '', name: '', price: '', category: '', image: '' });

    const fetchProducts = () => fetch('/api/products').then(res => res.json()).then(setProducts);

    useEffect(() => { fetchProducts(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = formData.id ? 'PUT' : 'POST';
        await fetch('/api/products', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        setShowModal(false);
        fetchProducts();
        setFormData({ id: '', name: '', price: '', category: '', image: '' });
    };

    const handleDelete = async (id) => {
        if (confirm('Xóa sản phẩm này?')) {
            await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
            fetchProducts();
        }
    };

    const handleEdit = (p) => {
        setFormData(p);
        setShowModal(true);
    };

    return (
        <main className="section-padding page-section">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 className="section-title">Quản Lý Sản Phẩm</h1>
                    <button className="btn btn-primary" onClick={() => { setFormData({ id: '', name: '', price: '', category: '', image: '' }); setShowModal(true); }}>
                        + Thêm Sản Phẩm
                    </button>
                </div>

                <table className="cart-table">
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
                                <td><img src={p.image} style={{ width: 50, height: 50, objectFit: 'cover' }} /></td>
                                <td>{p.name}</td>
                                <td>{Number(p.price).toLocaleString()}₫</td>
                                <td>{p.category}</td>
                                <td>
                                    <button onClick={() => handleEdit(p)} style={{ marginRight: 10 }}>✏️</button>
                                    <button onClick={() => handleDelete(p.id)} style={{ color: 'red' }}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal */}
                {showModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
                        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: 8, width: 400 }}>
                            <h3>{formData.id ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}</h3>
                            <div className="mb-1">
                                <label>Tên sản phẩm</label>
                                <input className="qty-input" style={{ width: '100%' }} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="mb-1">
                                <label>Giá</label>
                                <input className="qty-input" style={{ width: '100%' }} type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                            </div>
                            <div className="mb-1">
                                <label>Danh mục</label>
                                <input className="qty-input" style={{ width: '100%' }} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
                            </div>
                            <div className="mb-1">
                                <label>Link Ảnh</label>
                                <input className="qty-input" style={{ width: '100%' }} value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} required />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Lưu</button>
                                <button type="button" className="btn btn-accent" style={{ padding: '0.5rem 1rem' }} onClick={() => setShowModal(false)}>Hủy</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
}
