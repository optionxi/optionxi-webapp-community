'use client';

import React, { useState, useEffect } from 'react';
// import { app } from '@/utils/firebaseConfig';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { fetchTotalStocks } from '@/lib/fireabaseRTD/firebase_fetch_totalstocks';
import { DataStockModel } from '@/datamodels/stock_model';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PaginationHeatmap from '@/components/custom/cust_heatmap_pagination';
import { NIFTY200_STOCKS, NIFTY50_STOCKS } from '@/datamodels/constants';
import { useSearchParams } from 'next/navigation';
import NoResultFound from '@/components/custom/no_result_found';
import CustomScreenerItemLoading from '@/components/custom/cust_screener_item_loading';
import StockDetailsDrawer from '@/components/custom/cust_stock_details_sheet';
import CustSearchBar from '@/components/custom/cust_searchbar';
import CustomStockItemHeatMap from '@/components/custom/cust_stock_item_heatmap';
import { fetchLiveStockData } from '@/lib/supabaseDB/supabase_livestocks';

const RANGE_BUTTONS = [
  { label: 'Above +15%', range: [15, Infinity], color: '#4CAF50' },
  { label: '+10 to +15%', range: [10, 15], color: '#66BB6A' },
  { label: '+5 to +10%', range: [5, 10], color: '#81C784' },
  { label: '+2 to +5%', range: [2, 5], color: '#A5D6A7' },
  { label: '0 to +2%', range: [0, 2], color: '#C8E6C9' },
  { label: '-2 to 0%', range: [-2, 0], color: '#FFCDD2' },
  { label: '-5 to -2%', range: [-5, -2], color: '#EF9A9A' },
  { label: '-10 to -5%', range: [-10, -5], color: '#E57373' },
  { label: '-15 to -10%', range: [-15, -10], color: '#F44336' },
  { label: 'Below -15%', range: [-Infinity, -15], color: '#C62828' },
];

const ITEMS_PER_PAGE_OPTIONS = [50, 100, 200, 'All'];

const NIFTY_OPTIONS = {
  'NIFTY50': NIFTY50_STOCKS,
  'NIFTY200': NIFTY200_STOCKS // Add more stocks as needed
};

export default function HeatmapPage() 
  {
  const searchParams = useSearchParams();
  // let sectorName: string | null = null;

  if(searchParams){
    // sectorName = searchParams.get('sectorName');
  }
  
  
  const [selectedScreenerStocks, setSelectedScreenerStocks] = useState<DataStockModel[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<DataStockModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerStock, setDrawerStock] = useState<DataStockModel | null>(null);
  const [search,setSearch] = useState('');
  const [selectedRange, setSelectedRange] = useState<number[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | 'All'>(50);
  const [selectedNifty, setSelectedNifty] = useState<string | null>(null);
  // const [selectedSector, setSelectedSector] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const stocks = await fetchLiveStockData();
      setSelectedScreenerStocks(stocks);
      setFilteredStocks(stocks);
    } catch (error) {
      console.error("Error fetching stocks:", error);
      setSelectedScreenerStocks([]);
      setFilteredStocks([]);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  // useEffect(() => {
  //   if (sectorName) {
  //     const decodedSectorName = decodeURIComponent(sectorName);
  //     setSelectedSector(decodedSectorName);
  //   }
  // }, [sectorName]);

  useEffect(() => {
    let filtered = selectedScreenerStocks;
    if (search) {
      filtered = filtered.filter(stock =>
        stock.stckname.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedRange) {
      const [min, max] = selectedRange;
      filtered = filtered.filter(stock =>
        stock.pcnt >= min && stock.pcnt <= max
      );
    }
    if (selectedNifty && selectedNifty !== 'all') {
      const niftyStocks = NIFTY_OPTIONS[selectedNifty as keyof typeof NIFTY_OPTIONS];
      filtered = filtered.filter(stock =>
        niftyStocks.some(niftyStock => stock.stckname.includes(niftyStock))
      );
    }
    // if (selectedSector && selectedSector !== 'all') {
    //   filtered = filtered.filter(stock => stock.sec === selectedSector);
    // }
    setFilteredStocks(filtered);
    setCurrentPage(1); // Reset to first page on new filter
  // }, [search, selectedRange, selectedScreenerStocks, selectedNifty, selectedSector]);
}, [search, selectedRange, selectedScreenerStocks, selectedNifty]);

  const handleStockClick = (stock: DataStockModel) => {
    setDrawerStock(stock);
    setDrawerOpen(true);
  };

  const handleRangeClick = (range: number[]) => {
    setSelectedRange(range);
  };

  // Pagination logic
  const totalPages = itemsPerPage === 'All' ? 1 : Math.ceil(filteredStocks.length / (itemsPerPage as number));
  const currentStocks = itemsPerPage === 'All' 
    ? filteredStocks 
    : filteredStocks.slice((currentPage - 1) * (itemsPerPage as number), currentPage * (itemsPerPage as number));

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(value === 'All' ? 'All' : parseInt(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const loadingArrayListStock = new Array(itemsPerPage === 'All' ? filteredStocks.length : itemsPerPage).fill(null);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-center">
        </div>
        <div className="flex flex-wrap gap-3 pt-6">
          {RANGE_BUTTONS.map((btn) => (
            <div
              key={btn.label}
              onClick={() => handleRangeClick(btn.range)}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg
                shadow-sm hover:shadow-md
                transition-all duration-200 ease-in-out
                hover:scale-105 active:scale-95
                cursor-pointer select-none
                ${selectedRange === btn.range 
                  ? 'ring-2 ring-offset-2 ring-black/10' 
                  : 'hover:brightness-95'
                }
              `}
              style={{
                backgroundColor: btn.color,
                opacity: selectedRange === btn.range ? 1 : 0.85,
              }}
            >
              {btn.label}
            </div>
          ))}
          
          <div
            onClick={() => setSelectedRange(null)}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg
              shadow-sm hover:shadow-md
              transition-all duration-200 ease-in-out
              hover:scale-105 active:scale-95
              cursor-pointer select-none
              ${selectedRange === null 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }
            `}
          >
            All Stocks
          </div>
        </div>
        
        {/* Pagination Controls */}
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 items-center my-4 pt-4">
        <CustSearchBar search={search} setSearch={setSearch} />
        <Select onValueChange={setSelectedNifty} value={selectedNifty || 'all'}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select NIFTY Index" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stocks</SelectItem>
            {Object.keys(NIFTY_OPTIONS).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* <Select onValueChange={setSelectedSector} value={selectedSector ?? 'all'}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select Sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            {SECTOR_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}

        <div className="flex items-center justify-center md:justify-start w-full md:w-auto">
          <span className="mr-2 whitespace-nowrap">Items per page:</span>
          <Select onValueChange={handleItemsPerPageChange} value={itemsPerPage.toString()}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* <PaginationHeatmap
          currentPage={currentPage}
          totalPages={totalPages}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
        /> */}
        {/* <CustSearchBar search={search} setSearch={setSearch} /> */}
      </div>

        {filteredStocks.length === 0 && !loading ? (
          <NoResultFound description={'No Stocks found, Try different filters'} />
        ) : (
          <>
            {/* <h2 className="text-xl font-semibold mt-2">Stock List</h2> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4  mt-6">
              {loading ? (
                loadingArrayListStock.map((_, index) => (
                  <CustomScreenerItemLoading key={index} />
                ))
              ) : (
                currentStocks.map((stock) => (
                  <div
                    key={stock.stckname}
                    onClick={() => handleStockClick(stock)}
                    className="cursor-pointer"
                  >
                    <CustomStockItemHeatMap
                      logoUrl={`/assets/stockimages/${stock.stckname.split(":")[1].split("-")[0]}.png`}
                      title={stock.stckname}
                      price={stock.close}
                      priceChange={stock.close - stock.pclose}
                      percentage={stock.pcnt}
                    />
                  </div>
                ))
              )}
            </div>
          </>
        )}
        <br/>
        <div className="mx-auto w-fit">
        <PaginationHeatmap
          currentPage={currentPage}
          totalPages={totalPages}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
        />
        </div>
        
      </div>
      

      {drawerStock && (
        <StockDetailsDrawer
          open={drawerOpen}
          setOpen={setDrawerOpen}
          logoUrl={`/assets/stockimages/${drawerStock.stckname.split(":")[1].split("-")[0]}.png`}
          title={drawerStock.stckname}
          price={drawerStock.close}
          priceChange={drawerStock.close - drawerStock.pclose}
          percentage={drawerStock.pcnt}
        />
      )}
    </div>
  );
}