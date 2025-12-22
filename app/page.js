import Hero from '@/components/home/Hero';
import Image from 'next/image';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { FaCertificate } from 'react-icons/fa';
import { getProducts, getNews } from '@/lib/db';

export default async function Home() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 3);
  const news = await getNews();

  return (
    <main>
      <Hero />

      {/* Features / Intro */}
      <section className="section-padding text-center bg-white">
        <div className="container">
          <div className="fade-in visible">
            <div style={{ fontSize: '2.5rem', color: 'var(--color-accent)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <FaCertificate />
            </div>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>100% Tự Nhiên</h2>
            <p style={{ maxWidth: 600, margin: '0 auto', color: 'var(--color-text-light)' }}>
              Được trồng và chăm sóc theo quy trình VietGAP, đảm bảo từng búp trà đều sạch và giữ trọn hương vị nguyên bản.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="section-padding">
        <div className="container">

          {/* Section 1: Thượng Hạng */}
          <div className="product-section mb-16" style={{ marginBottom: '5rem' }}>
            <h2 className="section-title">Sản Phẩm Thượng Hạng</h2>
            <p className="subtitle">Tuyển tập những loại trà ngon nhất, được sao tẩm thủ công bởi các nghệ nhân lâu năm.</p>
            <div className="products-grid">
              {products
                .filter(p => p.category === 'Thượng Hạng')
                .slice(0, 3)
                .map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>

          {/* Section 2: Cao Cấp */}
          <div className="product-section mb-16" style={{ marginBottom: '5rem' }}>
            <h2 className="section-title">Sản Phẩm Cao Cấp</h2>
            <p className="subtitle">Hương vị trà đỉnh cao, đậm đà bản sắc, chinh phục những người sành trà khó tính nhất.</p>
            <div className="products-grid">
              {products
                .filter(p => p.category === 'Cao Cấp')
                .slice(0, 3)
                .map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>

          {/* Section 3: Truyền Thống */}
          <div className="product-section">
            <h2 className="section-title">Sản Phẩm Truyền Thống</h2>
            <p className="subtitle">Giữ trọn hương vị trà xưa, mộc mạc và gần gũi, mang đậm hồn quê Việt Nam.</p>
            <div className="products-grid">
              {products
                .filter(p => ['Truyền Thống', 'Hương Hoa', 'Thảo Mộc'].includes(p.category))
                .slice(0, 3)
                .map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>

          <div className="text-center" style={{ marginTop: '4rem' }}>
            <Link href="/products" className="btn btn-accent">Xem Tất Cả Sản Phẩm</Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="section-padding" style={{ background: '#f9f9f9' }}>
        <div className="container">
          <h2 className="section-title">Tin Tức & Sự Kiện</h2>
          <div className="news-grid">
            {news.slice(0, 3).map(article => (
              <div key={article.id} className="news-card">
                <div className="news-image" style={{ position: 'relative' }}>
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="news-content">
                  <div className="news-date">{article.date}</div>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <Link href={`/news/${article.id}`} className="read-more">Đọc tiếp</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-2">
            <Link href="/news" className="btn btn-primary">Xem Thêm Tin Tức</Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding about">
        <div className="container about-container">
          <div className="about-content fade-in visible">
            <h2>Câu Chuyện Của Chúng Tôi</h2>
            <p>Sinh ra từ vùng đất danh trà Thái Nguyên, chúng tôi mang trong mình sứ mệnh gìn giữ và lan tỏa văn
              hóa trà Việt. Mỗi búp trà không chỉ là thức uống, mà là câu chuyện về nắng, về gió, và về những giọt
              mồ hôi của người nông dân.</p>
            <p>Chúng tôi cam kết mang đến những sản phẩm trà sạch, hương vị thuần khiết nhất, để mỗi chén trà bạn
              thưởng thức đều là một khoảnh khắc an yên.</p>
            <Link href="/#contact" className="btn btn-accent" style={{ border: '1px solid white' }}>Liên Hệ Hợp Tác</Link>
          </div>
          <div className="about-image fade-in visible" style={{ position: 'relative', height: '400px', width: '100%' }}>
            <Image
              src="/images/hero-bg.png"
              alt="Đồi chè Thái Nguyên"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
