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
import AIPickedIndex from "./ai-index-breakouts";

export const metadata = {
  title: "AI Picked Index Breakouts",
  description: "Real-time AI analysis of market trend using multiple indicators",
};

export default function AIPickedIndexPage() {
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
            <BreadcrumbPage>AI Picked Index</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <br/>
      <AIPickedIndex />
    </ContentLayout>
  );
}
