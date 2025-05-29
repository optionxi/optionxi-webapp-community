import React, { useState, useEffect } from 'react';
import {Info} from 'lucide-react';
import { cn } from "@/lib/utils";
import CustomStockItemHeatMap from '@/components/custom/cust_stock_item_heatmap';
import { TopStock, fetchTopBullishBearishStocks } from '@/lib/supabaseDB/supabase_screeners_stock_top';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TopStocksHeatMapProps {
  category?: 'bullish' | 'bearish';
  limit?: number;
}

export default function TopStocksHeatMap({ 
  category = 'bullish', 
  limit = 10 
}: TopStocksHeatMapProps) {
  const [stocks, setStocks] = useState<TopStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchTopBullishBearishStocks(category, limit);
        setStocks(data);
        setError(null);
      } catch (err) {
        setError('Failed to load stock data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [category, limit]);

  const toggleInfoDialog = () => {
    setIsInfoOpen(!isInfoOpen);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow-md p-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {category.charAt(0).toUpperCase() + category.slice(1)} Stocks
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Signal Count</span>
          <button 
            onClick={toggleInfoDialog}
            className="flex items-center justify-center p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Signal count information"
          >
            <Info className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocks.length > 0 ? (
          stocks.map((stock) => (
            <Link key={stock.stockName} href={`/stocks/${stock.stockName.split(":")[1].split("-")[0]}`} passHref>
              <div className="relative group">
                <CustomStockItemHeatMap
                  logoUrl={`/assets/stockimages/${stock.stockName.split(":")[1].split("-")[0]}.png`}
                  title={`${stock.stockName}`}
                  price={stock.lastPrice}
                  priceChange={stock.lastPrice - stock.open} 
                  percentage={stock.percentChange}
                />
                
                {/* Signal count badge */}
                <div className={cn(
                  "absolute -top-2 -right-2",
                  "flex items-center justify-center",
                  "min-w-6 h-6 px-1",
                  "rounded-full",
                  "bg-blue-500 dark:bg-blue-600",
                  "text-white dark:text-white",
                  "text-xs font-bold",
                  "shadow-md",
                  "transition-transform duration-300",
                  "group-hover:scale-110",
                  "z-10"
                )}>
                  {stock.signalCount}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full p-4 text-center text-sm rounded-lg custom-div">
            No stocks found
          </div>
        )}
      </div>
      
      {stocks.length > 0 && (
        <div className="mt-6 pt-3 text-xs text-gray-500 border-t border-gray-200 dark:border-gray-700">
          Last updated: {new Date().toLocaleString()}
        </div>
      )}

      {/* Info Dialog */}
      <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>About Signal Count</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              The signal count represents the number of technical screeners that have identified this stock with a {category} trend. 
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
              A higher signal count indicates stronger consensus across multiple technical indicators, suggesting a higher probability of price movement in the {category} direction.
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
              This metric combines various technical analyses to provide a comprehensive view of market sentiment, helping you identify stocks with the strongest directional signals.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}