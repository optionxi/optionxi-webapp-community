import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp } from "lucide-react"
import Link from 'next/link'

interface AnalyticCardProps {
  title: string
  value: string
  icon: React.ReactNode
  change?: string
  changeDirection?: 'up' | 'down' | 'neutral'
  link: string
}

export const AnalyticCard = ({ title, value, icon, change, changeDirection, link }: AnalyticCardProps) => (
  <Link href={link} passHref>
    <Card className="overflow-hidden relative group cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors duration-300">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        {change && (
          <p className={`text-xs ${
            changeDirection === 'up' ? 'text-green-600 dark:text-green-400' : 
            changeDirection === 'down' ? 'text-red-600 dark:text-red-400' : 
            'text-muted-foreground'
          } flex items-center`}>
            {changeDirection === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
            {changeDirection === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
            {change}
          </p>
        )}
      </CardContent>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </Card>
  </Link>
)
