import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import StockAlertsSection from './alert-stock-section';

interface PageProps {
  params: Promise<{
    symbol: string;
  }>;
}


export default async function StockAlertsPage({ params }: PageProps) {
  const { symbol } = await params;
  const displaySymbol = decodeURIComponent(symbol);

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
            <BreadcrumbPage>{displaySymbol || "No Symbol"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <br/>
      <StockAlertsSection symbol={symbol} />
    </ContentLayout>
  );
}

interface GenerateMetadataProps {
  params: Promise<{
    symbol: string;
  }>;
}
export async function generateMetadata({ params }: GenerateMetadataProps) {
  const { symbol } = await params;
  const displaySymbol = decodeURIComponent(symbol);

  return {
    title: `${displaySymbol} Alerts - OptionXi`,
    description: `Bullish and bearish alerts for ${displaySymbol}`,
    openGraph: {
      title: `${displaySymbol} Analysis - OptionXi`,
      description: `Bullish and bearish alerts for ${displaySymbol}`,
      url: `https://app.optionxi.com/alerts/${symbol}`,
      images: [{
        url: '/metadata/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: `${displaySymbol} Alerts Open Graph Image`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displaySymbol} Alerts - OptionXi`,
      description: `Alerts for ${displaySymbol} including assets, debt, and equity data.`,
      images: [{
        url: '/metadata/twitter-image.jpg',
        width: 1200,
        height: 628,
        alt: `${displaySymbol} Alerts Twitter Card Image`,
      }],
    },
  };
}