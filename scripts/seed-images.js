
const { MongoClient } = require('mongodb');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

const MOCK_PRODUCTS = [
    {
        "id": "1",
        "name": "Trà Tân Cương Đặc Biệt",
        "price": 450000,
        "originalPrice": 800000,
        "category": "Cao Cấp",
        "image": "/images/tan-cuong-dac-biet.png",
        "images": [
            "/images/tan-cuong-dac-biet.png",
            "/images/moc-cau-hao-hang.png",
            "/images/non-tom-tea.png",
            "/images/shan-tuyet-tea.png"
        ],
        "desc": "Hương vị đậm đà, nước xanh, vị chát dịu hậu ngọt sâu. Được hái từ những búp chè tươi ngon nhất vùng Tân Cương.",
        "rating": 4.8,
        "numReviews": 124
    },
    {
        "id": "2",
        "name": "Trà Móc Câu Hảo Hạng",
        "price": 320000,
        "originalPrice": 550000,
        "category": "Truyền Thống",
        "image": "/images/moc-cau-hao-hang.png",
        "images": [
            "/images/moc-cau-hao-hang.png",
            "/images/tan-cuong-dac-biet.png",
            "/images/non-tom-tea.png",
            "/images/jasmine-tea.png",
            "/images/lotus-tea.png"
        ],
        "desc": "Cánh trà xoăn nhỏ, hương cốm non nồng nàn. Vị chát thanh, ngọt hậu kéo dài.",
        "rating": 4.5,
        "numReviews": 89
    },
    {
        "id": "3",
        "name": "Trà Nõn Tôm Vương Giả",
        "price": 850000,
        "originalPrice": 1500000,
        "category": "Thượng Hạng",
        "image": "/images/non-tom-tea.png",
        "images": [
            "/images/non-tom-tea.png",
            "/images/shan-tuyet-tea.png",
            "/images/product-1.png",
            "/images/product-2.png"
        ],
        "desc": "Tuyệt phẩm trà Việt. Chỉ lấy 1 tôm 1 lá non nhất. Hương thơm như cốm, vị ngọt thanh khiết.",
        "rating": 5.0,
        "numReviews": 45
    }
];

async function seed() {
    console.log('Connecting to MongoDB...');
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db();
        const productsCollection = db.collection('products');

        console.log('Seeding products...');
        for (const p of MOCK_PRODUCTS) {
            await productsCollection.updateOne(
                { id: p.id },
                { $set: p },
                { upsert: true }
            );
            console.log(`Updated product ${p.id}`);
        }
        console.log('Done seeding.');
    } catch (e) {
        console.error('Seeding error:', e);
    } finally {
        await client.close();
    }
}

seed();
