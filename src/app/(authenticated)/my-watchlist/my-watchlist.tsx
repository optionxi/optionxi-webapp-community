'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NIFTY50_STOCKS } from "@/datamodels/constants"
import { NIFTY200_STOCKS } from "@/datamodels/constants"
import StockDetailPageWatchList from "./stockdetail-page-watch"
import EmptyWatchlistPrompt from './no-stock-selected'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

export default function MyWatchListPage() {
  const [stockName, setStockName] = useState("")
  const router = useRouter()

  const handleStockClick = (stock: string, type: 'n50' | 'n200') => {
    const stockSymbol = stock.split(":")[1].split("-")[0]
    if (window.innerWidth < 768) {
      router.push(`/${type === 'n50' ? 'nifty-50' : 'nifty-200'}/${stockSymbol}`)
    } else {
      setStockName(stock)
    }
  }

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-3xl font-bold mb-0 lg:mb-6"></h1>
      <div className="flex gap-6">
      <div className="w-full md:w-1/3">
          <Tabs defaultValue="nifty50" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="nifty50">Nifty 50</TabsTrigger>
              <TabsTrigger value="nifty200">Nifty 200</TabsTrigger>
            </TabsList>
            
            <TabsContent value="nifty50">
              <ScrollArea className="h-[calc(100vh-200px)] rounded-md border p-4">
                {NIFTY50_STOCKS.map((stock, index) => {
                  const symbol = stock.split(":")[1].split("-")[0]
                  return (
                    <Card 
                      key={index} 
                      className="mb-4 cursor-pointer hover:bg-accent"
                      onClick={() => handleStockClick(stock, 'n50')}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 relative">
                            <Image
                              width={60}
                              height={60}
                              src={`/assets/stockimages/${symbol}.png`}
                              alt={symbol}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{symbol}</CardTitle>
                            <CardDescription>{stock.split(":")[0]}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )
                })}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="nifty200">
              <ScrollArea className="h-[calc(100vh-200px)] rounded-md border p-4">
                {NIFTY200_STOCKS.map((stock, index) => {
                  const symbol = stock.split(":")[1].split("-")[0]
                  return (
                    <Card 
                      key={index} 
                      className="mb-4 cursor-pointer hover:bg-accent"
                      onClick={() => handleStockClick(stock, 'n200')}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 relative">
                            <Image
                              src={`/assets/stockimages/${symbol}.png`}
                              width={60}
                              height={60}
                              alt={symbol}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{symbol}</CardTitle>
                            <CardDescription>{stock.split(":")[0]}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )
                })}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-2/3 hidden md:block">
          {stockName ? (
            <Card className="h-full"> 
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 relative">
                      <Image 
                        src={`/assets/stockimages/${stockName.split(":")[1].split("-")[0]}.png`} 
                        alt={stockName} 
                        fill 
                        className="object-contain" 
                      />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">
                        {stockName.split(":")[1].split("-")[0]}
                      </CardTitle>
                      <CardDescription>
                        <Badge variant="outline" className="mr-2">
                          {stockName.split(":")[0]}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/stocks/${stockName.split(":")[1].split("-")[0].toUpperCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      View full page
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <StockDetailPageWatchList stockname={stockName.split(":")[1].split("-")[0]} />
              </CardContent>
            </Card>
          ) : (
            <EmptyWatchlistPrompt />
          )}
        </div>
      </div>
    </div>
  )
}