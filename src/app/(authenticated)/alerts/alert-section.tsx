'use client'

import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { AlertModel } from '@/datamodels/alerts_model'
import { getAlerts, subscribeToAlerts } from '@/lib/supabaseDB/supabase_alerts'
import Link from 'next/link'
import { getSentimentStyles } from './helper-sentiment-styles'
import { StockAlertSingleItem } from './stock-alert-single'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import EmptyState from '../atlas/atlas-empty-result'
import { totalstocks } from '@/datamodels/constants'
import { cn } from '@/lib/utils' // Ensure you have this utility for conditional classNames

const PAGE_SIZE = 20
type SentimentFilter = 'all' | 'bullish' | 'bearish'

// Process stock names for dropdown
const stockOptions = Object.entries(totalstocks).map(([key, value]) => {
  const name = typeof value.stock_name === 'string' ? value.stock_name : '';
  return {
    value: key,
    label: name.replace('NSE:', '').replace('-EQ', '').replace('-BE', '')
  };
});


export default function AlertsPage() {
  const router = useRouter()
  const pathname = usePathname() || ''
  const searchParams = useSearchParams()
  
  const filterParam = searchParams?.get('filter') as SentimentFilter | null
  const currentFilter = filterParam && ['all', 'bullish', 'bearish'].includes(filterParam) 
    ? filterParam as SentimentFilter 
    : 'all'
  
  const pageParam = searchParams?.get('page')
  const initialPage = pageParam && !isNaN(Number(pageParam)) ? Number(pageParam) : 1
  
  const stockParam = searchParams?.get('stock')
  const dateParam = searchParams?.get('date')

  const [alerts, setAlerts] = useState<AlertModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedStock, setSelectedStock] = useState<string>(stockParam || 'all')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    dateParam ? new Date(dateParam) : undefined
  )
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [displayStockName, setDisplayStockName] = useState<string>('') // State to store the display name of the selected stock
  const [isSearchFocused, setIsSearchFocused] = useState(false) // New state to track focus

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // Set the displayStockName from searchParams on initial load
  useEffect(() => {
    if (stockParam) {
      const selectedStockOption = stockOptions.find(
        (stock) => stock.value === stockParam
      )
      if (selectedStockOption) {
        setDisplayStockName(selectedStockOption.label) // Set the cleaned-up stock name
      }
    }
  }, [stockParam])

  const updateUrl = (
    filter: SentimentFilter, 
    page: number, 
    stock?: string, 
    date?: Date
  ) => {
    const params = new URLSearchParams(searchParams?.toString())
    
    if (filter === 'all') params.delete('filter')
    else params.set('filter', filter)
    
    if (page === 1) params.delete('page')
    else params.set('page', page.toString())
    
    if (stock && stock !== 'all') params.set('stock', stock)
    else params.delete('stock')
    
    if (date) params.set('date', date.toISOString().split('T')[0])
    else params.delete('date')
    
    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    router.push(newUrl)
  }

  useEffect(() => {
    async function fetchAlerts() {
      try {
        setLoading(true)
        const result = await getAlerts({
          page: currentPage,
          pageSize: PAGE_SIZE,
          sentiment: currentFilter === 'all' ? undefined : currentFilter,
          symbol: selectedStock === 'all' ? undefined : selectedStock,
          date: selectedDate
        })
        
        setAlerts(result.data)
        setTotalCount(result.count)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch alerts')
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [currentFilter, currentPage, selectedStock, selectedDate])

  useEffect(() => {
    if (pageParam && !isNaN(Number(pageParam))) {
      setCurrentPage(Number(pageParam))
    } else {
      setCurrentPage(1)
    }
  }, [pageParam])

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToAlerts((newAlert) => {
      // Only add the new alert if it matches all current filters
      const matchesSentiment = currentFilter === 'all' || newAlert.sentiment === currentFilter
      const matchesStock = selectedStock === 'all' || newAlert.symbol === selectedStock
      const matchesDate = !selectedDate || 
        new Date(newAlert.created_at).toDateString() === selectedDate.toDateString()

      if (matchesSentiment && matchesStock && matchesDate) {
        setAlerts(prevAlerts => {
          const updatedAlerts = [newAlert, ...prevAlerts.slice(0, PAGE_SIZE - 1)]
          return updatedAlerts
        })
        setTotalCount(prev => prev + 1)
      }
    })

    return () => unsubscribe()
  }, [currentFilter, selectedStock, selectedDate])

  const handleFilterChange = (filter: SentimentFilter) => {
    updateUrl(filter, 1, selectedStock, selectedDate)
  }

  const handleStockChange = (stockValue: string, stockLabel: string) => {
    stockValue=stockValue.split(":")[1].split("-")[0];
    setSelectedStock(stockValue) // Update the selected stock state with the original key
    setDisplayStockName(stockLabel) // Update the display name
    updateUrl(currentFilter, 1, stockValue, selectedDate) // Update the URL with the selected stock
    setSearchQuery('') // Clear the search query
    setIsSearchFocused(false) // Reset focus state
  }

  const handleClearStock = () => {
    setSelectedStock('all')
    setDisplayStockName('')
    setSearchQuery('')
    updateUrl(currentFilter, 1, 'all', selectedDate)
  }

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date)
    updateUrl(currentFilter, 1, selectedStock, date)
  }

  const handlePageChange = (page: number) => {
    updateUrl(currentFilter, page, selectedStock, selectedDate)
  }

  const filteredStockOptions = stockOptions.filter(stock =>
    stock.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      {/* Responsive Filter Section */}
      <div className="flex flex-col md:flex-row justify-start items-center mb-6 gap-4 w-full">
        {/* Search Input */}
        <div className="w-full md:flex-1 relative">
          <input
            type="text"
            placeholder="Search for a stock..."
            value={isSearchFocused ? searchQuery : (searchQuery || displayStockName)}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              setIsSearchFocused(true)
              if (!searchQuery) setSearchQuery('')
            }}
            onBlur={() => {
              setTimeout(() => {
                setIsSearchFocused(false)
              }, 200)
            }}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
          />
          {(searchQuery || isSearchFocused) && (
            <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 border rounded max-h-60 overflow-y-auto shadow-lg z-10">
              {/* Add an option to show all stocks */}
              <div
                onClick={handleClearStock}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer font-medium text-gray-900 dark:text-gray-100"
              >
                Show All Stocks
              </div>
              
              {filteredStockOptions.map((stock) => (
                <div
                  key={stock.value}
                  onClick={() => handleStockChange(stock.value, stock.label)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100"
                >
                  {stock.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date Picker */}
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

        {/* Sentiment Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto">
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
      
      {/* Alerts List */}
      <div className="space-y-4">
        {loading ? (
          <>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="mb-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </div>
            ))}
          </>
        ) : (
          <div className="space-y-4">
            {alerts.length > 0 ? (
              alerts.map((alert, index) => {
                const styles = getSentimentStyles(alert.sentiment)
                const alertDate = new Date(alert.created_at)
                
                return (
                  <Link 
                    key={alert.id}
                    href={`/alerts/${alert.symbol}`}
                    className="block hover:scale-[1.01] transition-transform"
                  >
                    {StockAlertSingleItem(alert, styles, index, alertDate)}
                  </Link>
                )
              })
            ) : (
              <EmptyState message='No alerts was found, try again sometime later'/>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
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
    </div>
  )
}