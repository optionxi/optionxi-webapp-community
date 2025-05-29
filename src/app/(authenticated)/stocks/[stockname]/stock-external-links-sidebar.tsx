import { Card, CardContent } from "@/components/ui/card";
import { Activity, BookAudioIcon, GanttChartSquare, LineChart, List, Newspaper } from "lucide-react";

export function StockExternalLinksSideBar({ stockName }: { stockName: string }){

    const tools = [
        {
          title: 'Tradview Chart',
          icon: <LineChart className="w-6 h-6 text-emerald-500" />,
          description: 'Advance candle stick chart from tradingview',
          link: `https://in.tradingview.com/symbols/NSE-${stockName}`,
        },
        {
          title: 'Option Chain',
          icon: <List className="w-6 h-6 text-red-500" />,
          description: 'Option chain data from NSE',
          link: `https://www.nseindia.com/get-quotes/derivatives?symbol=${stockName}`,
        },
        {
          title: 'Quotes',
          icon: <BookAudioIcon className="w-6 h-6 text-blue-500" />,
          description: 'Quotes, Financials from NSE',
          link:  `https://www.nseindia.com/get-quotes/equity?symbol=${stockName}`,
        },
        {
          title: 'Market News',
          icon: <Newspaper className="w-6 h-6 text-purple-500" />,
          description: 'Yahoo market news',
          link: `https://finance.yahoo.com/quote/${stockName}.NS/news/`
        },
        {
          title: 'Technical Analysis',
          icon: <Activity className="w-6 h-6 text-orange-500" />,
          description: 'Detailed stock page in tradingview',
          link: `https://in.tradingview.com/symbols/NSE-${stockName}`,
        },
        {
          title: 'More Details',
          icon: <GanttChartSquare className="w-6 h-6 text-cyan-500" />,
          description: 'Detailed stock page in screeners.in',
          link: `https://www.screener.in/company/${stockName}/`,
        }
      ];

      
      
    return(
      <div className="grid grid-cols-1 gap-2 md:gap-6">
          {tools.map((tool) => (
            <a
              key={tool.title}
              href={tool.link}
              target="_blank"
              className="block transform transition-all duration-300 hover:scale-105"
            >
              <Card className="h-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors shadow-sm">
                <CardContent className="p-2 lg:p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                      {tool.icon}
                    </div>
                    <div>
                    <h3 className="text-xs sm:text-lg font-semibold text-gray-900 dark:text-white">
                        {tool.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm hidden sm:block">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
          <br/>
        </div>
    );
    
}