import dbConnect from './mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import News from '@/models/News';

// --- Helper Helper ---
// Since Next.js App Router calls are often async, we need to ensure DB is connected.
// However, the original functions were sync in some places (e.g. imports). 
// BUT we refactored Page components to be async already! So we can make these async.
// NOTE: "seedData" was called in layout. That needs to be careful.

export async function getProducts() {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: 1 });
    // Convert to plain object to avoid serialization issues in Next.js
    return products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        image: p.image,
        desc: p.desc
    }));
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
    await dbConnect();
    const news = await News.find({}).sort({ createdAt: -1 });
    return news.map(n => ({
        id: n.id,
        title: n.title,
        excerpt: n.excerpt,
        date: n.date,
        image: n.image
    }));
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

// --- Seed Data (Async now) ---
export async function seedData() {
    try {
        await dbConnect();

        const pCount = await Product.countDocuments();
        if (pCount === 0) {
            const initialProducts = [
                {
                    "id": "1",
                    "name": "Trà Tân Cương Đặc Biệt",
                    "price": 450000,
                    "category": "Cao Cấp",
                    "image": "/images/product-1.png",
                    "desc": "Hương vị đậm đà, nước xanh, vị chát dịu hậu ngọt sâu."
                },
                {
                    "id": "2",
                    "name": "Trà Móc Câu Hảo Hạng",
                    "price": 320000,
                    "category": "Truyền Thống",
                    "image": "/images/product-2.png",
                    "desc": "Cánh trà xoăn nhỏ, hương cốm non nồng nàn."
                },
                {
                    "id": "3",
                    "name": "Trà Nõn Tôm Vương Giả",
                    "price": 850000,
                    "category": "Thượng Hạng",
                    "image": "/images/product-1.png",
                    "desc": "Tuyệt phẩm trà Việt. Chỉ lấy 1 tôm 1 lá non nhất."
                },
                {
                    "id": "4",
                    "name": "Trà Shan Tuyết Cổ Thụ",
                    "price": 550000,
                    "category": "Cao Cấp",
                    "image": "/images/product-2.png",
                    "desc": "Thu hái từ những cây chè cổ thụ trên núi cao, hương vị tinh khiết."
                },
                {
                    "id": "5",
                    "name": "Trà Lài Tự Nhiên",
                    "price": 280000,
                    "category": "Hương Hoa",
                    "image": "/images/product-1.png",
                    "desc": "Ướp hương hoa lài tự nhiên, thơm ngát, dễ uống."
                },
                {
                    "id": "6",
                    "name": "Trà Sen Tây Hồ",
                    "price": 1200000,
                    "category": "Thượng Hạng",
                    "image": "/images/product-2.png",
                    "desc": "Tinh hoa trà Việt. Ướp trong bông sen bách diệp hồ Tây."
                }
            ];
            await Product.insertMany(initialProducts);
        }

        const nCount = await News.countDocuments();
        if (nCount === 0) {
            const initialNews = [
                {
                    "id": "1",
                    "title": "Lễ Hội Trà Thái Nguyên 2024",
                    "image": "/images/hero-bg.png",
                    "date": "2024-12-20",
                    "excerpt": "Hòa mình vào không khí lễ hội đặc sắc với các hoạt động văn hóa trà truyền thống."
                },
                {
                    "id": "2",
                    "title": "Cách Pha Trà Ngon Đúng Điệu",
                    "image": "/images/product-2.png",
                    "date": "2024-12-18",
                    "excerpt": "Hướng dẫn chi tiết từ các nghệ nhân trà để có được ấm trà thơm ngon, chuẩn vị."
                },
                {
                    "id": "3",
                    "title": "Tác Dụng Của Trà Xanh Với Sức Khỏe",
                    "image": "/images/product-1.png",
                    "date": "2024-12-15",
                    "excerpt": "Khám phá những lợi ích tuyệt vời của trà xanh đối với sức khỏe và sắc đẹp."
                }
            ];
            await News.insertMany(initialNews);
        }
    } catch (e) {
        console.error("Seed data failed (DB might not be connected)", e);
    }
}

// Deprecated setters export for compatibility check, but we won't use them in updated API routes
export const saveNews = () => { };
export const saveOrders = () => { };
