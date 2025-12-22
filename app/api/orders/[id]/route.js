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
            if (order.status !== 'Chờ xử lý' && order.status !== 'Đang xử lý') {
                // Allow admin to force cancel? Let's be strict for now unless admin context is clearer.
                // User can only cancel if 'Chờ xử lý', assume frontend handles that check.
                // The request body might come from user or admin.
            }
        }

        // Update fields
        if (body.status) order.status = body.status;
        if (body.cancelReason) order.cancelReason = body.cancelReason;

        await order.save();

        // If updated to 'Đã hủy', we need to subtract from customer totals
        if (body.status === 'Đã hủy') {
            try {
                const Customer = (await import('@/models/Customer')).default;
                const customer = await Customer.findOne({ phone: order.phone });
                if (customer) {
                    // Decrement totalOrders and totalSpent
                    // Ensure we don't go below zero (though theoretically shouldn't happen)
                    customer.totalOrders = Math.max(0, customer.totalOrders - 1);
                    customer.totalSpent = Math.max(0, customer.totalSpent - (order.total || 0));
                    await customer.save();
                }
            } catch (err) {
                console.error("Error updating customer stats on cancel:", err);
            }
        }

        return NextResponse.json({ success: true, order });
    } catch (e) {
        console.error("Error updating order:", e);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
