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
import OptionChainPage from "./option-chain-master";

export const metadata = {
  title: "AI Summary",
  description: "Real-time AI analysis of market trend using multiple indicators",
};

export default function AISummaryNiftyPage() {
  return (
    <ContentLayout title="Market News">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Option Chain</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <OptionChainPage />
    </ContentLayout>
  );
}
