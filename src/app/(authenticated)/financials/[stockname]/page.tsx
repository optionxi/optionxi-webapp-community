// src/app/(authenticated)/financials/[stockname]/page.tsx
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { StockDataTables } from '@/components/db_component/cust_financial_table'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { fetchStockDataFinancialTables } from '@/lib/supabaseDB/supabase_financial_tables'
import Link from 'next/link'

interface PageProps {
  params: Promise<{
    symbol: string;
  }>;
}
export default async function StockFinancialPage({ params }: PageProps) {
    const { symbol } = await params;
    const stockname = decodeURIComponent(symbol)
    const data = await fetchStockDataFinancialTables(stockname)
  
    if (!data) {
      return (
        <ContentLayout title="Financial Data Not Found">
          <div className="container mx-auto py-8">
            <h2>No financial data available for {stockname}</h2>
            <Link href="/">Go back to home</Link>
          </div>
        </ContentLayout>
      )
    }
  
    return (
      <ContentLayout title={`Financials for ${stockname}`}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/stocks/${stockname}`}>{stockname}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/financials/${stockname}`}>Financials </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <br />
          <StockDataTables
            assets={data.assets}
            debt={data.debt}
            equity={data.equity}
            stockname={stockname}
          />
      </ContentLayout>
    )
  }
  

// Metadata function to dynamically generate metadata
export async function generateMetadata({ params }: PageProps) {
  // const stock = await getStockData(params.stockname);

  // if (!stock) {
  //   return {
  //     title: 'Stock Not Found',
  //     description: 'The requested stock information could not be found.',
  //   };
  // }
  const { symbol } = await params;

  const decodedStockName = decodeURIComponent(symbol);
  
  return {
    title: `${decodedStockName} Financials - OptionXi`,
    description: `Financial information for ${symbol} including assets, debt, and equity data.`,
    openGraph: {
      title: `${decodedStockName} Analysis - OptionXi`,
      description: `Financial information for ${symbol} including assets, debt, and equity data.`,
      url: `https://app.optionxi.com/financials/${symbol}`,
      images: [
        {
          url: '/metadata/opengraph-image.jpg',
          width: 1200,
          height: 630,
          alt: `${decodedStockName} Financials Open Graph Image`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${decodedStockName} Financials - OptionXi`,
      description: `Financial information for ${symbol} including assets, debt, and equity data.`,
      images: [
        {
          url: '/metadata/twitter-image.jpg',
          width: 1200,
          height: 628,
          alt: `${decodedStockName} Financials Twitter Card Image`,
        },
      ],
    },
  };
}
