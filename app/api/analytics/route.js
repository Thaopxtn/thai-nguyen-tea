import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import VisitorLog from '@/models/VisitorLog';

export async function POST(request) {
    try {
        const body = await request.json();
        await dbConnect();

        // Get IP from headers if possible (Vercel/Next.js specific)
        const ip = request.headers.get('x-forwarded-for') || 'unknown';

        await VisitorLog.create({
            ip: ip.split(',')[0], // Take first IP if multiple
            city: body.city || 'Unknown',
            country: body.country || 'Unknown',
            device: body.device || 'Desktop',
            path: body.path || '/'
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to log' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        // Aggregate stats
        // 1. Total visits today
        // 2. Total all time
        // 3. Last 7 days chart data

        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));

        const totalVisits = await VisitorLog.countDocuments();
        const todayVisits = await VisitorLog.countDocuments({ createdAt: { $gte: startOfDay } });

        // Simple aggregation for recent logs
        const recentLogs = await VisitorLog.find().sort({ createdAt: -1 }).limit(20);

        return NextResponse.json({
            totalVisits,
            todayVisits,
            recentLogs
        });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
