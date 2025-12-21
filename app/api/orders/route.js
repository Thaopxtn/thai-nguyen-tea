import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { getOrders } from '@/lib/db';

export async function GET() {
    const orders = await getOrders();
    return NextResponse.json(orders);
}

export async function POST(request) {
    try {
        const conn = await dbConnect();
        if (!conn) {
            return NextResponse.json({ error: 'System is in Offline Mode' }, { status: 503 });
        }
        const data = await request.json();

        const newOrder = await Order.create({
            id: Date.now().toString(),
            ...data
        });

        return NextResponse.json({ success: true, order: newOrder });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
    }
}
