'use client';

import React, { useEffect, useState } from 'react';
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
import { ScannerCard } from '../../scanners/custom-scanners-card';
import { fetchScreenersForStock } from '@/lib/supabaseDB/supabase_screeners_stock';
import { ScannerCardSkeletonStock } from '../../scanners/custom-screener-card-skelton-stock';

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

interface ScannerStocksProps {
  stockname: string;
}

const ScannerStocks = ({ stockname }: ScannerStocksProps) => {
  const [category, setCategory] = useState<'bullish' | 'bearish'>('bullish');
  const [bullishScreeners, setBullishScreeners] = useState<Screener[]>([]);
  const [bearishScreeners, setBearishScreeners] = useState<Screener[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (stockname) {
      loadScreenersForStock(stockname);
    }
  }, [stockname, category]);

  const loadScreenersForStock = async (stock: string) => {
    try {
      setLoading(true);
      setError(null);
      const [bullishData, bearishData] = await Promise.all([
        fetchScreenersForStock('bullish', stock),
        fetchScreenersForStock('bearish', stock)
      ]);
      
      setBullishScreeners(bullishData);
      setBearishScreeners(bearishData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load screeners');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: 'bullish' | 'bearish') => {
    setCategory(value);
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
                category={category}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const noScreenersMessage = (
    <div className="text-center py-8">
      <p className="text-xl font-medium">No screeners found for {stockname}</p>
      <p className="text-gray-500 mt-2">This stock doesn&lsquo;t appear in any {category} screeners</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* {stockname && (
        <div className="mb-4">
          <p className="text-lg font-medium">
            Screeners  <span className="font-bold">{stockname}</span>
          </p>
        </div>
      )} */}

      <Tabs 
        defaultValue={category} 
        className="space-y-6"
        onValueChange={(value) => handleTabChange(value as 'bullish' | 'bearish')}
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
             <ScannerCardSkeletonStock />
           </div>
          ) : error ? (
            <div className="text-red-500">Error: {error}</div>
          ) : bullishScreeners.length > 0 ? (
            <>
              {renderTimeframeGroup(bullishGrouped['daily'], 'daily', 'bullish')}
              {renderTimeframeGroup(bullishGrouped['weekly'], 'weekly', 'bullish')}
              {renderTimeframeGroup(bullishGrouped['monthly'], 'monthly', 'bullish')}
            </>
          ) : (
            noScreenersMessage
          )}
        </TabsContent>

        <TabsContent value="bearish">
          {loading ? (
            <div className="space-y-6">
              <ScannerCardSkeletonStock />
            </div>
          ) : error ? (
            <div className="text-red-500">Error: {error}</div>
          ) : bearishScreeners.length > 0 ? (
            <>
              {renderTimeframeGroup(bearishGrouped['daily'], 'daily', 'bearish')}
              {renderTimeframeGroup(bearishGrouped['weekly'], 'weekly', 'bearish')}
              {renderTimeframeGroup(bearishGrouped['monthly'], 'monthly', 'bearish')}
            </>
          ) : (
            noScreenersMessage
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScannerStocks;