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
import AIPickedStocks from "./ai-stock-breakouts";

export const metadata = {
  title: "AI picked stocks",
  description: "Real-time AI analysis of market trend using multiple indicators",
};

export default function AIPickedStocksPage() {
  return (
    <ContentLayout title="AI Picked Stocks">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>AI Picked Stocks</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <br/>
      <AIPickedStocks />
    </ContentLayout>
  );
}
