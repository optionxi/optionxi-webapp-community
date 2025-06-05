'use client'

import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { getAlertsBySymbol } from '@/lib/supabaseDB/supabase_alerts'
import { AlertModel } from '@/datamodels/alerts_model'
import { getSentimentStyles } from '../helper-sentiment-styles'
import { StockAlertSingleItem } from '../stock-alert-single'
import EmptyState from '../../atlas/atlas-empty-result'
import { FallbackImage } from '@/components/custom/cust_fallback_image'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

type PageProps = {
  params: {
    symbol: string;
  };
};

const PAGE_SIZE = 10
type SentimentFilter = 'all' | 'bullish' | 'bearish'

export default function StockAlertsSection({ params }: PageProps) {
  const { symbol } = params;
  const router = useRouter()
  const pathname = usePathname() || ''
  const searchParams = useSearchParams()
  
  // Parse URL parameters
  const filterParam = searchParams?.get('filter') as SentimentFilter | null
  const currentFilter = filterParam && ['all', 'bullish', 'bearish'].includes(filterParam) 
    ? filterParam as SentimentFilter 
    : 'all'
  
  const pageParam = searchParams?.get('page')
  const initialPage = pageParam && !isNaN(Number(pageParam)) ? Number(pageParam) : 1
  
  const dateParam = searchParams?.get('date')

  const [alerts, setAlerts] = useState<AlertModel[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<AlertModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    dateParam ? new Date(dateParam) : undefined
  )

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // Update URL with current filters
  const updateUrl = (
    filter: SentimentFilter, 
    page: number, 
    date?: Date
  ) => {
    const params = new URLSearchParams(searchParams?.toString())
    
    if (filter === 'all') params.delete('filter')
    else params.set('filter', filter)
    
    if (page === 1) params.delete('page')
    else params.set('page', page.toString())
    
    if (date) params.set('date', date.toISOString().split('T')[0])
    else params.delete('date')
    
    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    router.push(newUrl)
  }

  // Fetch all alerts for the symbol
  useEffect(() => {
    async function fetchAlerts() {
      try {
        setLoading(true)
        const { data } = await getAlertsBySymbol(symbol)
        setAlerts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch alerts')
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [symbol])

  // Filter and paginate the alerts
  useEffect(() => {
    if (alerts.length === 0) return

    // Apply sentiment filter
    let filtered = [...alerts]
    if (currentFilter !== 'all') {
      filtered = filtered.filter(alert => alert.sentiment === currentFilter)
    }

    // Apply date filter
    if (selectedDate) {
      filtered = filtered.filter(alert => {
        const alertDate = new Date(alert.created_at)
        return alertDate.toDateString() === selectedDate.toDateString()
      })
    }

    // Set total count for pagination
    setTotalCount(filtered.length)

    // Apply pagination
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    setFilteredAlerts(filtered.slice(start, end))
  }, [alerts, currentFilter, selectedDate, currentPage])

  // Update current page when URL param changes
  useEffect(() => {
    if (pageParam && !isNaN(Number(pageParam))) {
      setCurrentPage(Number(pageParam))
    } else {
      setCurrentPage(1)
    }
  }, [pageParam])

  const handleFilterChange = (filter: SentimentFilter) => {
    updateUrl(filter, 1, selectedDate)
  }

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date)
    updateUrl(currentFilter, 1, date)
  }

  const handlePageChange = (page: number) => {
    updateUrl(currentFilter, page, selectedDate)
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-4xl mt-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      {/* Modern header with responsive layout */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Stock info section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20"></div>
              <div className="relative p-2 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <FallbackImage
                  src={`/assets/stockimages/${symbol}.png`}
                  alt={`${symbol} logo`}
                  width={72}
                  height={72}
                  className={cn(
                    "rounded-lg",
                    "transition-all duration-300",
                    "hover:scale-105",
                  )}
                />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                {symbol}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Stock Price Alerts Dashboard
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 w-full md:w-auto">
            <Link href={`/stocks/${symbol}`} className="w-full md:w-auto">
              <button className="w-full group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg text-white">
                <span className="text-sm font-medium">View Details</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter controls */}
      <div className="flex flex-col md:flex-row justify-start items-center mb-6 gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-[200px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2 w-full">
          <Button
            variant={currentFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('all')}
            className="flex-1 md:flex-none"
          >
            All
          </Button>
          <Button
            variant={currentFilter === 'bullish' ? 'default' : 'outline'}
            size="sm"
            className={cn(
              "flex-1 md:flex-none",
              currentFilter === 'bullish' ? 'bg-green-600 hover:bg-green-700' : 'hover:text-green-700'
            )}
            onClick={() => handleFilterChange('bullish')}
          >
            Bullish
          </Button>
          <Button
            variant={currentFilter === 'bearish' ? 'default' : 'outline'}
            size="sm"
            className={cn(
              "flex-1 md:flex-none",
              currentFilter === 'bearish' ? 'bg-red-600 hover:bg-red-700' : 'hover:text-red-700'
            )}
            onClick={() => handleFilterChange('bearish')}
          >
            Bearish
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      ) : filteredAlerts.length > 0 ? (
        <div className="space-y-4">
          {filteredAlerts.map((alert, index) => {
            const styles = getSentimentStyles(alert.sentiment)
            const alertDate = new Date(alert.created_at)
            return StockAlertSingleItem(alert, styles, index, alertDate)
          })}
        </div>
      ) : (
        <EmptyState message={`No alerts found for ${symbol}${currentFilter !== 'all' ? ` with ${currentFilter} sentiment` : ''}${selectedDate ? ` on ${format(selectedDate, 'PPP')}` : ''}`} />
      )}

      {/* Pagination controls */}
      {filteredAlerts.length > 0 && totalPages > 1 && (
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
    </div>
  )
}