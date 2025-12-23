import { getProductById, getProducts } from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';

// Server Component for fetching data and metadata
export async function generateMetadata({ params }) {
    try {
        const { id } = await params;
        const product = await getProductById(id);

        if (!product) {
            return {
                title: 'Sản phẩm không tồn tại',
                description: 'Không tìm thấy thông tin sản phẩm.',
            };
        }

        return {
            title: `${product.name} - Trà Thái Nguyên`,
            description: product.desc || `Mua ${product.name} chất lượng cao, giá tốt tại Trà Thái Nguyên.`,
            openGraph: {
                title: product.name,
                description: product.desc,
                images: [
                    {
                        url: product.image,
                        width: 800,
                        height: 800,
                        alt: product.name,
                    },
                ],
                type: 'product',
            },
        };
    } catch (error) {
        console.error("Error generating metadata:", error);
        return {
            title: 'Trà Thái Nguyên',
            description: 'Sản phẩm chè Thái Nguyên chính hiệu.',
        };
    }
}

export default async function ProductDetailPage({ params }) {
    try {
        const { id } = await params;

        // Fetch Data
        console.log(`Fetching product with ID: ${id}`);
        const product = await getProductById(id);

        if (!product) {
            console.warn(`Product not found for ID: ${id}`);
        }

        // Fetch related products (simple logic: same category)
        let related = [];
        if (product) {
            try {
                // We could optimize this by creating getRelatedProducts in db.js
                // For now, fetching all and filtering is acceptable for small catalog, 
                // using the same logic as before but server-side.
                const allProducts = await getProducts();
                if (Array.isArray(allProducts)) {
                    related = allProducts
                        .filter(item => item.category === product.category && item.id != product.id)
                        .slice(0, 3);
                }
            } catch (err) {
                console.error("Error fetching related products:", err);
            }
        }

        // Create JSON-LD
        const jsonLd = product ? {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: product.image,
            description: product.desc,
            sku: product.id,
            brand: {
                '@type': 'Brand',
                name: 'Trà Thái Nguyên'
            },
            offers: {
                '@type': 'Offer',
                url: `https://thai-nguyen-tea.vercel.app/products/${product.id}`,
                priceCurrency: 'VND',
                price: product.price,
                availability: 'https://schema.org/InStock',
                itemCondition: 'https://schema.org/NewCondition'
            }
        } : null;

        return (
            <>
                {jsonLd && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                    />
                )}
                <ProductDetailClient product={product} related={related} />
            </>
        );
    } catch (error) {
        console.error("CRITICAL ERROR in ProductDetailPage:", error);
        return (
            <div className="container py-10 text-center">
                <h2>Đã xảy ra lỗi khi tải sản phẩm.</h2>
                <p>Vui lòng thử lại sau.</p>
                <p className="text-sm text-gray-500 mt-2">{error.message}</p>
            </div>
        );
    }
}
