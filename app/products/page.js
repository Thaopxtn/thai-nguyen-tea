import ProductCard from '@/components/product/ProductCard';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getProducts } from '@/lib/db';

export const metadata = {
    title: 'Sản Phẩm - Trà Thái Nguyên',
};

export default async function ProductsPage({ searchParams }) {
    const products = await getProducts();
    const query = searchParams?.search?.toLowerCase() || '';

    const filteredProducts = query
        ? products.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            (p.desc && p.desc.toLowerCase().includes(query))
        )
        : products;

    return (
        <main className="section-padding page-section">
            <div className="container">
                <h1 className="section-title">
                    {query ? `Kết quả tìm kiếm cho "${searchParams.search}"` : 'Tất Cả Sản Phẩm'}
                </h1>
                <p className="subtitle">
                    {query
                        ? `Tìm thấy ${filteredProducts.length} sản phẩm phù hợp.`
                        : 'Khám phá bộ sưu tập trà Thái Nguyên thượng hạng của chúng tôi.'}
                </p>

                {filteredProducts.length > 0 ? (
                    <div className="products-grid">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center mt-4">
                        <p>Không tìm thấy sản phẩm nào.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
