'use client'

import { useState, useEffect } from 'react'
import SparkAreaStocks from '@/components/chart/chart-stock-single'
import { formatStockDataForChart } from '@/lib/supabaseDB/helper_formatdata';
import { TopGainerLoserData } from '@/datamodels/topgainerloser_model';
import SparkAreaStocksLoading from '@/components/chart/chart-stock-loading';
import { fetchTopVolumeData } from '@/lib/supabaseDB/supabase_topvolume';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import StockDetailSideBarPage from '@/components/custom/cust_sidebar_stockdetails';

interface TopGainersSectionProps {
  selectedCategory: string;
}

export default function TopVolumeSection({ selectedCategory }: TopGainersSectionProps) {
  const [stockName, setStockName] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [stocksData, setStocksData] = useState<TopGainerLoserData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await fetchTopVolumeData(selectedCategory);
      
      if (data) {
        setStocksData(data);        
        console.log("Fetched stock data:", data);

      } else if (error) {
        console.error("Error fetching stock data:", error);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [selectedCategory]);

  const handleStockClick = (stock: string) => {
    setStockName(stock)
    setIsSheetOpen(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="max-w-2xl">
              <SparkAreaStocksLoading />
            </div>
          ))}
        </div>
      </div>
    );
  }
  

  return (
    <div className="container mx-auto p-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {stocksData.map((stock, index) => {
          const formattedData = formatStockDataForChart(stock);
          return (
            <div key={index} onClick={() => handleStockClick(stock.stckname)} className="cursor-pointer">
              <SparkAreaStocks
                stockName={formattedData.stockName}
                symbol={formattedData.symbol}
                currentPrice={formattedData.currentPrice}
                percentageChange={formattedData.percentageChange}
                dayRange={formattedData.dayRange}
                weekRange={formattedData.weekRange}
                volume={formattedData.volume}
                smavolume4={formattedData.smavolume4}
                data={formattedData.performance.map((value, i) => ({
                  month: `Day ${i + 1}`,
                  Performance: value
                }))}
                className="max-w-2xl"
              />
            </div>
          );
        })}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetContent className="w-full overflow-auto">
                {/* <SheetHeader>
                  <SheetTitle>{stockName}</SheetTitle>
                </SheetHeader> */}
                <div className="mt-4">
                  <StockDetailSideBarPage stockname={stockName}            />
                </div>
              </SheetContent>
        </Sheet>
    </div>
  )
}