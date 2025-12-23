"use client";

import Link from 'next/link';

export default function ProductDetailClient({ product, related }) {
    // DEBUG MODE: Return raw data to verify the crash isn't in the JSX structure
    return (
        <main className="container py-10">
            <h1>Debug View</h1>
            <p>If you see this, the data is good, and the error was in the previous design.</p>
            <pre className="bg-gray-100 p-4 rounded overflow-auto border">
                {JSON.stringify(product, null, 2)}
            </pre>
            <div className="mt-4">
                <Link href="/" className="text-blue-500 underline">Back to Home</Link>
            </div>
        </main>
    );
}
