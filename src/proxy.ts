import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    const { pathname } = new URL(request.url);

    // Real IP, when available (present in prod behind Vercel/proxy; often absent in local dev)
    const ip = request.headers.get('x-real-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();

    let response = NextResponse.next();

    // Add CSP headers
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.gstatic.com https://*.firebaseio.com https://*.tawk.to https://va.vercel-scripts.com https://*.googletagmanager.com https://cdn.jsdelivr.net https://apis.google.com https://www.google-analytics.com;
        script-src-elem 'self' 'unsafe-inline' https://*.googleapis.com https://*.gstatic.com https://*.firebaseio.com https://*.tawk.to https://va.vercel-scripts.com https://*.googletagmanager.com https://cdn.jsdelivr.net https://apis.google.com https://s3.tradingview.com https://vercel.live https://us-assets.i.posthog.com https://www.google-analytics.com https://chat.optionxi.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.tawk.to https://us.posthog.com;
        img-src 'self' data: https://*.googleusercontent.com https://*.googleapis.com https://*.tawk.to https://cdn.jsdelivr.net https://images.unsplash.com;
        font-src 'self' https://fonts.gstatic.com https://*.tawk.to;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com wss://*.optionxi.com https://*.tawk.to wss://*.tawk.to https://www.google-analytics.com https://*.optionxi.com https://us.i.posthog.com https://internal-t.posthog.com https://us.posthog.com/api/ https://us-assets.i.posthog.com;
        media-src 'self' https://*.tawk.to;
        worker-src 'self' blob:;
        child-src 'self' blob:;
        frame-src 'self' https://*.tawk.to https://www.tradingview-widget.com https://optionxi.firebaseapp.com https://vercel.live https://chat.optionxi.com;
        manifest-src 'self';
        block-all-mixed-content;
        upgrade-insecure-requests;
    `;

    response.headers.set(
        'Content-Security-Policy',
        cspHeader.replace(/\s{2,}/g, ' ').trim()
    );

    // Arcjet (or any IP-dependent check) only runs when a real IP is available.
    // This does NOT block routing/redirect logic below — it only guards Arcjet-specific work.
    if (ip) {
        // e.g. await arcjet.protect(request, { ip });
    }

    // Root redirect — always runs, regardless of IP availability
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;
}

export const config = {
    matcher: [
        '/ai-assistant',
        '/algo',
        '/alerts',
        '/alerts/:path*',
        '/atlas',
        '/bollinger-breakouts',
        '/broker/:path*',
        '/dashboard',
        '/financials',
        '/heatmap',
        '/long-buildup',
        '/my-watchlist',
        '/nifty-50',
        '/nifty-200',
        '/oi-changers',
        '/scanners',
        '/settings',
        '/short-buildup',
        '/stocks/:path*',
        '/top-gainers',
        '/top-losers',
        '/top-volume',
        '/login',
        '/',
        '/protected/:path*',
    ],
};