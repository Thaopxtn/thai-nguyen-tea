import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { getOrders } from '@/lib/db';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const adminAuth = request.cookies.get('admin_auth');

    await dbConnect();

    // 1. If Admin, return all
    if (adminAuth?.value === 'true') {
        const orders = await getOrders();
        return NextResponse.json(orders);
    }

    // 2. If phone provided, return filtered
    if (phone) {
        // Use loose matching or string cleaning if needed, but exact match is safer for privacy
        // Ideally we should verify this phone belongs to the user, but we're relying on them knowing it.
        const orders = await Order.find({ phone: phone }).sort({ createdAt: -1 });
        return NextResponse.json(orders);
    }

    // 3. Otherwise return empty (Public access denied without filter)
    return NextResponse.json([]);
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
