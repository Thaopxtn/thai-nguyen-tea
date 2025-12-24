import { getProductById, getRelatedProducts } from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';

// Server Component for fetching data and metadata
export async function generateMetadata({ params }) {
    try {
        const { id } = await params; // await params in Next.js 15+
        const product = await getProductById(id);

        if (!product) {
            return {
                title: 'Sản phẩm không tồn tại',
            };
        }

        return {
            title: `${product.name} - Trà Thái Nguyên`,
            description: product.desc,
            openGraph: {
                title: product.name,
                description: product.desc,
                images: [product.image],
            },
        };
    } catch (error) {
        console.error("Error generating metadata:", error);
        return {
            title: 'Lỗi tải sản phẩm',
        };
    }
}

export default async function ProductDetailPage({ params }) {
    const { id } = await params;

    // Fetch data in parallel
    const [product, related] = await Promise.all([
        getProductById(id),
        getRelatedProducts(id, 6)
    ]);

    if (!product) {
        notFound();
    }

    return (
        <ProductDetailClient product={product} related={related} />
    );
}
