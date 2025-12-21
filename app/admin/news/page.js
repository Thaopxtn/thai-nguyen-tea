"use client";

import { useEffect, useState } from 'react';

export default function AdminNewsPage() {
    const [news, setNews] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ id: '', title: '', excerpt: '', date: '', image: '' });

    const fetchNews = () => fetch('/api/news').then(res => res.json()).then(setNews);

    useEffect(() => { fetchNews(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = formData.id ? 'PUT' : 'POST';
        await fetch('/api/news', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        setShowModal(false);
        fetchNews();
        setFormData({ id: '', title: '', excerpt: '', date: '', image: '' });
    };

    const handleDelete = async (id) => {
        if (confirm('Xóa bài viết này?')) {
            await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
            fetchNews();
        }
    };

    const handleEdit = (item) => {
        setFormData(item);
        setShowModal(true);
    };

    return (
        <main className="section-padding page-section">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 className="section-title">Quản Lý Tin Tức</h1>
                    <button className="btn btn-primary" onClick={() => { setFormData({ id: '', title: '', excerpt: '', date: '', image: '' }); setShowModal(true); }}>
                        + Viết Bài Mới
                    </button>
                </div>

                <table className="cart-table">
                    <thead>
                        <tr>
                            <th>Ảnh</th>
                            <th>Tiêu Đề</th>
                            <th>Ngày</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {news.map(item => (
                            <tr key={item.id}>
                                <td><img src={item.image} style={{ width: 50, height: 50, objectFit: 'cover' }} /></td>
                                <td>{item.title}</td>
                                <td>{item.date}</td>
                                <td>
                                    <button onClick={() => handleEdit(item)} style={{ marginRight: 10 }}>✏️</button>
                                    <button onClick={() => handleDelete(item.id)} style={{ color: 'red' }}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal */}
                {showModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
                        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: 8, width: 400 }}>
                            <h3>{formData.id ? 'Sửa Bài Viết' : 'Thêm Bài Viết'}</h3>
                            <div className="mb-1">
                                <label>Tiêu đề</label>
                                <input className="qty-input" style={{ width: '100%' }} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div className="mb-1">
                                <label>Mô tả ngắn</label>
                                <textarea className="qty-input" style={{ width: '100%' }} value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} required />
                            </div>
                            <div className="mb-1">
                                <label>Ngày</label>
                                <input className="qty-input" type="date" style={{ width: '100%' }} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
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
