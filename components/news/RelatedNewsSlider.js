'use client';

import Link from 'next/link';

export default function RelatedNewsSlider({ articles }) {
    if (!articles || articles.length === 0) return null;

    return (
        <div className="related-news mt-4">
            <h2 className="section-title text-center mb-2">Bài Viết Gợi Ý</h2>
            <div className="related-slider-container">
                <div className="related-slider">
                    {articles.map(item => (
                        <div key={item.id} className="news-card slider-card">
                            <div className="news-image" style={{ height: '180px' }}>
                                <Link href={`/news/${item.id}`}>
                                    <img src={item.image} alt={item.title} />
                                </Link>
                            </div>
                            <div className="news-content">
                                <div className="news-date">{item.date}</div>
                                <Link href={`/news/${item.id}`}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                                </Link>
                                {/* Short excerpt optional */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
