import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

const FILES = {
    products: path.join(DATA_DIR, 'products.json'),
    news: path.join(DATA_DIR, 'news.json'),
    orders: path.join(DATA_DIR, 'orders.json'),
};

// --- Helpers ---
function readJSON(type) {
    try {
        if (!fs.existsSync(FILES[type])) return [];
        const data = fs.readFileSync(FILES[type], 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

function writeJSON(type, data) {
    fs.writeFileSync(FILES[type], JSON.stringify(data, null, 2));
}

// --- API ---

// Products
export const getProducts = () => readJSON('products');
export const saveProducts = (products) => writeJSON('products', products);

// News
export const getNews = () => readJSON('news');
export const saveNews = (news) => writeJSON('news', news);

// Orders
export const getOrders = () => readJSON('orders');
export const saveOrders = (orders) => writeJSON('orders', orders);

// --- Initialization (Seed Data) ---
export function seedData() {
    if (!fs.existsSync(FILES.products)) {
        const initialProducts = [
            {
                "id": 1,
                "name": "Trà Tân Cương Đặc Biệt",
                "price": 450000,
                "category": "Cao Cấp",
                "image": "/images/product-1.png",
                "desc": "Hương vị đậm đà, nước xanh, vị chát dịu hậu ngọt sâu."
            },
            {
                "id": 2,
                "name": "Trà Móc Câu Hảo Hạng",
                "price": 320000,
                "category": "Truyền Thống",
                "image": "/images/product-2.png",
                "desc": "Cánh trà xoăn nhỏ, hương cốm non nồng nàn."
            },
            {
                "id": 3,
                "name": "Trà Nõn Tôm Vương Giả",
                "price": 850000,
                "category": "Thượng Hạng",
                "image": "/images/product-1.png",
                "desc": "Tuyệt phẩm trà Việt. Chỉ lấy 1 tôm 1 lá non nhất."
            },
            {
                "id": 4,
                "name": "Trà Shan Tuyết Cổ Thụ",
                "price": 550000,
                "category": "Cao Cấp",
                "image": "/images/product-2.png",
                "desc": "Thu hái từ những cây chè cổ thụ trên núi cao, hương vị tinh khiết."
            },
            {
                "id": 5,
                "name": "Trà Lài Tự Nhiên",
                "price": 280000,
                "category": "Hương Hoa",
                "image": "/images/product-1.png",
                "desc": "Ướp hương hoa lài tự nhiên, thơm ngát, dễ uống."
            },
            {
                "id": 6,
                "name": "Trà Sen Tây Hồ",
                "price": 1200000,
                "category": "Thượng Hạng",
                "image": "/images/product-2.png",
                "desc": "Tinh hoa trà Việt. Ướp trong bông sen bách diệp hồ Tây."
            }
        ];
        saveProducts(initialProducts);
    }

    if (!fs.existsSync(FILES.news)) {
        const initialNews = [
            {
                "id": 1,
                "title": "Lễ Hội Trà Thái Nguyên 2024",
                "image": "/images/hero-bg.png",
                "date": "2024-12-20",
                "excerpt": "Hòa mình vào không khí lễ hội đặc sắc với các hoạt động văn hóa trà truyền thống."
            },
            {
                "id": 2,
                "title": "Cách Pha Trà Ngon Đúng Điệu",
                "image": "/images/product-2.png",
                "date": "2024-12-18",
                "excerpt": "Hướng dẫn chi tiết từ các nghệ nhân trà để có được ấm trà thơm ngon, chuẩn vị."
            },
            {
                "id": 3,
                "title": "Tác Dụng Của Trà Xanh Với Sức Khỏe",
                "image": "/images/product-1.png",
                "date": "2024-12-15",
                "excerpt": "Khám phá những lợi ích tuyệt vời của trà xanh đối với sức khỏe và sắc đẹp."
            }
        ];
        saveNews(initialNews);
    }
}
