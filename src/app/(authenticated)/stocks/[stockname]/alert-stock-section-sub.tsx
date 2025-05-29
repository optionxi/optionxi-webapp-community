'use client'

import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { getAlertsBySymbol } from '@/lib/supabaseDB/supabase_alerts'
import { AlertModel } from '@/datamodels/alerts_model'
import EmptyState from '../../atlas/atlas-empty-result'
import { StockAlertSingleItem } from '../../alerts/stock-alert-single'
import { getSentimentStyles } from '../../alerts/helper-sentiment-styles'
import { CardTitle } from '@/components/ui/card'
import { Bell } from 'lucide-react'
import Link from 'next/link'

interface StockAlertsPageProps {
  symbol: string
}

export default function StockAlertsSectionSub({ symbol }: StockAlertsPageProps) {
  const [alerts, setAlerts] = useState<AlertModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAlerts() {
      try {
        setLoading(true)
        const { data } = await getAlertsBySymbol(symbol,1,5)
        setAlerts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch alerts')
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [symbol])

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
       <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold tracking-tight">
            Stock Alerts
          </CardTitle>
        </div>
        <Link href={`/alerts/${symbol}`} passHref>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 cursor-pointer">
            <span className="text-sm font-semibold text-white">View more</span>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </div>
        </Link>
      </div>
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      ) : alerts.length>0?(
        <div className="space-y-4">
          {alerts.map((alert, index) => {
            const styles = getSentimentStyles(alert.sentiment)
            const alertDate = new Date(alert.created_at)
            return (
              StockAlertSingleItem(alert, styles, index, alertDate)
            )
          })}
        </div>
      ):(<EmptyState message={`No alerts found for ${symbol}`}/>)}
    </div>
  )
}