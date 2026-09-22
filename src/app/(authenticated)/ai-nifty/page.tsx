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
import NiftyAiSummaryPage from "./nifty-ai-page";

export const metadata = {
  title: "AI Summary Nifty",
  description: "Real-time AI analysis of market trend using multiple indicators",
};

export default function AISummaryNiftyPage() {
  return (
    <ContentLayout title="AI Summary Nifty">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>AI Summary Nifty</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <br/>
      <NiftyAiSummaryPage />
    </ContentLayout>
  );
}
