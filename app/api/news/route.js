import { NextResponse } from 'next/server';
import { getNews, saveNews } from '@/lib/db';

export async function GET() {
    return NextResponse.json(getNews());
}

export async function POST(request) {
    try {
        const article = await request.json();
        const news = getNews();

        const newArticle = {
            id: Date.now(),
            ...article
        };

        news.unshift(newArticle);
        saveNews(news);

        return NextResponse.json({ success: true, article: newArticle });
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const article = await request.json();
        const news = getNews();
        const index = news.findIndex(a => a.id == article.id);

        if (index > -1) {
            news[index] = { ...news[index], ...article };
            saveNews(news);
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        let news = getNews();
        news = news.filter(a => a.id != id);
        saveNews(news);

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
