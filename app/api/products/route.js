import { NextResponse } from 'next/server';
export const runtime = 'edge';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { getProducts } from '@/lib/db';

export async function GET() {
    // We already have getProducts in lib/db doing serialization
    const products = await getProducts();
    return NextResponse.json(products);
}

export async function POST(request) {
    try {
        await dbConnect();
        const data = await request.json();

        const newProduct = await Product.create({
            id: Date.now().toString(),
            ...data
        });

        return NextResponse.json({ success: true, product: newProduct });
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await dbConnect();
        const data = await request.json();

        await Product.findOneAndUpdate({ id: data.id }, data);

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

        await Product.deleteOne({ id });

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
