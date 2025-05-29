// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // disallow: '/private/', // uncomment if needed
    },
    sitemap: 'https://app.optionxi.com/sitemap.xml',
  }
}