import Link from "next/link"
import { ContentLayout } from "@/components/admin-panel/content-layout"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import StockAlertsSection from './alert-stock-section'

export default function StockAlertsPage({ params }: PageProps) {
  const symbol = params?.symbol as string || ""

  return (
    <ContentLayout title="Stock Alerts">
        <Breadcrumb>
          <BreadcrumbList className="text-sm">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/alerts">Alerts</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{symbol || "No Symbol"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <br/>
        <StockAlertsSection symbol={symbol} />
    </ContentLayout>
  )
}

// Define the proper type for page props
type PageProps = {
  params: {
    symbol: string
  }
}

// Metadata function to dynamically generate metadata
export async function generateMetadata({ params }: PageProps) {
  // const stock = await getStockData(params.symbol);
  // 
  // if (!stock) {
  //   return {
  //     title: 'Stock Not Found',
  //     description: 'The requested stock information could not be found.',
  //   };
  // }

  const decodedSymbol = decodeURIComponent(params.symbol);
  
  return {
    title: `${decodedSymbol} Alerts - OptionXi`,
    description: `Bullish and bearish alerts for ${decodedSymbol}`,
    openGraph: {
      title: `${decodedSymbol} Analysis - OptionXi`,
      description: `Bullish and bearish alerts for ${decodedSymbol}`,
      url: `https://app.optionxi.com/alerts/${params.symbol}`,
      images: [
        {
          url: '/metadata/opengraph-image.jpg',
          width: 1200,
          height: 630,
          alt: `${decodedSymbol} Alerts Open Graph Image`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${decodedSymbol} Alerts - OptionXi`,
      description: `Alerts for ${decodedSymbol} including assets, debt, and equity data.`,
      images: [
        {
          url: '/metadata/twitter-image.jpg',
          width: 1200,
          height: 628,
          alt: `${decodedSymbol} Alerts Twitter Card Image`,
        },
      ],
    },
  };
}