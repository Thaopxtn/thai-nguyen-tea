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

        const products = await Product.find({}).sort({ createdAt: 1 });
        return products.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category,
            image: p.image,
            desc: p.desc,
            originalPrice: p.originalPrice, // Include originalPrice
        }));
    } catch (e) {
        console.warn("DB Error (getProducts), returning MOCK data:", e.message);
        return MOCK_PRODUCTS;
    }
}

export async function saveProducts(products) {
    // This function was originally overwriting the whole file. 
    // In Mongo, we should technically handle bulk write, but existing Admin implementation 
    // likely pushed to this array and saved the whole thing or used API.
    // Wait, the API routes call getProducts then modify array then saveProducts.
    // We should refactor the API routes to use direct DB calls for efficiency, 
    // BUT to save time, we can keep the "saveProducts" abstraction if we really want, 
    // but better to deprecate it and let API routes talk to models.

    // HOWEVER, to minimize code changes in API routes, let's see. 
    // API Routes `api/products/route.js`:
    // POST: push new product -> saveProducts(products)
    // PUT: modify index -> saveProducts(products)
    // This "Overwrite all" approach is bad for DB.

    // STRATEGY: We will update `lib/db.js` to simply export the Models or Methods 
    // and we MUST UPDATE API ROUTES to use Mongoose methods directly.
    // The previous synchronous `getProducts()` used in components will break if we don't return a promise.
    // The components `app/page.js` etc are `async` now, so `await getProducts()` is fine.

    return; // No-op, we will update API routes
}

// ... Actually, let's just make `lib/db` the data access layer.
// API Routes are using `getProducts()` then `saveProducts()`. 
// We should update API routes.
// But first, let's fix the READ operations for the frontend.

export async function getNews() {
    try {
        const conn = await dbConnect();
        if (!conn) throw new Error("No DB Connection");

        const news = await News.find({}).sort({ createdAt: -1 });
        return news.map(n => ({
            id: n.id,
            title: n.title,
            excerpt: n.excerpt,
            date: n.date,
            image: n.image,
            content: n.content || n.excerpt // Fallback
        }));
    } catch (e) {
        console.warn("DB Error (getNews), returning MOCK data:", e.message);
        return MOCK_NEWS;
    }
}

export async function getNewsById(id) {
    try {
        const conn = await dbConnect();
        if (!conn) throw new Error("No DB Connection");

        const article = await News.findOne({ id: id });
        if (!article) return null;

        return {
            id: article.id,
            title: article.title,
            excerpt: article.excerpt,
            date: article.date,
            image: article.image,
            content: article.content || article.excerpt
        };
    } catch (e) {
        console.warn("DB Error (getNewsById), returning MOCK data", e.message);
        return MOCK_NEWS.find(n => n.id === id) || null;
    }
}

export async function getRelatedNews(currentId, limit = 6) {
    try {
        const conn = await dbConnect();
        if (!conn) throw new Error("No DB Connection");

        // Use aggregate $sample to get random documents
        const related = await News.aggregate([
            { $match: { id: { $ne: currentId } } },
            { $sample: { size: limit } }
        ]);

        return related.map(n => ({
            id: n.id,
            title: n.title,
            excerpt: n.excerpt,
            date: n.date,
            image: n.image
        }));
    } catch (e) {
        console.warn("DB Error (getRelatedNews), returning MOCK data", e.message);
        // Random shuffle mock data
        return MOCK_NEWS
            .filter(n => n.id !== currentId)
            .sort(() => 0.5 - Math.random())
            .slice(0, limit);
    }
}

export async function getOrders() {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return orders.map(o => ({
        id: o.id,
        customer: o.customer,
        phone: o.phone,
        address: o.address,
        note: o.note,
        total: o.total,
        status: o.status,
        items: o.items,
        createdAt: o.createdAt.toString()
    }));
}

export async function getCustomers() {
    await dbConnect();
    // Dynamically import to ensure connection if needed
    const Customer = (await import('@/models/Customer')).default;
    const customers = await Customer.find({}).sort({ lastOrderDate: -1 });
    return customers.map(c => ({
        id: c.id,
        phone: c.phone,
        name: c.name,
        address: c.address,
        totalOrders: c.totalOrders,
        totalSpent: c.totalSpent,
        lastOrderDate: c.lastOrderDate ? c.lastOrderDate.toISOString() : null
    }));
}

// --- Seed Data (Async now) ---
export async function seedData() {
    try {
        await dbConnect();

        // Always attempt to upsert to ensure new products/news are added
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

// Deprecated setters export for compatibility check, but we won't use them in updated API routes
export const saveNews = () => { };
export const saveOrders = () => { };
