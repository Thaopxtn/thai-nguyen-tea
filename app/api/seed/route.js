import { NextResponse } from 'next/server';
import { seedData } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await seedData();
        return NextResponse.json({ success: true, message: "Database seeded successfully" });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
