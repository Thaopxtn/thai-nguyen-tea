'use client';

import Link from 'next/link';

export default function RelatedNewsSlider({ articles }) {
    if (!articles || articles.length === 0) return null;

    return (
        <div className="related-news mt-4">
            <h2 className="section-title text-center mb-2">Bài Viết Gợi Ý</h2>
            <div className="news-grid">
                {articles.map(item => (
                    <div key={item.id} className="news-card">
                        <div className="news-image" style={{ height: '200px' }}>
                            <Link href={`/news/${item.id}`}>
                                <img src={item.image} alt={item.title} />
                            </Link>
                        </div>
                        <div className="news-content">
                            <div className="news-date">{item.date}</div>
                            <Link href={`/news/${item.id}`}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                            </Link>
                            <p style={{ fontSize: '0.9rem', color: '#666', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {item.excerpt}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
