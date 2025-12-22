import { getNewsById, getRelatedNews } from '@/lib/db';
import Link from 'next/link';
import RelatedNewsSlider from '@/components/news/RelatedNewsSlider';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const { id } = await params;
    const article = await getNewsById(id);

    if (!article) {
        return {
            title: 'Không tìm thấy bài viết',
        };
    }

    return {
        title: `${article.title} - Trà Thái Nguyên`,
        description: article.excerpt,
    };
}

export default async function NewsDetailPage({ params }) {
    const { id } = await params;
    const article = await getNewsById(id);

    if (!article) {
        return (
            <main className="section-padding page-section">
                <div className="container">
                    <h1>Không tìm thấy bài viết</h1>
                    <p>Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                    <Link href="/news" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
                        Quay lại trang tin tức
                    </Link>
                </div>
            </main>
        );
    }

    const relatedNews = await getRelatedNews(id);

    return (
        <main className="section-padding page-section">
            <div className="container">
                <article className="news-detail">
                    <div className="news-detail-header">
                        <Link href="/news" className="back-link">← Quay lại danh sách</Link>
                        <h1 className="news-title">{article.title}</h1>
                        <div className="news-meta">
                            <span className="news-date">{article.date}</span>
                        </div>
                    </div>

                    <div className="news-detail-image">
                        <img src={article.image} alt={article.title} />
                    </div>

                    <div className="news-detail-content">
                        {/* Render paragraphs if content has newlines, or just text */}
                        {article.content.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </article>

                {/* Related News Section */}
                <RelatedNewsSlider articles={relatedNews} />
            </div>
        </main>
    );
}
