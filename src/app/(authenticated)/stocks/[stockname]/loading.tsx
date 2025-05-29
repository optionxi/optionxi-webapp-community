'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import HeaderSkeleton from "./stock-header-skelton";

export default function Loading() {
  // Decode the stock name from URL parameters
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
            <BreadcrumbPage>loading.</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <br/>
      
      {/* StickyHeader Skeleton */}
      <HeaderSkeleton/>
      
      <br/>
      
      {/* StockDashboard Skeleton */}
      <div className="max-w-7xl mx-auto space-y-6 bg-background">
        {/* Stock Summary Section Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-4">
                <Skeleton className="h-6 w-[120px]" />
              </CardHeader>
              <CardContent className="p-4">
                <Skeleton className="h-8 w-[140px] mb-2" />
                <Skeleton className="h-4 w-[100px]" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart Section Skeleton for Desktop */}
        <Card className="hidden md:block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg">
          <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-6">
            <Skeleton className="h-7 w-[150px]" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-96 w-full flex flex-col justify-between">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          </CardContent>
        </Card>

        {/* Chart Section Skeleton for Mobile */}
        <div className="block md:hidden">
          <Card className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg">
            <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4">
              <Skeleton className="h-6 w-[120px]" />
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-72 w-full">
                <Skeleton className="h-full w-full rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <br/>
    </ContentLayout>
  );
}