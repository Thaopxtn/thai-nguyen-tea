import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        console.log(`Updating order ${id}:`, body);

        await dbConnect();

        // Find order
        const order = await Order.findOne({ id: id });
        if (!order) {
            console.error(`Order ${id} not found`);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Check if we can cancel
        // If it's a cancellation request
        if (body.status === 'Đã hủy') {
            // Check if status allows cancelling. 
            // NOTE: If this request comes from ADMIN, we should probably allow it regardless.
            // But we don't have auth context here easily without checking cookie again (which is fine).
            // Let's check cookie.
            const adminAuth = request.cookies.get('admin_auth');
            const isAdmin = adminAuth?.value === 'true';

            if (!isAdmin && order.status !== 'Chờ xử lý' && order.status !== 'Đang xử lý') {
                // User can only cancel if pending. 
                return NextResponse.json({
                    error: 'Bạn chỉ có thể hủy đơn hàng khi đang chờ xử lý.'
                }, { status: 400 });
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
