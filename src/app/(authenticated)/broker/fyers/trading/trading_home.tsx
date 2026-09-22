// trading_home.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  User, 
  ShoppingBag, 
  TrendingUp, 
} from 'lucide-react'
import FyersProfilePage from './frag/fyers_profile'
import FyersOrdersPage from './frag/fyers_orders'
import FyersPortfolioPage from './frag/fyers_portfolio'

// Navigation items configuration
const navigationItems = [
 { 
    id: 'profile', 
    label: 'Profile', 
    icon: User
  },
  { 
    id: 'portfolio', 
    label: 'Portfolio', 
    icon: TrendingUp
  },
  { 
    id: 'orders', 
    label: 'Orders', 
    icon: ShoppingBag
  }
] as const

type TabId = typeof navigationItems[number]['id']

interface ContentLayoutProps {
  children?: React.ReactNode
}

export default function FyersTradingHomePage({ }: ContentLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabId>('profile')

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <FyersProfilePage />
      case 'orders':
        return <FyersOrdersPage />
      case 'portfolio':
        return <FyersPortfolioPage />
      default:
        return <FyersPortfolioPage />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Tabs */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 relative h-auto rounded-none border-b-2 ${
                    isActive
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}