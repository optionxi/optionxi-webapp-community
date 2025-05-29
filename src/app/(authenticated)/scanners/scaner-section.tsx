import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowDownCircle, 
  TrendingUp,
  Calendar,
  Clock,
  CalendarDays
} from "lucide-react";
import { Screener } from '@/datamodels/screeners_model';
import { fetchScreeners } from '@/lib/supabaseDB/supabase_screeners';
import { ScannerCard } from './custom-scanners-card';
import { ScannerCardSkeleton } from './custom-screener-card-skelton';

const TimeframeIcon = ({ timeframe }: { timeframe: string }) => {
  switch (timeframe) {
    case 'daily':
      return <Clock className="h-5 w-5" />;
    case 'weekly':
      return <Calendar className="h-5 w-5" />;
    case 'monthly':
      return <CalendarDays className="h-5 w-5" />;
    default:
      return null;
  }
};
const ScreenerSkeleton = () => (
  <div className="space-y-4">
    <ScannerCardSkeleton />
    <ScannerCardSkeleton />
    <ScannerCardSkeleton />
  </div>
);

const ScannerDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFromURL = searchParams?.get("category") || "bullish";
  
  const [bullishScreeners, setBullishScreeners] = useState<Screener[]>([]);
  const [bearishScreeners, setBearishScreeners] = useState<Screener[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadScreeners = async () => {
      try {
        setLoading(true);
        const [bullishData, bearishData] = await Promise.all([
          fetchScreeners('bullish'),
          fetchScreeners('bearish')
        ]);
        
        setBullishScreeners(bullishData);
        setBearishScreeners(bearishData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load screeners');
      } finally {
        setLoading(false);
      }
    };

    loadScreeners();
  }, []);

  const handleTabChange = (value: string) => {
    // Create a new URLSearchParams with either current params or empty object
    const current = new URLSearchParams(
      searchParams ? Array.from(searchParams.entries()) : []
    );
    // Update the category parameter
    current.set("category", value);
    // Push the new URL
    router.push(`?${current.toString()}`);
  };

  const groupScreenersByTimeframe = (screeners: Screener[]) => {
    return screeners.reduce((acc, screener) => {
      const { timeframe } = screener;
      if (!acc[timeframe]) {
        acc[timeframe] = [];
      }
      acc[timeframe].push(screener);
      return acc;
    }, {} as Record<string, Screener[]>);
  };

  const bullishGrouped = groupScreenersByTimeframe(bullishScreeners);
  const bearishGrouped = groupScreenersByTimeframe(bearishScreeners);

  const renderTimeframeGroup = (
    screeners: Screener[] | undefined,
    timeframe: string,
    type: 'bullish' | 'bearish'
  ) => {
    if (!screeners?.length) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TimeframeIcon timeframe={timeframe} />
            <span className="capitalize">{timeframe} Screeners</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {screeners.map((screener) => (
              <ScannerCard 
                key={screener.id} 
                screener={screener} 
                type={type}
                category={categoryFromURL}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Tabs 
        defaultValue={categoryFromURL} 
        className="space-y-6"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="bullish" className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span>Bullish Scanners</span>
          </TabsTrigger>
          <TabsTrigger value="bearish" className="flex items-center space-x-2">
            <ArrowDownCircle className="h-5 w-5 text-red-500" />
            <span>Bearish Scanners</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bullish">
          {loading ? (
            <div className="space-y-6">
              <ScreenerSkeleton />
              <ScreenerSkeleton />
              <ScreenerSkeleton />
            </div>
          ) : error ? (
            <div className="text-red-500">Error: {error}</div>
          ) : (
            <>
              {renderTimeframeGroup(bullishGrouped['daily'], 'daily', 'bullish')}
              {renderTimeframeGroup(bullishGrouped['weekly'], 'weekly', 'bullish')}
              {renderTimeframeGroup(bullishGrouped['monthly'], 'monthly', 'bullish')}
            </>
          )}
        </TabsContent>

        <TabsContent value="bearish">
          {loading ? (
            <div className="space-y-6">
              <ScreenerSkeleton />
              <ScreenerSkeleton />
            </div>
          ) : error ? (
            <div className="text-red-500">Error: {error}</div>
          ) : (
            <>
              {renderTimeframeGroup(bearishGrouped['daily'], 'daily', 'bearish')}
              {renderTimeframeGroup(bearishGrouped['weekly'], 'weekly', 'bearish')}
              {renderTimeframeGroup(bearishGrouped['monthly'], 'monthly', 'bearish')}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScannerDashboard;