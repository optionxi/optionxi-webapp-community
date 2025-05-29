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
import StockDashboard from "./stock-dashboard";
import { StockExternalLinks } from "./stock-external-links";
import AISummary from "../../my-watchlist/ai-summary";
import StockFinancials from "@/components/db_component/cust_financials";
import StockAlertsSectionSub from "./alert-stock-section-sub";
import ScannerStocks from "./screeners-stock";
import { Separator } from "@/components/ui/separator";
import StickyHeader from "./stock-header";

type Props = {
  params: {
    stockname: string;
  };
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
  const stock = await getStockData(params.stockname.toUpperCase());

  if (!stock) {
    return {
      title: 'Stock Not Found',
      description: 'The requested stock information could not be found.',
    };
  }

  const decodedStockName = decodeURIComponent(params.stockname.toUpperCase());
  return {
    title: `${decodedStockName} Analysis - OptionXi`,
    description: `Detailed analysis, charts, alerts and external links dashboard for ${decodedStockName}.`,
    openGraph: {
      title: `${decodedStockName} Analysis - OptionXi`,
      description: `Detailed analysis, charts, alerts and external links dashboard for ${decodedStockName}.`,
      url: `https://app.optionxi.com/stocks/${params.stockname.toUpperCase()}`,
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
  const stock = await getStockData(params.stockname.toUpperCase());
  // const data = await fetchStockDataFinancialTables(decodeURIComponent(params.stockname.toUpperCase()))
  
  if (!stock) {
    notFound();
  }

  const decodedStockName = decodeURIComponent(params.stockname.toUpperCase());

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
            <BreadcrumbPage>{decodedStockName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <br/>
      <StickyHeader stockName={decodedStockName}/>
      <br/>
      <StockDashboard stockName={decodedStockName} />
      <br/>
      <StockAlertsSectionSub symbol={decodedStockName}/>
      <br/>
      <StockFinancials stockname={decodedStockName} />
      <br />
      {/* {data ? (
        <StockDataTablesNoHeader
          assets={data.assets}
          debt={data.debt}
          equity={data.equity}
          stockname={decodedStockName}
        />
      ) : (
        <div className="container mx-auto py-8">
          <h2>No financial data available for {decodedStockName}</h2>
          <Link href="/">Go back to home</Link>
        </div>
      )} */}
      <ScannerStocks stockname={decodedStockName}/>
      <br/>
      <Separator />
      <br />
      <AISummary />
      <br />
      <StockExternalLinks stockName={decodedStockName} />
    </ContentLayout>
  );
}
