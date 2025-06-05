import Link from "next/link";
import { notFound } from 'next/navigation';
import { totalstocks } from '@/datamodels/constants';
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import StockDashboard from "../../stocks/[stockname]/stock-dashboard";
import { StockExternalLinks } from "../../stocks/[stockname]/stock-external-links";


type Props = {
  params: Promise<{
    stockname: string;
  }>;
};

async function getStockData(stockname: string) {
  const decodedStockname = decodeURIComponent(stockname);
  const formattedStockName = `${decodedStockname}`.toUpperCase();

  const stockData = Object.values(totalstocks).find(
    stock => stock.stock_name.toUpperCase().split(":")[1].split("-")[0] === formattedStockName
  );

  if (!stockData) {
    return null;
  }

  return stockData;
}

// Metadata function to dynamically generate metadata
export async function generateMetadata({ params }: Props) {
  const { stockname } = await params;
  const stock = await getStockData(stockname);

  if (!stock) {
    return {
      title: 'Stock Not Found',
      description: 'The requested stock information could not be found.',
    };
  }

  const decodedStockName = decodeURIComponent(stockname);
  return {
    title: `${decodedStockName} Analysis - OptionXi`,
    description: `Detailed analysis, charts, alerts and external links dashboard for ${decodedStockName}.`,
    openGraph: {
      title: `${decodedStockName} Analysis - OptionXi`,
      description: `Detailed analysis, charts, alerts and external links dashboard for ${decodedStockName}.`,
      url: `https://app.optionxi.com/stocks/${stockname}`,
      images: [
        {
          url: '/metadata/opengraph-image.jpg',
          width: 1200,
          height: 630,
          alt: `${decodedStockName} Analysis Open Graph Image`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${decodedStockName} Analysis - OptionXi`,
      description: `Explore detailed information and analysis for ${decodedStockName}.`,
      images: [
        {
          url: '/metadata/twitter-image.jpg',
          width: 1200,
          height: 628,
          alt: `${decodedStockName} Analysis Twitter Card Image`,
        },
      ],
    },
  };
}

export default async function StockDetailPage({ params }: Props) {
  const { stockname } = await params;
  const stock = await getStockData(stockname);

  if (!stock) {
    notFound();
  }

  const decodedStockName = decodeURIComponent(stockname);

  return (
    <ContentLayout title="Stock Analysis">
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
              <Link href="/my-watchlist">My Watchlist</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{decodedStockName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <br/>
      <StockDashboard stockName={decodedStockName} />
      <br/>
      <StockExternalLinks stockName={decodedStockName} />
    </ContentLayout>
  );
}
