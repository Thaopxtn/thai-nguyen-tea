import Link from 'next/link';

export default function Hero() {
    return (
        <section id="home" className="hero">
            <div className="hero-content">
                <h1>Tinh Hoa Trà Việt</h1>
                <p>Khám phá hương vị đậm đà, tinh tế từ những đồi chè xanh mướt Thái Nguyên. <br />Kết tinh của đất trời và
                    bàn tay nghệ nhân.</p>
                <Link href="/products" className="btn btn-accent">Khám Phá Ngay</Link>
            </div>
        </section>
    );
}
