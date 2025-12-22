import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        await dbConnect();

        // Find order
        const order = await Order.findOne({ id: id });
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Check if we can cancel
        // Only allow cancelling if status is 'Chờ xử lý' (Pending) or maybe 'Đang xử lý' but traditionally only pending.
        // If status is 'Đã giao' or 'Đang giao', cannot cancel.
        if (body.status === 'Đã hủy') {
            if (order.status !== 'Chờ xử lý') {
                return NextResponse.json({
                    error: 'Không thể hủy đơn hàng đã được xử lý hoặc đang giao.'
                }, { status: 400 });
            }
        }

        order.status = body.status;
        await order.save();

        return NextResponse.json({ success: true, order });
    } catch (e) {
        console.error("Error updating order:", e);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
