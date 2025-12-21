import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'orders.json');

// Ensure data dir exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'));
}

export async function GET() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return NextResponse.json([]);
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (e) {
        return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const order = await request.json();

        let orders = [];
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            orders = JSON.parse(data);
        }

        // Add ID and Timestamp
        const newOrder = {
            id: Date.now().toString(), // Simple ID
            createdAt: new Date().toISOString(),
            ...order
        };

        orders.unshift(newOrder); // Newest first

        fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2));

        return NextResponse.json({ success: true, order: newOrder });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
    }
}
