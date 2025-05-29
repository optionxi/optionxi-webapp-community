'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CalendarIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import type { BollingerBreakoutModel } from '@/datamodels/bollinger_model';
import { getBollingerBreakouts, getFilteredBollingerBreakouts, subscribeToBollingerBreakouts } from '@/lib/supabaseDB/supabase_bollingerbreakouts';
import ModernSentimentCard from './bollinger-card';
import { cn } from '@/lib/utils';
import BollingerEmptyState from './bollinger-empty-result';

export default function BollingerBreakoutsPage() {
  const [data, setData] = useState<BollingerBreakoutModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [sentimentFilter, setSentimentFilter] = useState<'bullish' | 'bearish' | null>(null);
  const [filterByEntry, setFilterByEntry] = useState(true); // New state for entry filter
  const pageSize = 10;

  const fetchData = async () => {
    try {
      setLoading(true);
      let result;
      
      if (sentimentFilter) {
        result = await getFilteredBollingerBreakouts(sentimentFilter, page, pageSize, filterByEntry);
      } else {
        const startOfDay = selectedDate ? new Date(selectedDate.setHours(0, 0, 0, 0)).toISOString() : undefined;
        const endOfDay = selectedDate ? new Date(selectedDate.setHours(23, 59, 59, 999)).toISOString() : undefined;
        result = await getBollingerBreakouts(page, pageSize, startOfDay, endOfDay, filterByEntry);
      }
      
      setData(result.data);
      setTotalCount(result.count);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, selectedDate, sentimentFilter, filterByEntry]); // Add filterByEntry to dependencies

  useEffect(() => {
    const unsubscribe = subscribeToBollingerBreakouts((newBreakout) => {
      setData(prevData => {
        if (page === 1) {
          return [newBreakout, ...prevData.slice(0, pageSize - 1)];
        }
        return prevData;
      });
      setTotalCount(prev => prev + 1);
    });

    return () => {
      unsubscribe();
    };
  }, [page, pageSize]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const LoadingSkeleton = () => (
    <div className="grid gap-6">
      {[...Array(6)].map((_, idx) => (
        <Card key={idx} className="w-full">
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-20" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const ErrorState = () => (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to load Bollinger Breakouts. Please try again later.
        <Button variant="outline" className="mt-4" onClick={fetchData}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <CalendarIcon className="h-4 w-4" />
              {selectedDate ? format(selectedDate, 'PP') : 'Select Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setPage(1);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button 
          variant={sentimentFilter === 'bullish' ? 'default' : 'outline'}
          onClick={() => {
            setSentimentFilter(sentimentFilter === 'bullish' ? null : 'bullish');
            setPage(1);
          }}
          className={cn(
            sentimentFilter === 'bullish' ? 'bg-green-600 text-white dark:bg-green-400' : 'text-green-600 dark:text-green-400'
          )}
        >
          Bullish
        </Button>

        <Button 
          variant={sentimentFilter === 'bearish' ? 'default' : 'outline'}
          onClick={() => {
            setSentimentFilter(sentimentFilter === 'bearish' ? null : 'bearish');
            setPage(1);
          }}
          className={cn(
            sentimentFilter === 'bearish' ? 'bg-red-600 text-white dark:bg-red-400' : 'text-red-600 dark:text-red-400'
          )}
        >
          Bearish
        </Button>

        <Button 
          variant="outline"
          onClick={() => {
            setSelectedDate(undefined);
            setSentimentFilter(null);
            setFilterByEntry(false); // Clear entry filter
            setPage(1);
          }}
        >
          Clear Filters
        </Button>
      </div>

      {/* Add the Entry Toggle */}
      <div className="flex items-center gap-2">
        <label htmlFor="entry-toggle" className="text-sm font-medium">
          Show first entries only
        </label>
        <div
          id="entry-toggle"
          onClick={() => setFilterByEntry(!filterByEntry)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            filterByEntry ? 'bg-indigo-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              filterByEntry ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </div>
      </div>

      {error ? (
        <ErrorState />
      ) : loading ? (
        <LoadingSkeleton />
      ) : data.length === 0 ? (
        <BollingerEmptyState  onReset={() => {
          setSelectedDate(undefined);
          setSentimentFilter(null);
          setFilterByEntry(false); // Clear entry filter
          setPage(1);
        }}/>
      ) : (
        <>
          <div className="grid gap-6">
            {data.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ModernSentimentCard item={item}/>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <Button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}