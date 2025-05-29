import { Button } from "@/components/ui/button"
import { LineChartIcon as ChartLineUp, ArrowRight } from 'lucide-react'

export default function EmptyWatchlistPrompt() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-75 blur-xl animate-pulse"></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg">
          <ChartLineUp className="w-12 h-12 text-blue-500 dark:text-blue-400" />
        </div>
      </div>
      <h2 className="mt-8 text-2xl font-bold text-gray-800 dark:text-gray-100">Your Watchlist is Empty</h2>
      <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg max-w-md">
        Select a stock from your watchlist to view detailed information and start tracking your investments.
      </p>
      <Button 
        onClick={() => {
          // Define an action here if needed, e.g., focusing on the watchlist area
        }}
        className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        View Watchlist
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </div>
  )
}