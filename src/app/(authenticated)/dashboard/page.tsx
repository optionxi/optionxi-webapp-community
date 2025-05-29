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
import TopStocksHeatMap from "./screeners-top-stocks";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ContentLayout title="Dashboard">
        <nav aria-label="breadcrumbs" className="mb-6">
          <Breadcrumb>
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
          </Breadcrumb>
        </nav> 
       
        <HeroSection/>
        {/* <WatchListCTA/> */}
        <ToggleTools/>
        <TopStocksHeatMap category="bullish" limit={10} />
        <br/>
        <TopStocksHeatMap category="bearish" limit={10} />
        {/* <AnalyticsToolsSection/> */}
        <br/>
        <br/>
        {/* <TradingHero/> */}
        <br/>
        {/* <ScrollCarousel/> */}
      </ContentLayout>
    </div>
  )
}