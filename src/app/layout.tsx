// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { getServerSession } from 'next-auth';
import { NxtauthOptions } from '../../pages/api/auth/[...nextauth]';
import SessionProviderFn from '@/utils/SessionProvider';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { type PropsWithChildren } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { CSPostHogProvider } from './providers/providers';
import PostHogPageView from './providers/posthog-pageview';
import { GoogleAnalytics } from '@next/third-parties/google'



  export const metadata: Metadata = {
    metadataBase: new URL('https://app.optionxi.com'),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    title: 'OptionXi Future of Trading',
    description: 'OptionXi is the future of virtual trading, with live scanners and price alerts, also integration live algo trading with past portfolio',
    icons: {
      icon: '/favicon.ico',
      apple: [
        '/metadata/apple-touch-icon-57x57.png',
        '/metadata/apple-touch-icon-72x72.png',
        '/metadata/apple-touch-icon-76x76.png',
        '/metadata/apple-touch-icon-114x114.png',
        '/metadata/apple-touch-icon-120x120.png',
        '/metadata/apple-touch-icon-144x144.png',
        '/metadata/apple-touch-icon-152x152.png',
        '/metadata/apple-touch-icon-180x180.png',
      ],
    },
    openGraph: {
      type: 'website',
      url: 'https://app.optionxi.com',
      siteName: 'OptionXi',
      title: 'OptionXi',
      description: 'The future of virtual trading, screeners, alerts, heatmaps, AI stock summary',
      images: [
        {
          url: '/metadata/opengraph-image.jpg',
          width: 1200,
          height: 630,
          alt: 'OptionXi Open Graph Image',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: 'https://app.optionxi.com',
      title: 'OptionXi',
      creator: 'Jibin Victor John',
      description: 'The future of virtual trading, with live screeners and price alerts',
      images: [
        {
          url: '/metadata/twitter-image.jpg',
          width: 1200,
          height: 628,
          alt: 'OptionXi Twitter Card Image',
        },
      ],
    }
  };



export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await getServerSession(NxtauthOptions);
  
  return (
    <html lang="en" suppressHydrationWarning>
      <CSPostHogProvider>
      {/* <head>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          async
          defer
          strategy="afterInteractive"
        />
      </head> */}
      <body className="relative min-h-screen">
        <PostHogPageView />
        <Toaster />
        <div className="relative z-10">
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <SessionProviderFn session={session}>
              {children}
            </SessionProviderFn>
          </ThemeProvider>
        </div>
        <SpeedInsights />
        <Analytics />
      </body>
      </CSPostHogProvider>
      <GoogleAnalytics gaId="G-P38HH1LLMJ" />
    </html>
  );
}