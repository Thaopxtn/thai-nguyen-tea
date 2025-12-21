import { NextResponse } from 'next/server';
import { getProducts, saveProducts } from '@/lib/db';

export async function GET() {
    return NextResponse.json(getProducts());
}

export async function POST(request) {
    try {
        const product = await request.json();
        const products = getProducts();

        const newProduct = {
            id: Date.now(),
            ...product
        };

        products.push(newProduct);
        saveProducts(products);

        return NextResponse.json({ success: true, product: newProduct });
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const product = await request.json();
        const products = getProducts();
        const index = products.findIndex(p => p.id == product.id);

        if (index > -1) {
            products[index] = { ...products[index], ...product };
            saveProducts(products);
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

        let products = getProducts();
        products = products.filter(p => p.id != id);
        saveProducts(products);

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
