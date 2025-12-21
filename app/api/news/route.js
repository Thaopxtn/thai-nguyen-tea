import { NextResponse } from 'next/server';
export const runtime = 'edge';
import dbConnect from '@/lib/mongodb';
import News from '@/models/News';
import { getNews } from '@/lib/db';

export async function GET() {
    const news = await getNews();
    return NextResponse.json(news);
}

export async function POST(request) {
    try {
        await dbConnect();
        const data = await request.json();

        const newArticle = await News.create({
            id: Date.now().toString(),
            ...data
        });

        return NextResponse.json({ success: true, article: newArticle });
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await dbConnect();
        const data = await request.json();

        await News.findOneAndUpdate({ id: data.id }, data);

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await News.deleteOne({ id });

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
