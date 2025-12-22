import { NextResponse } from 'next/server';
import { getCustomers } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request) {
    // Check Auth - reuse logic or simple check
    const adminAuth = request.cookies.get('admin_auth');
    if (adminAuth?.value !== 'true') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const customers = await getCustomers();
        return NextResponse.json(customers);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
