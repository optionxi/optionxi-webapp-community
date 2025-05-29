// app/sitemap.ts
import { getAllStockSymbols, NIFTY200_STOCKS, NIFTY50_STOCKS } from '@/datamodels/constants'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://app.optionxi.com'
  const stockNames = await getAllStockSymbols()

  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/alerts`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/heatmap`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/long-buildup`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/my-watchlist`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/oi-changers`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/scanners`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/screeners`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/short-buildup`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/top-gainers`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/top-losers`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/volume-changers`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ]

  // Generate Nifty50 stock-specific routes
  const nifty50Routes = NIFTY50_STOCKS.map(stock => ({
    url: `${baseUrl}/nifty-50/${encodeURIComponent(stock.toUpperCase().split(":")[1].split("-")[0])}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  // Generate Nifty200 stock-specific routes
  const nifty200Routes = NIFTY200_STOCKS.map(stock => ({
    url: `${baseUrl}/nifty-200/${encodeURIComponent(stock.toUpperCase().split(":")[1].split("-")[0])}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  // Generate general stock-specific routes
  const stockRoutes = stockNames.map(stock => ({
    url: `${baseUrl}/stocks/${stock.toUpperCase()}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

   // Generate general stock-specific routes
   const stockfinancialRoutes = stockNames.map(stock => ({
    url: `${baseUrl}/financials/${stock.toUpperCase()}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  // Combine all routes together
  return [...routes, ...nifty50Routes, ...nifty200Routes, ...stockRoutes, ...stockfinancialRoutes]
}
