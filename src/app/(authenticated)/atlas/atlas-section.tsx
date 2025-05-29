'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { getAtlasOutputs, subscribeToAtlasOutputs } from '@/lib/supabaseDB/supabase_atlas';
import { AtlasOutput } from '@/datamodels/atlas_model';
import { SignalCard } from './atlas-signal-card';
import { AtlasError, AtlasLoadingSkeleton } from './atlas-loading-error';
import EmptyState from './atlas-empty-result';

type TabValue = 'All' | 'Bull' | 'Bear';

export default function AtlasOutputDisplay(): JSX.Element {
  const [outputs, setOutputs] = useState<AtlasOutput[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [strongTrendOnly, setStrongTrendOnly] = useState<boolean>(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pageSize = 10;

  useEffect(() => {
    fetchOutputs();
    const unsubscribe = subscribeToAtlasOutputs((newOutput: AtlasOutput) => {
      // Only add new output if it matches all current filters
      if ((!selectedDate || new Date(newOutput.created_at).toDateString() === selectedDate.toDateString()) &&
        (!strongTrendOnly || newOutput.probability > 50)) {
        setOutputs(prev => [newOutput, ...prev].slice(0, pageSize));
      }
    });
    return () => unsubscribe();
  }, [page, selectedDate, strongTrendOnly]);

  const fetchOutputs = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { data, count } = await getAtlasOutputs(page, pageSize, selectedDate, strongTrendOnly);
      setOutputs(data);
      setTotalPages(Math.ceil(count / pageSize));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: TabValue): void => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('signal', value);
    router.push(`?${params.toString()}`);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setPage(1);
  };

  const handleStrongTrendToggle = (checked: boolean) => {
    setStrongTrendOnly(checked);
    setPage(1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const handleResetFilters = () => {
    setSelectedDate(undefined);
    setStrongTrendOnly(false);
    setPage(1);
    const params = new URLSearchParams(searchParams?.toString());
    params.delete('signal');
    router.push(`?${params.toString()}`);
  };

  if (loading) {
    return <AtlasLoadingSkeleton />;
  }

  if (error) {
    return <AtlasError error={error} onRetry={fetchOutputs} />;
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between items-start sm:items-center mb-4">
        {/* Left side with date picker and toggle */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto flex items-center gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="truncate">
                  {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="flex items-center space-x-2">
            <Switch
              id="strong-trend"
              checked={strongTrendOnly}
              onCheckedChange={handleStrongTrendToggle}
            />
            <Label htmlFor="strong-trend" className="whitespace-nowrap">
              Show Strong Trend Only
            </Label>
          </div>
        </div>

        {/* Right side with clear filter button */}
        {/* <div className="w-full sm:w-auto flex justify-end">
          {(selectedDate || strongTrendOnly) && (
            <Button
              variant="ghost"
              onClick={handleResetFilters}
              size="sm"
            >
              Clear Filters
            </Button>
          )}
        </div> */}
      </div>

      {/* Tabs Section */}
      <Tabs
        defaultValue={(searchParams?.get('signal') as TabValue) || 'All'}
        className="w-full"
        onValueChange={(value) => handleTabChange(value as TabValue)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="All">All Signals</TabsTrigger>
          <TabsTrigger value="Bull">Bullish</TabsTrigger>
          <TabsTrigger value="Bear">Bearish</TabsTrigger>
        </TabsList>

        {(['All', 'Bull', 'Bear'] as const).map((tab) => (
          <TabsContent key={tab} value={tab}>
            {outputs.filter(output =>
                    tab === 'All' || output.type === tab
                  ).length === 0 ? (
              <EmptyState
                message={
                  `No ${tab.toLowerCase()} signals found${selectedDate ? ` for ${format(selectedDate, 'MMMM d, yyyy')}` : ''}${strongTrendOnly ? ' with strong trend' : ''}`
                }
                onReset={handleResetFilters}
                showResetButton={!!(selectedDate || strongTrendOnly || searchParams?.get('signal'))}
              />
            ) : (
              <div className="space-y-4">
                {outputs
                  .filter(output =>
                    tab === 'All' || output.type === tab
                  )
                  .map((output, index) => (
                    <div key={output.id} className="relative">
                      <SignalCard output={output} index={index} />
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Pagination Section */}
      <div className="flex items-center justify-between mt-6">
        <Button
          onClick={handlePreviousPage}
          disabled={page === 1}
          variant="outline"
          className="w-24"
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={page === totalPages}
          variant="outline"
          className="w-24"
        >
          Next
        </Button>
      </div>
    </div>
  );
}