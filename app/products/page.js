import ProductCard from '@/components/product/ProductCard';
import { getProducts } from '@/lib/db';

export const metadata = {
    title: 'Sản Phẩm - Trà Thái Nguyên',
};

export default async function ProductsPage() {
    const products = getProducts();

    return (
        <main className="section-padding page-section">
            <div className="container">
                <h1 className="section-title">Tất Cả Sản Phẩm</h1>
                <p className="subtitle">Khám phá bộ sưu tập trà Thái Nguyên thượng hạng của chúng tôi.</p>

                <div className="products-grid">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </main>
    );
}
