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
import StockAiSummaryPage from "./stock-ai-summary";

export const metadata = {
  title: "AI Summary",
  description: "Real-time AI analysis of market trend using multiple indicators",
};

export default function AISummaryStockPage() {
  return (
    <ContentLayout title="AI Summary Stocks">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage> <Link href="/ai-stocks">AI Summary</Link></BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <br/>
      <StockAiSummaryPage />
    </ContentLayout>
  );
}
