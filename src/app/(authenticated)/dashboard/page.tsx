'use client';

import Link from "next/link"
import { ContentLayout } from "@/components/admin-panel/content-layout"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import HeroSection from "./hero-section";
import ToggleTools from "./tools-section";
import IndicesGlance from "./cust_market_glance";
import MarketMovers from "./cust_market_movers";
import MarketInsightsGrid from "./cust_market_sentiments";
import TopStocksTabs from "./cust_market_trend_stocks";
import AnalyticsToolsSection from "./analytics-section";
import MarketNewsBanner from "./market-news-section";
import AiStockPicksCard from "./ai-stock-picked-section";
import MarketSentimentCard from "./ai-index-picked-section";
import StockPerformanceSectionHome from "./cust_stock_performance";
import PortfolioSection from "./web_portfolio/web_portfolio_optionxi";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ContentLayout title="Dashboard">
        <nav aria-label="breadcrumbs" className="mb-6">
          {/* <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  asChild
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>             
            </BreadcrumbList>
          </Breadcrumb> */}
        </nav> 
        {/* <IndicesGlance/> */}
        <br/>
       
        <HeroSection/>
        {/* <WatchListCTA/> */}
        {/* <ToggleTools/> */}
        {/* <MarketSentimentCard /> */}
        
        <br/>
         <TopStocksTabs limit={10} />
        <br/>
        {/* <AnalyticsToolsSection /> */}
         <StockPerformanceSectionHome />
        <br/>
       


        {/* Tools */}
        <br/>
        <MarketMovers/>
        {/* <MarketInsightsGrid/> */}
        <br/>
        <PortfolioSection/>

        {/* <TopStocksHeatMap category="bullish" limit={10} /> */}
        <br/>
        {/* <TopStocksHeatMap category="bearish" limit={10} /> */}
        {/* <AnalyticsToolsSection/> */}
        {/* <br/>
        <br/> */}
        {/* <TradingHero/> */}
        {/* <br/> */}
        {/* <ScrollCarousel/> */}
        {/* <MarketTrendsSection/> */}
         <MarketNewsBanner />
        
      </ContentLayout>
    </div>
  )
}