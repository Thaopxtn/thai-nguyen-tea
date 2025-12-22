import { getProductById, getProducts } from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';

// Server Component for fetching data and metadata
export async function generateMetadata({ params }) {
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
}

export default async function ProductDetailPage({ params }) {
    const { id } = await params;

    // Fetch Data
    const product = await getProductById(id);

    // Fetch related products (simple logic: same category)
    let related = [];
    if (product) {
        // We could optimize this by creating getRelatedProducts in db.js
        // For now, fetching all and filtering is acceptable for small catalog, 
        // using the same logic as before but server-side.
        const allProducts = await getProducts();
        related = allProducts
            .filter(item => item.category === product.category && item.id != product.id)
            .slice(0, 3);
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
}
