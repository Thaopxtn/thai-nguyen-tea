import dbConnect from './mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import News from '@/models/News';

// --- Helper Helper ---
// Since Next.js App Router calls are often async, we need to ensure DB is connected.
// However, the original functions were sync in some places (e.g. imports). 
// BUT we refactored Page components to be async already! So we can make these async.
// NOTE: "seedData" was called in layout. That needs to be careful.

import { MOCK_PRODUCTS, MOCK_NEWS } from './mock-data';

export async function getProducts() {
    try {
        const conn = await dbConnect();
        if (!conn) throw new Error("No DB Connection");

        // Use lean() to get plain JS objects instead of Mongoose docs
        const products = await Product.find({}).sort({ createdAt: 1 }).lean();

        // Deep serialization to ensure no hidden non-serializable properties (like ObjectId or Date) remain
        return JSON.parse(JSON.stringify(products.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category,
            image: p.image,
            desc: p.desc,
            originalPrice: p.originalPrice,
        }))));
    } catch (e) {
        console.warn("DB Error (getProducts), returning MOCK data:", e.message);
        return JSON.parse(JSON.stringify(Array.isArray(MOCK_PRODUCTS) ? MOCK_PRODUCTS : []));
    }
}

export async function saveProducts(products) {
    // Deprecated or Placeholder
    return;
}

export async function getRelatedProducts(currentId, limit = 4) {
    try {
        const conn = await dbConnect();
        if (!conn) throw new Error("No DB Connection");

        const related = await Product.aggregate([
            { $match: { id: { $ne: currentId } } },
            { $sample: { size: limit } }
        ]);

        return JSON.parse(JSON.stringify(related.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category,
            image: p.image,
            desc: p.desc,
            originalPrice: p.originalPrice,
            rating: p.rating,
            numReviews: p.numReviews
        }))));
    } catch (e) {
        console.warn("DB Error (getRelatedProducts), returning MOCK data", e.message);
        return JSON.parse(JSON.stringify(
            MOCK_PRODUCTS
                .filter(p => p.id !== currentId)
                .sort(() => 0.5 - Math.random())
                .slice(0, limit)
        ));
    }
}

export async function getNews() {
    try {
        const conn = await dbConnect();
        if (!conn) throw new Error("No DB Connection");

        const news = await News.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(news.map(n => ({
            id: n.id,
            title: n.title,
            excerpt: n.excerpt,
            date: n.date,
            image: n.image,
            content: n.content || n.excerpt
        }))));
    } catch (e) {
        console.warn("DB Error (getNews), returning MOCK data:", e.message);
        return MOCK_NEWS;
    }
}

export async function getNewsById(id) {
    try {
        const conn = await dbConnect();
        if (!conn) throw new Error("No DB Connection");

        const article = await News.findOne({ id: id }).lean();
        if (!article) return null;

        return JSON.parse(JSON.stringify({
            id: article.id,
            title: article.title,
            excerpt: article.excerpt,
            date: article.date,
            image: article.image,
            content: article.content || article.excerpt
        }));
    } catch (e) {
        console.warn("DB Error (getNewsById), returning MOCK data", e.message);
        return MOCK_NEWS.find(n => n.id === id) || null;
    }
}

export async function getRelatedNews(currentId, limit = 6) {
    try {
        const conn = await dbConnect();
        if (!conn) throw new Error("No DB Connection");

        const related = await News.aggregate([
            { $match: { id: { $ne: currentId } } },
            { $sample: { size: limit } }
        ]);

        return JSON.parse(JSON.stringify(related.map(n => ({
            id: n.id,
            title: n.title,
            excerpt: n.excerpt,
            date: n.date,
            image: n.image
        }))));
    } catch (e) {
        console.warn("DB Error (getRelatedNews), returning MOCK data", e.message);
        return MOCK_NEWS
            .filter(n => n.id !== currentId)
            .sort(() => 0.5 - Math.random())
            .slice(0, limit);
    }
}

export async function getOrders() {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(orders.map(o => ({
        id: o.id,
        customer: o.customer,
        phone: o.phone,
        address: o.address,
        note: o.note,
        total: o.total,
        status: o.status,
        items: o.items,
        createdAt: o.createdAt.toString()
    }))));
}

export async function getCustomers() {
    await dbConnect();
    const Customer = (await import('@/models/Customer')).default;
    const customers = await Customer.find({}).sort({ lastOrderDate: -1 }).lean();
    return JSON.parse(JSON.stringify(customers.map(c => ({
        id: c.id,
        phone: c.phone,
        name: c.name,
        address: c.address,
        totalOrders: c.totalOrders,
        totalSpent: c.totalSpent,
        lastOrderDate: c.lastOrderDate ? c.lastOrderDate.toISOString() : null
    }))));
}

// --- Seed Data (Async now) ---
export async function seedData() {
    try {
        await dbConnect();

        console.log("Seeding/Updating products...");
        for (const p of MOCK_PRODUCTS) {
            await Product.updateOne({ id: p.id }, { $set: p }, { upsert: true });
        }
        console.log("Products seeded/updated.");

        console.log("Seeding/Updating news...");
        for (const n of MOCK_NEWS) {
            await News.updateOne({ id: n.id }, { $set: n }, { upsert: true });
        }
        console.log("News seeded/updated.");
    } catch (e) {
        console.error("Seed data failed (DB might not be connected)", e);
    }
}

export const saveNews = () => { };
export const saveOrders = () => { };

export async function getProductById(id) {
    try {
        const conn = await dbConnect();
        if (!conn) throw new Error("No DB Connection");

        // Use lean() for performance and simple object return
        const p = await Product.findOne({ id: id }).lean();
        if (!p) return null;

        // Force rigorous serialization to ensure clean POJO for Next.js Server Components
        return JSON.parse(JSON.stringify({
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category,
            image: p.image,
            desc: p.desc,
            originalPrice: p.originalPrice,
            rating: p.rating,
            numReviews: p.numReviews,
            reviews: p.reviews ? p.reviews.map(r => ({
                user: r.user,
                rating: r.rating,
                comment: r.comment,
                date: r.date
            })) : [],
        }));
    } catch (e) {
        console.error("DB Error (getProductById):", e);
        return JSON.parse(JSON.stringify(MOCK_PRODUCTS.find(p => p.id === id) || null));
    }
}
