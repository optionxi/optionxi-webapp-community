import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { totalstocks } from '@/datamodels/constants';
import { useRouter } from 'next/navigation';

// Type definitions
type StockData = {
  stock_name: string;
  full_stock_name: string;
};

export const SearchBarCustom: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredResults, setFilteredResults] = useState<StockData[]>([]);

  useEffect(() => {
    const stocksArray = Object.values(totalstocks);

    const filtered = stocksArray
      .filter(item =>
        item.stock_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.full_stock_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const searchLower = searchQuery.toLowerCase();
        const aStockName = a.stock_name.toLowerCase();
        const bStockName = b.stock_name.toLowerCase();
        const aFullStockName = a.full_stock_name.toLowerCase();
        const bFullStockName = b.full_stock_name.toLowerCase();

        // Check for exact matches in `stock_name` or `full_stock_name`
        const aExactMatch = aStockName === searchLower || aFullStockName === searchLower;
        const bExactMatch = bStockName === searchLower || bFullStockName === searchLower;

        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;

        // Check for startsWith matches
        const aStartsWith = aStockName.startsWith(searchLower) || aFullStockName.startsWith(searchLower);
        const bStartsWith = bStockName.startsWith(searchLower) || bFullStockName.startsWith(searchLower);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        return 0;
      })
      .slice(0, 5); // Limit to 5 results

    setFilteredResults(filtered);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatStockName = (stockName: string) => {
    return stockName.split("-")[0].split(":")[1];
  };

  const handleStockSelect = (stockName: string) => {
    router.push(`/stocks/${formatStockName(stockName.toUpperCase())}`);
    setSearchQuery(stockName);
    setShowSuggestions(false);
  };

  return (
    <div className="relative max-w-2xl mx-auto search-container">
      <div className="relative">
        <input
          type="text"
          placeholder="Search your stocks.."
          className="w-full p-2 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl 
            text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 
            outline-none border border-gray-200 dark:border-gray-700 
            focus:border-blue-500 transition-colors"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
        />
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      {showSuggestions && (
        <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-xl 
          border border-gray-200 dark:border-gray-700 shadow-xl max-h-[300px] overflow-y-auto">
          {filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <div
                key={result.stock_name}
                className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer 
                  flex justify-between items-center"
                onClick={() => handleStockSelect(result.stock_name)}
              >
                <div className="flex flex-col">
                  <span className="text-gray-900 dark:text-white text-left">{result.full_stock_name}</span>
                  <span className="text-blue-600 dark:text-blue-400 text-sm text-left">
                    {formatStockName(result.stock_name)}
                  </span>
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-sm">Stock</span>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};
