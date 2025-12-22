import { NextResponse } from 'next/server';
import { seedData } from '@/lib/db';

export async function GET() {
    try {
        await seedData();
        return NextResponse.json({ success: true, message: "Data seeded successfully" });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
