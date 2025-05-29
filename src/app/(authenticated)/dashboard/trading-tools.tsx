import React from 'react';
import { GanttChartSquare, ArrowUpCircleIcon, ArrowDownCircleIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TradingHero = () => {
  const tools = [
    {
      title: 'Top Gainers',
      icon: <ArrowUpCircleIcon className="w-6 h-6 text-emerald-500" />,
      description: 'Advancing stocks',
      link: '/top-gainers'
    },
    {
      title: 'Top Losers',
      icon: <ArrowDownCircleIcon className="w-6 h-6 text-red-500" />,
      description: 'Declining stocks',
      link: '/top-losers'
    },
    {
      title: 'Volume Changers',
      icon: <GanttChartSquare className="w-6 h-6 text-cyan-500" />,
      description: 'Monitor volume spikes',
      link: '/top-volume'
    },
    // {
    //   title: 'Long Buildup',
    //   icon: <LineChart className="w-6 h-6 text-blue-500" />,
    //   description: 'Identify bullish patterns',
    //   link: '/long-buildup'
    // },
    // {
    //   title: 'Short Buildup',
    //   icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
    //   description: 'Spot bearish trends',
    //   link: '/short-buildup'
    // },
    // {
    //   title: 'OI Changers',
    //   icon: <Activity className="w-6 h-6 text-orange-500" />,
    //   description: 'Track open interest shifts',
    //   link: '/oi-changers'
    // },
    //  {
    //   title: 'Breakouts',
    //   icon: <Activity className="w-6 h-6 text-orange-500" />,
    //   description: 'Breakouts scanner',
    //   link: '/bollinger-breakouts'
    // },
    //  {
    //   title: 'Market Sentiments',
    //   icon: <Activity className="w-6 h-6 text-orange-500" />,
    //   description: 'Track market sentiments',
    //   link: '/atlas'
    // },
   
  ];

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Advanced Trading Tools
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Professional-grade analysis tools to power your trading decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <a
              key={tool.title}
              href={tool.link}
              className="block transform transition-all duration-300 hover:scale-105"
            >
              <Card className="h-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {tool.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradingHero;