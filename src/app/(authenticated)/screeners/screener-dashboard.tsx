'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  Play,
  ChevronDown,
  ChevronUp,
  Plus,
  TrendingUp,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import SparkAreaStocksLoading from '@/components/chart/chart-stock-loading';
import StockDetailSideBarPage from '@/components/custom/cust_sidebar_stockdetails';
import { formatStockDataForChartGenerated } from '@/lib/supabaseDB/helper_formatdata';
import {
  fetchStockData,
  fetchTotalStockCount,
  getTechnicalPatternFilters,
} from '@/lib/supabaseDB/supabase_customscanner';
import { ColumnComparisonFilter } from '@/datamodels/filter_model';
import { GeneratedDataModel } from '@/datamodels/generatedvalue_model';
import SparkAreaStocksTrimed from '@/components/chart/chart-stock-single-trim';
import { cn } from '@/lib/utils';

type TechnicalPatternKey =
  | 'breakout'
  | 'bullishMomentum'
  | 'volumeSpike'
  | 'aboveEMA'
  | 'deathCross';

const PATTERN_META: Record<
  string,
  { label: string; icon: React.ReactNode; tone: string }
> = {
  breakout: {
    label: 'Breakout',
    icon: <TrendingUp className="h-4 w-4" />,
    tone: 'from-emerald-500/15 to-emerald-500/5 text-emerald-500 border-emerald-500/30',
  },
  bullishMomentum: {
    label: 'Bullish Momentum',
    icon: <Sparkles className="h-4 w-4" />,
    tone: 'from-teal-500/15 to-teal-500/5 text-teal-500 border-teal-500/30',
  },
  volumeSpike: {
    label: 'Volume Spike',
    icon: <LayoutGrid className="h-4 w-4" />,
    tone: 'from-amber-500/15 to-amber-500/5 text-amber-500 border-amber-500/30',
  },
  aboveEMA: {
    label: 'Above EMA',
    icon: <TrendingUp className="h-4 w-4" />,
    tone: 'from-sky-500/15 to-sky-500/5 text-sky-500 border-sky-500/30',
  },
  deathCross: {
    label: 'Death Cross',
    icon: <TrendingUp className="h-4 w-4 rotate-180" />,
    tone: 'from-rose-500/15 to-rose-500/5 text-rose-500 border-rose-500/30',
  },
};

const OPERATORS = [
  { value: 'gt', label: 'Greater than', symbol: '>' },
  { value: 'lt', label: 'Less than', symbol: '<' },
  { value: 'eq', label: 'Equal to', symbol: '=' },
  { value: 'gte', label: 'Greater than or equal', symbol: '≥' },
  { value: 'lte', label: 'Less than or equal', symbol: '≤' },
];

const INDICATOR_GROUPS: Record<string, string[]> = {
  Price: ['open', 'close', 'high', 'low'],
  'Moving Averages': [
    'ema10', 'ema20', 'ema50', 'ema100', 'ema150', 'ema200',
    'sma10', 'sma20', 'sma50', 'sma100', 'sma150', 'sma200',
  ],
  Volume: ['vol', 'curr_month_vol', 'curr_week_vol', 'curr_day_sma5_volume'],
  RSI: ['rsi14', 'curr_week_rsi14'],
  Historical: ['max_250_high', 'min_250_low', 'week_max_52_high', 'week_min_52_low'],
  'Previous Days': [
    'prev_day_close', 'prev_day2_close', 'prev_day3_close', 'prev_day4_close', 'prev_day5_close',
    'prev_day_high', 'prev_day2_high', 'prev_day3_high', 'prev_day4_high', 'prev_day5_high',
    'prev_day_low', 'prev_day2_low', 'prev_day3_low', 'prev_day4_low', 'prev_day5_low',
    'prev_day_vol', 'prev_day2_vol', 'prev_day3_vol', 'prev_day4_vol', 'prev_day5_vol',
  ],
};

const PAGE_SIZE = 10;

const IndicatorSelect = ({
  value,
  placeholder,
  onChange,
  className,
}: {
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  className?: string;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className={cn('rounded-lg border-border/60 bg-background/60', className)}>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {Object.entries(INDICATOR_GROUPS).map(([group, items]) => (
        <div key={group}>
          <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {group}
          </div>
          {items.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </div>
      ))}
    </SelectContent>
  </Select>
);

const StockFilterAndDisplay = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [columnFilters, setColumnFilters] = useState<ColumnComparisonFilter[]>([]);
  const [collapsedFilters, setCollapsedFilters] = useState<boolean[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stocksData, setStocksData] = useState<GeneratedDataModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [stockName, setStockName] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalStocks, setTotalStocks] = useState(0);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [isPatternsCollapsed, setIsPatternsCollapsed] = useState(false);
  const [appliedPatterns, setAppliedPatterns] = useState<string[]>([]);

  const getOperatorSymbol = (value: string) =>
    OPERATORS.find((op) => op.value === value)?.symbol ?? value;

  const getFilterSummary = (filter: ColumnComparisonFilter) => {
    if (!filter.indicator_l || !filter.operator || !filter.indicator_r) return 'Incomplete filter';
    return `${filter.indicator_l} ${getOperatorSymbol(filter.operator)} ${filter.indicator_r}`;
  };

  const isFilterComplete = (filter: ColumnComparisonFilter) =>
    Boolean(filter.indicator_l && filter.operator && filter.indicator_r);

  const updateUrlWithFilters = (indicator = '') => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (indicator) {
      params.set('indicator', indicator);
    } else if (columnFilters.length > 0) {
      params.set('filters', JSON.stringify(columnFilters));
    }
    if (page > 1) params.set('page', page.toString());

    const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
    router.push(newUrl, { scroll: false });
  };

  const fetchAndSetStockData = async () => {
    if (!searchTerm && columnFilters.length === 0) {
      setStocksData([]);
      setTotalStocks(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await fetchStockData(searchTerm, columnFilters, page, PAGE_SIZE);
      const { count } = await fetchTotalStockCount(searchTerm, columnFilters);

      setStocksData(data);
      setTotalStocks(count);
      setFiltersApplied(true);

      toast({
        title: 'Screener results',
        description: `Found ${count} stock${count === 1 ? '' : 's'} matching your criteria`,
        duration: 3000,
        className: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setStocksData([]);
      setTotalStocks(0);
      toast({
        title: 'Something went wrong',
        description: "Couldn't fetch stock data. Try again in a moment.",
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
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
        setCollapsedFilters(
          parsedFilters.map((filter: ColumnComparisonFilter) => isFilterComplete(filter))
        );
      } catch (e) {
        console.error('Error parsing filters from URL', e);
      }
    }

    if (indicatorParam) {
      const isValidPattern = (key: string): key is TechnicalPatternKey =>
        ['breakout', 'bullishMomentum', 'volumeSpike', 'aboveEMA', 'deathCross'].includes(key);

      if (isValidPattern(indicatorParam)) {
        const patternFilters = getTechnicalPatternFilters[indicatorParam]();
        setColumnFilters(patternFilters);
        setCollapsedFilters(patternFilters.map(() => true));
        setAppliedPatterns([indicatorParam]);
        setIsPatternsCollapsed(true);
      } else {
        console.warn(`Invalid pattern: ${indicatorParam}`);
        setColumnFilters([]);
      }
    }

    if (search || filtersParam || indicatorParam) {
      setTimeout(() => fetchAndSetStockData(), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filtersApplied) {
      fetchAndSetStockData();
      updateUrlWithFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    setCollapsedFilters((prev) => {
      let changed = false;
      const next = columnFilters.map((filter, index) => {
        if (isFilterComplete(filter) && !prev[index]) {
          changed = true;
          return true;
        }
        return prev[index] ?? false;
      });
      return changed ? next : prev;
    });
  }, [columnFilters]);

  const addColumnFilter = () => {
    setColumnFilters((prev) => [...prev, { indicator_l: '', operator: '', indicator_r: '' }]);
    setCollapsedFilters((prev) => [...prev, false]);
  };

  const removeColumnFilter = (index: number) => {
    setColumnFilters((prev) => prev.filter((_, i) => i !== index));
    setCollapsedFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const updateColumnFilter = (
    index: number,
    field: keyof ColumnComparisonFilter,
    value: string
  ) => {
    setColumnFilters((prev) =>
      prev.map((filter, i) => (i === index ? { ...filter, [field]: value } : filter))
    );
  };

  const toggleFilterCollapse = (index: number) => {
    setCollapsedFilters((prev) => prev.map((c, i) => (i === index ? !c : c)));
  };

  const handleStockClick = (stock: string) => {
    setStockName(stock);
    setIsSheetOpen(true);
  };

  const handleNextPage = () => setPage((p) => p + 1);
  const handlePrevPage = () => setPage((p) => Math.max(p - 1, 1));

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
    if (columnFilters.length === 0 && searchTerm === '') return;
    setPage(1);
    updateUrlWithFilters();
    await fetchAndSetStockData();
  };

  const handleTechnicalPatternClick = (patternName: string, pattern: ColumnComparisonFilter[]) => {
    setColumnFilters(pattern);
    setCollapsedFilters(pattern.map(() => true));
    setAppliedPatterns([patternName]);
    setIsPatternsCollapsed(true);
    updateUrlWithFilters(patternName);
    setTimeout(() => fetchAndSetStockData(), 0);
  };

  const showRunButton = columnFilters.length > 0 || searchTerm !== '';
  const completeFilterCount = columnFilters.filter(isFilterComplete).length;
  const totalPages = Math.ceil(totalStocks / PAGE_SIZE) || 1;

  return (
    <div className="space-y-6">
      <Card className="w-full overflow-hidden rounded-2xl border-border/60 shadow-sm">
        {/* Header strip with subtle gradient accent */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
              Screener
            </CardTitle>
            {(completeFilterCount > 0 || appliedPatterns.length > 0) && (
              <Button
                onClick={handleClearFilters}
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground hover:text-rose-500"
              >
                <X className="h-3.5 w-3.5" />
                Clear all
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search stocks by name or symbol…"
              className="h-11 rounded-xl border-border/60 bg-background/60 pl-10 text-sm focus-visible:ring-emerald-500/40"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleApplyFilters();
              }}
            />
          </div>

          {/* Custom filters */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="mb-3 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Custom filters</h3>
              {completeFilterCount > 0 && (
                <Badge variant="secondary" className="rounded-full px-2 py-0 text-[11px] font-medium">
                  {completeFilterCount} active
                </Badge>
              )}
            </div>

            <div className="space-y-2.5">
              {columnFilters.length > 0 ? (
                columnFilters.map((filter, index) => {
                  const complete = isFilterComplete(filter);
                  const collapsed = collapsedFilters[index] && complete;

                  return (
                    <div
                      key={index}
                      className={cn(
                        'rounded-lg border transition-all duration-200',
                        collapsed
                          ? 'border-emerald-500/25 bg-emerald-500/5'
                          : 'border-border/60 bg-background'
                      )}
                    >
                      {collapsed ? (
                        <button
                          type="button"
                          onClick={() => toggleFilterCollapse(index)}
                          className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left"
                        >
                          <span className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {getFilterSummary(filter)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeColumnFilter(index);
                              }}
                              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                            >
                              <X className="h-3.5 w-3.5" />
                            </span>
                          </span>
                        </button>
                      ) : (
                        <div className="flex flex-col gap-2.5 p-3.5 sm:flex-row sm:items-center">
                          <IndicatorSelect
                            value={filter.indicator_l}
                            placeholder="Left indicator"
                            onChange={(v) => updateColumnFilter(index, 'indicator_l', v)}
                            className="sm:w-[190px]"
                          />
                          <Select
                            value={filter.operator}
                            onValueChange={(v) => updateColumnFilter(index, 'operator', v)}
                          >
                            <SelectTrigger className="rounded-lg border-border/60 bg-background/60 sm:w-[150px]">
                              <SelectValue placeholder="Operator" />
                            </SelectTrigger>
                            <SelectContent>
                              {OPERATORS.map((op) => (
                                <SelectItem key={op.value} value={op.value}>
                                  <span className="mr-1.5 font-mono text-muted-foreground">{op.symbol}</span>
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <IndicatorSelect
                            value={filter.indicator_r}
                            placeholder="Right indicator"
                            onChange={(v) => updateColumnFilter(index, 'indicator_r', v)}
                            className="sm:w-[190px]"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeColumnFilter(index)}
                            className="text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 sm:ml-auto"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border/60 py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No custom filters yet — compare any two indicators to build one.
                  </p>
                  <Button onClick={addColumnFilter} size="sm" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Add filter
                  </Button>
                </div>
              )}

              {columnFilters.length > 0 && (
                <Button
                  onClick={addColumnFilter}
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5 border-dashed"
                >
                  <Plus className="h-4 w-4" />
                  Add another filter
                </Button>
              )}
            </div>
          </div>

          {/* Technical patterns */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <button
              type="button"
              onClick={() => setIsPatternsCollapsed(!isPatternsCollapsed)}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Technical patterns</h3>
                {appliedPatterns.length > 0 && (
                  <Badge variant="secondary" className="rounded-full px-2 py-0 text-[11px] font-medium">
                    {PATTERN_META[appliedPatterns[0]]?.label ?? appliedPatterns[0]}
                  </Badge>
                )}
              </div>
              {isPatternsCollapsed ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {!isPatternsCollapsed && (
              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(getTechnicalPatternFilters).map(([patternName, filters]) => {
                  const meta = PATTERN_META[patternName] ?? {
                    label: patternName,
                    icon: <TrendingUp className="h-4 w-4" />,
                    tone: 'from-slate-500/15 to-slate-500/5 text-slate-500 border-slate-500/30',
                  };
                  const active = appliedPatterns.includes(patternName);

                  return (
                    <button
                      key={patternName}
                      type="button"
                      onClick={() => handleTechnicalPatternClick(patternName, filters())}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg border px-3.5 py-3 text-left text-sm font-medium transition-all duration-200',
                        active
                          ? cn('bg-gradient-to-br shadow-sm', meta.tone)
                          : 'border-border/60 bg-background text-foreground/80 hover:border-border hover:bg-muted/40'
                      )}
                    >
                      {meta.icon}
                      {meta.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Run + summary */}
          {showRunButton && (
            <div className="flex flex-col items-center gap-3 pt-1">
              <Button
                onClick={handleApplyFilters}
                disabled={loading}
                size="lg"
                className="w-full gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm hover:from-emerald-500 hover:to-teal-500 sm:w-auto sm:px-8"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Running…
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run screener
                  </>
                )}
              </Button>

              {filtersApplied && !loading && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{totalStocks}</span> stock
                  {totalStocks === 1 ? '' : 's'} matched
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mx-auto">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  className="cursor-pointer transition-transform duration-150 hover:-translate-y-0.5"
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
                      Performance: value,
                    }))}
                    className="max-w-2xl"
                  />
                </div>
              );
            })
          ) : filtersApplied ? (
            <div className="col-span-full flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border/60 bg-muted/20 p-10 text-center">
              <h3 className="text-base font-medium">No stocks match your criteria</h3>
              <p className="text-sm text-muted-foreground">
                Try loosening a filter or searching a different term.
              </p>
            </div>
          ) : (
            <div className="col-span-full flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border/60 bg-muted/20 p-10 text-center">
              <Search className="h-6 w-6 text-muted-foreground" />
              <h3 className="text-base font-medium">Add filters and run the screener</h3>
              <p className="text-sm text-muted-foreground">
                Search, build a comparison, or pick a technical pattern to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalStocks > 0 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            onClick={handlePrevPage}
            disabled={page === 1 || loading}
            variant="outline"
            size="sm"
            className="rounded-lg"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page <span className="font-medium text-foreground">{page}</span> of {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={page * PAGE_SIZE >= totalStocks || loading}
            variant="outline"
            size="sm"
            className="rounded-lg"
          >
            Next
          </Button>
        </div>
      )}

      {/* Stock detail sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full overflow-auto sm:max-w-lg">
          <div className="mt-4">
            <StockDetailSideBarPage stockname={stockName} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default StockFilterAndDisplay;