import Link from 'next/link';

export const runtime = 'nodejs';
import { getNews } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Tin Tức - Trà Thái Nguyên',
};

export default async function NewsPage() {
    const articles = await getNews();

    return (
        <main className="section-padding page-section">
            <div className="container">
                <h1 className="section-title">Tin Tức & Sự Kiện</h1>
                <div className="news-grid">
                    {articles.map(article => (
                        <div key={article.id} className="news-card">
                            <div className="news-image">
                                <img src={article.image} alt={article.title} />
                            </div>
                            <div className="news-content">
                                <div className="news-date">{article.date}</div>
                                <h3>{article.title}</h3>
                                <p>{article.excerpt}</p>
                                <Link href={`/news/${article.id}`} className="read-more">
                                    Đọc tiếp
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
