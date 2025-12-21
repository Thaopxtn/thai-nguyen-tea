import { NextResponse } from 'next/server';

export function middleware(request) {
    const path = request.nextUrl.pathname;

    if (path.startsWith('/admin')) {
        // Skip login page
        if (path === '/admin/login') {
            // If already logged in, redirect to dashboard
            const auth = request.cookies.get('admin_auth');
            if (auth?.value === 'true') {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
            return NextResponse.next();
        }

        // Check auth for other admin pages
        const auth = request.cookies.get('admin_auth');
        if (auth?.value !== 'true') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
