import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    const uri = process.env.MONGODB_URI;

    const status = {
        envVarPresent: !!uri,
        envVarLength: uri ? uri.length : 0,
        connectionStatus: 'Not attempted',
        error: null
    };

    if (!uri) {
        status.error = 'MONGODB_URI is missing';
        return NextResponse.json(status, { status: 500 });
    }

    try {
        status.connectionStatus = 'Attempting connection...';
        await mongoose.connect(uri, { bufferCommands: false });
        status.connectionStatus = 'Connected successfully';
        return NextResponse.json(status);
    } catch (e) {
        status.connectionStatus = 'Failed';
        status.error = e.message;
        return NextResponse.json(status, { status: 500 });
    }
}
