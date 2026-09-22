// app/market-news/page.tsx
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import StockDashboard from "./stock-performance";
import { Suspense } from "react";

export const metadata = {
  title: "Stock Performance",
  description: "Monthyl weekly performance of stock",
};

export default function AIPickedIndexPage() {
  return (
    <ContentLayout title="Stock Perfromance">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Stock Performance</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Suspense fallback={null}>
         <StockDashboard />
      </Suspense>
    </ContentLayout>
  );
}
