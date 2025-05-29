'use client';

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TopGainersSection from "./topgainers-section";

export default function TopGainersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFromURL = searchParams?.get("category") || "ALL";
  const [selectedCategory, setSelectedCategory] = useState(categoryFromURL);

  // Sync state with URL when `searchParams` changes
  useEffect(() => {
    if (categoryFromURL !== selectedCategory) {
      setSelectedCategory(categoryFromURL);
    }
  }, [categoryFromURL]);

  // Update the URL when the dropdown value changes
  useEffect(() => {
    const newParams = new URLSearchParams();
    newParams.set("category", selectedCategory);
    router.replace(`/top-gainers?${newParams.toString()}`, { scroll: false });
  }, [selectedCategory, router]);

  return (
    <ContentLayout title="Top Gainers">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
          <Select
              onValueChange={(value) => {
                const newPath =
                  value === "Topgainers"
                    ? "/top-gainers"
                    : value === "Toplosers"
                    ? "/top-losers"
                    : "/top-volume";
                router.push(newPath);
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Top Gainers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Topgainers">Top Gainers</SelectItem>
                <SelectItem value="Toplosers">Top Losers</SelectItem>
                <SelectItem value="TopVolume">Top Volume</SelectItem>
              </SelectContent>
            </Select>
          </BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Select onValueChange={setSelectedCategory} value={selectedCategory}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">ALL Stocks</SelectItem>
                <SelectItem value="NIFTY50">NIFTY 50</SelectItem>
                {/* <SelectItem value="NIFTY100">NIFTY 100</SelectItem> */}
                <SelectItem value="NIFTY200">NIFTY 200</SelectItem>
              </SelectContent>
            </Select>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <br />
      <TopGainersSection selectedCategory={selectedCategory} />
    </ContentLayout>
  );
}
