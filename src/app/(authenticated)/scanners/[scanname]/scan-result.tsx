'use client';

import React, { useState, useEffect } from 'react';
import { DataStockModel } from '@/datamodels/stock_model';
import NoResultFound from '@/components/custom/no_result_found';
import CustomScreenerItemLoading from '@/components/custom/cust_screener_item_loading';
import StockDetailsDrawer from '@/components/custom/cust_stock_details_sheet';
import CustSearchBar from '@/components/custom/cust_searchbar';
import CustomStockItemHeatMap from '@/components/custom/cust_stock_item_heatmap';
import { fetchScreenerResults } from '@/lib/supabaseDB/supabase_screener_result';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

interface ScreenerResultsPageProps {
  screenerId: string;
  screenerName: string;
}

export default function ScreenerResultsPage({ screenerId, screenerName }: ScreenerResultsPageProps) {
  const [stocks, setStocks] = useState<DataStockModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerStock, setDrawerStock] = useState<DataStockModel | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStocks, setTotalStocks] = useState(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // Default to descending order

  const pageSize=20;
  const totalPages = Math.ceil(totalStocks / pageSize);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { results, total } = await fetchScreenerResults({
          screenerId,
          page: currentPage,
          pageSize,
          search, // Pass search term to backend
          sortBy: sortOrder, // Pass sort order to backend
        });
        setStocks(results);
        setTotalStocks(total);
      } catch (error) {
        console.error('Error fetching screener results:', error);
        setStocks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [screenerId, currentPage, pageSize, search, sortOrder]);

  const handleStockClick = (stock: DataStockModel) => {
    setDrawerStock(stock);
    setDrawerOpen(true);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    setCurrentPage(1); // Reset to the first page when sorting
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-4">{screenerName} Results</h1>
      <div className="flex flex-col space-y-4 items-center my-4">
        <CustSearchBar search={search} setSearch={handleSearchChange} />
        <Button variant="outline" size="sm" onClick={handleSortToggle}>
          Sort by Percentage: {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
        </Button>
      </div>

      {stocks.length === 0 && !loading ? (
        <NoResultFound description={'No Stocks found, Try different filters'} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {loading ? (
              Array(20)
                .fill(null)
                .map((_, index) => <CustomScreenerItemLoading key={index} />)
            ) : (
              stocks.map((stock) => (
                <div
                  key={stock.stckname}
                  onClick={() => handleStockClick(stock)}
                  className="cursor-pointer"
                >
                  <CustomStockItemHeatMap
                    logoUrl={`/assets/stockimages/${stock.stckname.split(':')[1].split('-')[0]}.png`}
                    title={stock.stckname}
                    price={stock.close}
                    priceChange={stock.close - stock.pclose}
                    percentage={stock.pcnt}
                  />
                </div>
              ))
            )}
          </div>

          {/* Pagination controls */}
          {stocks.length > 0 && totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1 || loading}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages || totalPages === 0 || loading}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {drawerStock && (
        <StockDetailsDrawer
          open={drawerOpen}
          setOpen={setDrawerOpen}
          logoUrl={`/assets/stockimages/${drawerStock.stckname.split(':')[1].split('-')[0]}.png`}
          title={drawerStock.stckname}
          price={drawerStock.close}
          priceChange={drawerStock.close - drawerStock.pclose}
          percentage={drawerStock.pcnt}
        />
      )}
    </div>
  );
}