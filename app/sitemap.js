import { getProducts, getNews } from '@/lib/db';

export default async function sitemap() {
    const products = await getProducts();
    const news = await getNews();
    const baseUrl = 'https://thai-nguyen-tea.vercel.app';

    const productUrls = products.map((product) => ({
        url: `${baseUrl}/products/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    const newsUrls = news.map((item) => ({
        url: `${baseUrl}/news/${item.id}`,
        lastModified: item.date,
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/news`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        ...productUrls,
        ...newsUrls,
    ];
}
