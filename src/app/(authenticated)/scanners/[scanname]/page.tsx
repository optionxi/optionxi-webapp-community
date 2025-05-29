'use client';

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import { Screener } from "@/datamodels/screeners_model";
import ScreenerResultsPage from "./scan-result";
import { fetchScreeners } from "@/lib/supabaseDB/supabase_screeners";
import { CalendarIcon, CalendarDaysIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ScreenerResultLoadingSkeleton from "./loading-skelton";

export default function ScannerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const scanName = params?.scanname as string;
  const displayScanName = scanName?.replace(/-/g, ' ');
  
  const searchParams = useSearchParams();
  const categoryFromURL = searchParams?.get("category") || "bullish";
  const [selectedCategory, setSelectedCategory] = useState(categoryFromURL);
  const [screeners, setScreeners] = useState<Screener[]>([]);
  const [selectedScreener, setSelectedScreener] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch screeners based on category
  useEffect(() => {
    const loadScreeners = async () => {
      try {
        setLoading(true);
        const fetchedScreeners = await fetchScreeners(selectedCategory as 'bullish' | 'bearish');
        setScreeners(fetchedScreeners);
        
        // Find the matching screener based on URL parameter
        const matchingScreener = fetchedScreeners.find(screener => 
          screener.name.toLowerCase().replace(/\s+/g, '-') === scanName
        );
        
        if (matchingScreener) {
          setSelectedScreener(matchingScreener.name);
        } else if (fetchedScreeners.length > 0) {
          // If no match found, use the first one
          setSelectedScreener(fetchedScreeners[0].name);
          
          // Update URL to match first screener without losing category
          const firstScreenerSlug = fetchedScreeners[0].name.toLowerCase().replace(/\s+/g, '-');
          router.replace(`/scanners/${firstScreenerSlug}?category=${selectedCategory}`);
        }
      } catch (err) {
        console.error("Error fetching screeners:", err);
      } finally {
        setLoading(false);
      }
    };

    loadScreeners();
  }, [scanName, selectedCategory, router]);

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value); // Update state first
    
    // Find the first screener of the new category
    const categoryScreeners = screeners.filter(s => s.category === value);
    if (categoryScreeners.length > 0) {
      const firstScreener = categoryScreeners[0];
      const firstScreenerSlug = firstScreener.name.toLowerCase().replace(/\s+/g, '-');
      router.push(`/scanners/${firstScreenerSlug}?category=${value}`);
    }
  };

  // Handle screener selection change
  const handleScreenerChange = (value: string) => {
    setSelectedScreener(value);
    
    // Find the selected screener object
    const selectedScreenerObj = screeners.find(s => s.name === value);
    
    if (selectedScreenerObj) {
      // Navigate to the selected screener
      const screenerSlug = value.toLowerCase().replace(/\s+/g, '-');
      router.push(`/scanners/${screenerSlug}?category=${selectedCategory}`);
    }
  };

  // Find screener ID for the selected screener
  const getScreenerId = () => {
    const screenerObj = screeners.find(s => s.name === selectedScreener);
    return screenerObj?.id || "";
  };

  // Render timeframe icon
  const renderTimeframeIcon = (timeframe: string) => {
    if (timeframe === 'daily') {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <CalendarIcon className="h-4 w-4 ml-2" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Daily timeframe</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (timeframe === 'weekly') {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <CalendarDaysIcon className="h-4 w-4 ml-2" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Weekly timeframe</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return null;
  };

  // Filter screeners by current category
  const filteredScreeners = screeners.filter(s => s.category === selectedCategory);

  return (
    <ContentLayout title={`Screener: ${displayScanName || 'Loading...'}`}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/scanners">Scanners</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Select 
              onValueChange={handleCategoryChange} 
              value={selectedCategory}
              disabled={loading}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bullish">Bullish</SelectItem>
                <SelectItem value="bearish">Bearish</SelectItem>
              </SelectContent>
            </Select>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Select 
              onValueChange={handleScreenerChange} 
              value={selectedScreener}
              disabled={loading || filteredScreeners.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Screener" />
              </SelectTrigger>
              <SelectContent>
                {filteredScreeners.map(screener => (
                  <SelectItem key={screener.id} value={screener.name}>
                    <div className="flex items-center">
                      <span>{screener.name}</span>
                      {renderTimeframeIcon(screener.timeframe)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <br />
      {loading ? (
        <ScreenerResultLoadingSkeleton/>
      ) : (
        <ScreenerResultsPage 
          screenerId={getScreenerId()} 
          screenerName={selectedScreener} 
        />
      )}
    </ContentLayout>
  );
}