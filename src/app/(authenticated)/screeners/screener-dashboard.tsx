'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Play, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import SparkAreaStocksLoading from '@/components/chart/chart-stock-loading';
import StockDetailSideBarPage from '@/components/custom/cust_sidebar_stockdetails';
import { formatStockDataForChartGenerated } from '@/lib/supabaseDB/helper_formatdata';
import { fetchStockData, fetchTotalStockCount, getTechnicalPatternFilters } from '@/lib/supabaseDB/supabase_customscanner';
import { ColumnComparisonFilter } from '@/datamodels/filter_model';
import { GeneratedDataModel } from '@/datamodels/generatedvalue_model';
import SparkAreaStocksTrimed from '@/components/chart/chart-stock-single-trim';

const StockFilterAndDisplay = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [columnFilters, setColumnFilters] = useState<ColumnComparisonFilter[]>([]);
  const [collapsedFilters, setCollapsedFilters] = useState<boolean[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stocksData, setStocksData] = useState<GeneratedDataModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [stockName, setStockName] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalStocks, setTotalStocks] = useState(0);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [isTechnicalPatternsCollapsed, setIsTechnicalPatternsCollapsed] = useState(false);
  const [appliedPatterns, setAppliedPatterns] = useState<string[]>([]);
  const pageSize = 10;

  const indicatorGroups = {
    'Price': ['open', 'close', 'high', 'low'],
    'Moving Averages': ['ema10', 'ema20', 'ema50', 'ema100', 'ema150', 'ema200', 
                       'sma10', 'sma20', 'sma50', 'sma100', 'sma150', 'sma200'],
    'Volume': ['vol', 'curr_month_vol', 'curr_week_vol', 'curr_day_sma5_volume'],
    'RSI': ['rsi14', 'curr_week_rsi14'],
    'Historical': ['max_250_high', 'min_250_low', 'week_max_52_high', 'week_min_52_low'],
    'Previous Days': [
      'prev_day_close', 'prev_day2_close', 'prev_day3_close', 'prev_day4_close', 'prev_day5_close',
      'prev_day_high', 'prev_day2_high', 'prev_day3_high', 'prev_day4_high', 'prev_day5_high',
      'prev_day_low', 'prev_day2_low', 'prev_day3_low', 'prev_day4_low', 'prev_day5_low',
      'prev_day_vol', 'prev_day2_vol', 'prev_day3_vol', 'prev_day4_vol', 'prev_day5_vol'
    ]
  };
  type TechnicalPatternKey = 'breakout' | 'bullishMomentum' | 'volumeSpike' | 'aboveEMA' | 'deathCross';


  const operators = [
    { value: 'gt', label: 'Greater than' },
    { value: 'lt', label: 'Less than' },
    { value: 'eq', label: 'Equal to' },
    { value: 'gte', label: 'Greater than or equal' },
    { value: 'lte', label: 'Less than or equal' }
  ];

  // Helper function to get operator label
  const getOperatorLabel = (operatorValue: string) => {
    const op = operators.find(op => op.value === operatorValue);
    return op ? op.label.toLowerCase() : operatorValue;
  };

  // Helper function to get filter summary text
  const getFilterSummary = (filter: ColumnComparisonFilter) => {
    if (!filter.indicator_l || !filter.operator || !filter.indicator_r) return "Incomplete filter";
    return `${filter.indicator_l} ${getOperatorLabel(filter.operator)} ${filter.indicator_r}`;
  };

  // Update URL with current filters
  const updateUrlWithFilters = (indicator = '') => {
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    
    if (indicator) {
      params.set('indicator', indicator);
    } else if (columnFilters.length > 0) {
      params.set('filters', JSON.stringify(columnFilters));
    }
    
    if (page > 1) {
      params.set('page', page.toString());
    }
    
    const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
    router.push(newUrl, { scroll: false });
  };

  useEffect(() => {
    const search = searchParams?.get('search');
    const filtersParam = searchParams?.get('filters');
    const pageParam = searchParams?.get('page');
    const indicatorParam = searchParams?.get('indicator');
    
    if (search) setSearchTerm(search);
    if (pageParam) setPage(parseInt(pageParam));
    
    if (filtersParam) {
      try {
        const parsedFilters = JSON.parse(filtersParam);
        setColumnFilters(parsedFilters);
        // Initialize collapsed state for each filter
        setCollapsedFilters(parsedFilters.map((filter: ColumnComparisonFilter) => 
          filter.indicator_l && filter.operator && filter.indicator_r
        ));
      } catch (e) {
        console.error('Error parsing filters from URL', e);
      }
    }
    
    if (indicatorParam) {
      // Type guard to check if the indicatorParam is a valid key
      const isValidPattern = (key: string): key is TechnicalPatternKey => {
        return ['breakout', 'bullishMomentum', 'volumeSpike', 'aboveEMA', 'deathCross'].includes(key);
      };
    
      if (isValidPattern(indicatorParam)) {
        // Now TypeScript knows this is a valid key
        const patternFilters = getTechnicalPatternFilters[indicatorParam]();
        
        setColumnFilters(patternFilters);
        setCollapsedFilters(patternFilters.map(() => true));
        setAppliedPatterns([indicatorParam]);
        setIsTechnicalPatternsCollapsed(true);
      } else {
        // Handle invalid pattern
        console.warn(`Invalid pattern: ${indicatorParam}`);
        setColumnFilters([]);
      }
    }
    
    // If we have search, filters, or indicator in URL, run the query immediately
    if (search || filtersParam || indicatorParam) {
      // Set a small timeout to ensure state updates are complete before fetching
      setTimeout(() => {
        fetchAndSetStockData();
      }, 0);
    }
  }, []);

  // Simplified fetch function
  const fetchAndSetStockData = async () => {
    if (!searchTerm && columnFilters.length === 0) {
      setStocksData([]);
      setTotalStocks(0);
      setLoading(false);
      return;
    }
  
    setLoading(true);
    try {
      const { data } = await fetchStockData(
        searchTerm,
        columnFilters,
        page,
        pageSize
      );
      const { count } = await fetchTotalStockCount(searchTerm, columnFilters);
  
      setStocksData(data);
      setTotalStocks(count);
      setFiltersApplied(true);
      
      // Show toast notification with result count (green theme)
      toast({
        title: "Screener Results",
        description: `Found ${count} stocks matching your criteria`,
        duration: 3000,
        variant: "default",
        className: "bg-green-50 border-green-200 text-green-800", // Green theme for the toast
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setStocksData([]);
      setTotalStocks(0);
      
      toast({
        title: "Error",
        description: "Failed to fetch stock data. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Only fetch data when page changes if filters have been applied
  useEffect(() => {
    if (filtersApplied) {
      fetchAndSetStockData();
      updateUrlWithFilters();
    }
  }, [page]);

  // Auto-collapse filter when it's complete
  useEffect(() => {
    // Check if any filter was just completed
    columnFilters.forEach((filter, index) => {
      if (filter.indicator_l && filter.operator && filter.indicator_r) {
        // If filter is complete, set it to collapsed
        const newCollapsedState = [...collapsedFilters];
        newCollapsedState[index] = true;
        setCollapsedFilters(newCollapsedState);
      }
    });
  }, [columnFilters]);

  // Check if filter is complete and collapse previous filters when adding a new one
  useEffect(() => {
    // Check if any filter was just completed
    const newCollapsedState = [...collapsedFilters];
    
    columnFilters.forEach((filter, index) => {
      if (filter.indicator_l && filter.operator && filter.indicator_r) {
        // If filter is complete, set it to collapsed
        newCollapsedState[index] = true;
      }
    });
  
    // Update the collapsed state only if there are changes
    if (JSON.stringify(newCollapsedState) !== JSON.stringify(collapsedFilters)) {
      setCollapsedFilters(newCollapsedState);
    }
  }, [columnFilters]);

  const addColumnFilter = () => {
    setColumnFilters([...columnFilters, {
      indicator_l: '',
      operator: '',
      indicator_r: ''
    }]);
    
    // Set the new filter as expanded
    setCollapsedFilters([...collapsedFilters, false]);
  };

  const removeColumnFilter = (index: number) => {
    const newFilters = columnFilters.filter((_, i) => i !== index);
    const newCollapsedState = collapsedFilters.filter((_, i) => i !== index);
    
    setColumnFilters(newFilters);
    setCollapsedFilters(newCollapsedState);
  };

  const updateColumnFilter = (index: number, field: keyof ColumnComparisonFilter, value: string) => {
    const newFilters = [...columnFilters];
    newFilters[index][field] = value;
    setColumnFilters(newFilters);

    // Check if the filter is complete after updating
    const isComplete = newFilters[index].indicator_l && newFilters[index].operator && newFilters[index].indicator_r;
    if (isComplete) {
      const newCollapsedState = [...collapsedFilters];
      newCollapsedState[index] = true;
      setCollapsedFilters(newCollapsedState);
    }
  };

  const toggleFilterCollapse = (index: number) => {
    const newCollapsedState = [...collapsedFilters];
    newCollapsedState[index] = !newCollapsedState[index];
    setCollapsedFilters(newCollapsedState);
  };

  const isFilterComplete = (filter: ColumnComparisonFilter) => {
    return Boolean(filter.indicator_l && filter.operator && filter.indicator_r);
  };

  const handleStockClick = (stock: string) => {
    setStockName(stock);
    setIsSheetOpen(true);
  };

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleClearFilters = () => {
    setColumnFilters([]);
    setCollapsedFilters([]);
    setSearchTerm('');
    setFiltersApplied(false);
    setStocksData([]);
    setTotalStocks(0);
    setAppliedPatterns([]);
    router.push(window.location.pathname);
  };

  const handleApplyFilters = async () => {
    if (columnFilters.length === 0 && searchTerm === '') {
      return;
    }
    setPage(1); // Reset to first page when applying new filters
    updateUrlWithFilters();
    await fetchAndSetStockData();
  };

  const handleTechnicalPatternClick = (patternName: string, pattern: ColumnComparisonFilter[]) => {
    setColumnFilters(pattern);
    // Initialize collapsed state for pattern filters
    setCollapsedFilters(pattern.map(() => true));
    setAppliedPatterns([patternName]);
    // Collapse technical patterns after selection
    setIsTechnicalPatternsCollapsed(true);
    
    // Immediately update URL and run the query
    updateUrlWithFilters(patternName);
    // Set timeout to ensure state updates are complete
    setTimeout(() => {
      fetchAndSetStockData();
    }, 0);
  };

  // Determine if we should show the "Run Filters" button
  const showRunButton = columnFilters.length > 0 || searchTerm !== '';

  // Get applied filters summary
  const getAppliedFiltersSummary = () => {
    if (columnFilters.length === 0) return "No custom filters applied";
    
    const completeFilters = columnFilters.filter(isFilterComplete);
    return `${completeFilters.length} comparison${completeFilters.length > 1 ? 's' : ''} applied`;
  };

  // Get applied patterns summary
  const getAppliedPatternsSummary = () => {
    if (appliedPatterns.length === 0) return "No patterns applied";
    
    return appliedPatterns.map(pattern => 
      pattern.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    ).join(', ');
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Top Controls Bar - Modified for mobile */}
          <div className="flex flex-col gap-4">
            {/* Search Bar - Full width on mobile */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search stocks by name..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 w-full">
              {/* Clear Filters Button - Full width on mobile */}
              <Button 
                onClick={handleClearFilters} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 w-full md:w-auto"
              >
                <X className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Custom Filters Section */}
          <div className="space-y-4 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Custom Filters</h3>
                <span className="text-sm text-gray-500">
                  ({getAppliedFiltersSummary()})
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {columnFilters.length > 0 ? (
                columnFilters.map((filter, index) => {
                  const isComplete = isFilterComplete(filter);
                  const isCollapsed = collapsedFilters[index] && isComplete;
                  
                  return (
                    <Card key={index} className="p-4">
                      {/* Mobile view with collapsible filters */}
                      <div className="md:hidden">
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => isComplete ? toggleFilterCollapse(index) : null}
                        >
                          {isCollapsed ? (
                            <div className="flex-1 font-medium text-indigo-700 dark:text-indigo-400">
                              {getFilterSummary(filter)}
                            </div>
                          ) : (
                            <div className="font-medium">
                              Filter {index + 1}
                            </div>
                          )}
                          
                          <div className="flex items-center">
                            {isComplete && (
                              isCollapsed ? (
                                <ChevronDown className="h-5 w-5 mr-2 text-indigo-500" />
                              ) : (
                                <ChevronUp className="h-5 w-5 mr-2 text-indigo-500" />
                              )
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeColumnFilter(index);
                              }}
                              className="hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-600 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {!isCollapsed && (
                          <div className="flex flex-col gap-4 mt-4">
                            {/* Add the missing filter components for mobile view */}
                            <Select
                              value={filter.indicator_l}
                              onValueChange={(value) => updateColumnFilter(index, 'indicator_l', value)}
                            >
                              <SelectTrigger className="w-full mb-2">
                                <SelectValue placeholder="Select Indicator" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(indicatorGroups).map(([group, items]) => (
                                  <div key={group}>
                                    <div className="px-2 py-1.5 text-sm font-semibold">{group}</div>
                                    {items.map((item) => (
                                      <SelectItem key={item} value={item}>
                                        {item}
                                      </SelectItem>
                                    ))}
                                  </div>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={filter.operator}
                              onValueChange={(value) => updateColumnFilter(index, 'operator', value)}
                            >
                              <SelectTrigger className="w-full mb-2">
                                <SelectValue placeholder="Operator" />
                              </SelectTrigger>
                              <SelectContent>
                                {operators.map((op) => (
                                  <SelectItem key={op.value} value={op.value}>
                                    {op.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={filter.indicator_r}
                              onValueChange={(value) => updateColumnFilter(index, 'indicator_r', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Indicator" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(indicatorGroups).map(([group, items]) => (
                                  <div key={group}>
                                    <div className="px-2 py-1.5 text-sm font-semibold">{group}</div>
                                    {items.map((item) => (
                                      <SelectItem key={item} value={item}>
                                        {item}
                                      </SelectItem>
                                    ))}
                                  </div>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {/* Desktop view redesign for collapsed card appearance */}
                      <div className="hidden md:block">
                        {isComplete && isCollapsed ? (
                          <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 rounded-md p-4 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
                            onClick={() => toggleFilterCollapse(index)}>
                            <div className="flex items-center space-x-2">
                              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-1.5 rounded-full">
                                <Filter className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
                              </div>
                              <span className="font-medium text-indigo-700 dark:text-indigo-400">
                                {getFilterSummary(filter)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 rounded-full">Active</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeColumnFilter(index);
                                }}
                                className="hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-600 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <ChevronDown className="h-5 w-5 text-indigo-500" />
                            </div>
                          </div>
                        ) : (
                          <div className="md:flex md:flex-row md:items-center md:gap-4">
                            <Select
                              value={filter.indicator_l}
                              onValueChange={(value) => updateColumnFilter(index, 'indicator_l', value)}
                            >
                              <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Left Column" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(indicatorGroups).map(([group, items]) => (
                                  <div key={group}>
                                    <div className="px-2 py-1.5 text-sm font-semibold">{group}</div>
                                    {items.map((item) => (
                                      <SelectItem key={item} value={item}>
                                        {item}
                                      </SelectItem>
                                    ))}
                                  </div>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={filter.operator}
                              onValueChange={(value) => updateColumnFilter(index, 'operator', value)}
                            >
                              <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Operator" />
                              </SelectTrigger>
                              <SelectContent>
                                {operators.map((op) => (
                                  <SelectItem key={op.value} value={op.value}>
                                    {op.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={filter.indicator_r}
                              onValueChange={(value) => updateColumnFilter(index, 'indicator_r', value)}
                            >
                              <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Right Column" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(indicatorGroups).map(([group, items]) => (
                                  <div key={group}>
                                    <div className="px-2 py-1.5 text-sm font-semibold">{group}</div>
                                    {items.map((item) => (
                                      <SelectItem key={item} value={item}>
                                        {item}
                                      </SelectItem>
                                    ))}
                                  </div>
                                ))}
                              </SelectContent>
                            </Select>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeColumnFilter(index)}
                              className="ml-auto"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center p-4 text-gray-500">
                  <p className="mb-4">No custom filters added yet. Click &quot;Add Filter&quot; to create one.</p>
                  <div className="flex justify-center">
                    <Button 
                      onClick={addColumnFilter} 
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Filter
                    </Button>
                  </div>
                </div>
              )}

              {columnFilters.length > 0 && (
                <Button 
                  onClick={addColumnFilter} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Filter
                </Button>
              )}
            </div>
          </div>

          {/* Technical Pattern Filters - Collapsible */}
          <div className="space-y-4 border rounded-lg p-4">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsTechnicalPatternsCollapsed(!isTechnicalPatternsCollapsed)}
            >
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9h18M3 15h18M9 3v18M15 3v18" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="text-lg font-semibold">Technical Patterns</h3>
                <span className="text-sm text-gray-500">
                  ({getAppliedPatternsSummary()})
                </span>
              </div>
              {isTechnicalPatternsCollapsed ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </div>

            {!isTechnicalPatternsCollapsed && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {Object.entries(getTechnicalPatternFilters).map(([patternName, filters]) => (
                  <Button
                    key={patternName}
                    variant={appliedPatterns.includes(patternName) ? "default" : "outline"}
                    className="flex items-center justify-center gap-2 p-4"
                    onClick={() => {
                      handleTechnicalPatternClick(patternName, filters());
                    }}
                  >
                    <span className="capitalize">{patternName.split('_').join(' ')}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Run Button - Only show if there are filters */}
          {showRunButton && (
            <div className="flex flex-col items-center space-y-4">
              <Button
                onClick={handleApplyFilters}
                className="flex items-center gap-2 px-6 py-3"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Running...</span>
                  </div>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Run Filters</span>
                  </>
                )}
              </Button>
              
              {/* Total Results Count */}
              {filtersApplied && (
                <div className="text-center bg-gray-100 dark:bg-gray-800 p-3 rounded-md w-full">
                  <span className="font-semibold"></span> {totalStocks} stocks found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Grid */}
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {loading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="max-w-2xl">
                <SparkAreaStocksLoading />
              </div>
            ))
          ) : stocksData.length > 0 ? (
            stocksData.map((stock, index) => {
              const formattedData = formatStockDataForChartGenerated(stock);
              return (
                <div 
                  key={index} 
                  onClick={() => handleStockClick(stock.stckname)} 
                  className="cursor-pointer"
                >
                  <SparkAreaStocksTrimed
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
            })
          ) : filtersApplied ? (
            <div className="col-span-2 text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">No stocks match your criteria</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <div className="col-span-2 text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Add filters and click &quot;Run Filters&quot;</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Use the search or filter options above to find stocks</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls - Only show if we have results */}
      {totalStocks > 0 && (
        <div className="flex justify-center gap-4 mt-6">
          <Button 
            onClick={handlePrevPage} 
            disabled={page === 1 || loading}
            variant="outline"
          >
            Previous
          </Button>
          <div className="flex items-center px-4">
            <span>Page {page} of {Math.ceil(totalStocks / pageSize) || 1}</span>
          </div>
          <Button 
            onClick={handleNextPage} 
            disabled={page * pageSize >= totalStocks || loading}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}

      {/* Stock Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full overflow-auto">
          <div className="mt-4">
            <StockDetailSideBarPage stockname={stockName} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default StockFilterAndDisplay;