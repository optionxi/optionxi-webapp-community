import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        "CATEGORY:MONITOR", // Uptime monitoring services
        "CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
    ],
      
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 60,    // 30 tokens per interval
      interval: 3,      // 3 Seconds
      capacity: 100,     // 100 tokens max
    }),
  ],
});

export async function middleware(request: NextRequest) {
    // First, check Arcjet protection
    const arcjetDecision = await aj.protect(request, { requested: 5 });
    
    if (arcjetDecision.isDenied()) {
        if (arcjetDecision.reason.isRateLimit()) {
            return NextResponse.json(
                { error: "Too Many Requests", reason: arcjetDecision.reason },
                { status: 429 },
            );
        } else if (arcjetDecision.reason.isBot()) {
            return NextResponse.json(
                { error: "No bots allowed", reason: arcjetDecision.reason },
                { status: 403 },
            );
        } else {
            return NextResponse.json(
                { error: "Forbidden", reason: arcjetDecision.reason },
                { status: 403 },
            );
        }
    }

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = new URL(request.url);

    // Create a new response
    let response = NextResponse.next();
    

    // Add CSP headers
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.gstatic.com https://*.firebaseio.com https://*.tawk.to https://va.vercel-scripts.com https://*.googletagmanager.com https://cdn.jsdelivr.net https://apis.google.com https://www.google-analytics.com;
        script-src-elem 'self' 'unsafe-inline' https://*.googleapis.com https://*.gstatic.com https://*.firebaseio.com https://*.tawk.to https://va.vercel-scripts.com https://*.googletagmanager.com https://cdn.jsdelivr.net https://apis.google.com https://s3.tradingview.com https://vercel.live https://us-assets.i.posthog.com https://www.google-analytics.com https://chat.optionxi.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.tawk.to https://us.posthog.com;
        img-src 'self' data: https://*.googleusercontent.com https://*.googleapis.com https://*.tawk.to https://cdn.jsdelivr.net;
        font-src 'self' https://fonts.gstatic.com https://*.tawk.to;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com wss://supabase.optionxi.com https://*.tawk.to wss://*.tawk.to https://www.google-analytics.com https://supabase.optionxi.com https://us.i.posthog.com https://internal-t.posthog.com https://us.posthog.com/api/;
        media-src 'self' https://*.tawk.to;
        worker-src 'self' blob:;
        child-src 'self' blob:;
        frame-src 'self' https://*.tawk.to https://www.tradingview-widget.com https://optionxi.firebaseapp.com https://vercel.live https://chat.optionxi.com;
        manifest-src 'self';
        block-all-mixed-content;
        upgrade-insecure-requests;
    `;
    
    if (cspHeader && typeof cspHeader === 'string') {
    response.headers.set(
        'Content-Security-Policy',
        cspHeader.replace(/\s{2,}/g, ' ').trim()
    );
    } else {
    console.warn("CSP header is missing or not a string.");
    }

    // if (!token) {
    //     // Redirect to /login if unauthenticated and trying to access /dashboard
    //     if (pathname === '/dashboard' || pathname === '/' ||pathname === '/heatmap') {
    //         return NextResponse.redirect(new URL('/login', request.url));
    //     }

    //     // Redirect to /login for any other protected paths
    //     if (pathname.startsWith('/my-watchlist')) {
    //         return NextResponse.redirect(new URL('/login', request.url));
    //     }
    // } else {
    //     // Redirect authenticated users to /dashboard if accessing / or /login
    //     if (pathname === '/' || pathname === '/login') {
    //         return NextResponse.redirect(new URL('/dashboard', request.url));
    //     }
    // }

    // Handle 404 for invalid paths
    // if (!['/dashboard', '/login', '/', '/my-watchlist', '/heatmap'].includes(pathname) && !/^\/stocks\/[a-zA-Z0-9&-]+$/.test(pathname)) {
    //     return NextResponse.redirect(new URL('/404', request.url));
    // }

    if (pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;
}

export const config = {
    matcher: [
        '/ai-assistant',
        '/alerts',
        '/atlas',
        '/bollinger-breakouts',
        '/dashboard',
        '/financials',
        '/heatmap',
        '/long-buildup',
        '/my-watchlist',
        '/nifty-50',
        '/nifty-200',
        '/oi-changers',
        '/profile',
        '/scanners',
        '/settings',
        '/short-buildup',
        '/stocks/:path*', 
        '/top-gainers',
        '/top-losers',
        '/top-volume', 
        '/login',
        '/heatmap', 
        '/', 
        '/protected/:path*'],
};