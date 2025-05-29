'use client';

import { useTheme } from 'next-themes';
import React, { useEffect } from 'react';

type StockData = {
  stock_name: string;
  full_stock_name: string;
};

interface StockDetailsSectionProps {
  stock: StockData;
}

type TradingViewConfig = {
  interval?: string;
  width?: string | number;
  isTransparent?: boolean;
  height?: number;
  symbol?: string;
  showIntervalTabs?: boolean;
  displayMode?: string;
  locale?: string;
  colorTheme?: string;
  largeChartUrl?: string;
};


const TradingViewWidget = ({ scriptId, config }: { scriptId: string; config: TradingViewConfig }) => {
  useEffect(() => {
    const container = document.querySelector(`#tv-widget-${scriptId}`);
  
    // Clear any existing script within the container
    if (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
  
    // Create and append the new script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${scriptId}.js`;
    script.async = true;
    script.innerHTML = JSON.stringify(config);
    
    if (container) {
      container.appendChild(script);
    }
  
    return () => {
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, [scriptId, config]); // Include scriptId and config in dependencies
  

  return (
    <div className="tradingview-widget-container">
      <div id={`tv-widget-${scriptId}`} className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://in.tradingview.com/" rel="noopener nofollow" target="_blank" className="text-blue-500">
          Track all markets on TradingView
        </a>
      </div>
    </div>
  );
};

export const StockDetailsTradingviewSection: React.FC<StockDetailsSectionProps> = ({ stock }) => {
  const { theme } = useTheme();

  const fullSymbol = stock.stock_name.split("-")[0].split(":")[1];

  const widgetConfigs = {
    'technical-analysis': {
      interval: "1m",
      width: "100%",
      isTransparent: false,
      height: 400,
      symbol: fullSymbol,
      showIntervalTabs: true,
      displayMode: "single",
      locale: "en",
      colorTheme: theme === 'dark' ? 'dark' : 'light'
    },
    'financials': {
      isTransparent: false,
      largeChartUrl: "",
      displayMode: "regular",
      width: "100%",
      height: 500,
      colorTheme: theme === 'dark' ? 'dark' : 'light',
      symbol: fullSymbol,
      locale: "en"
    },
    'symbol-profile': {
      width: "100%",
      height: 400,
      isTransparent: false,
      colorTheme: theme === 'dark' ? 'dark' : 'light',
      symbol: fullSymbol,
      locale: "en"
    }
  };

  return (
    <section className="w-full min-h-screen">
        
      {/* Header section */}
      <div className="w-full ">
        <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2 py-8">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-2 dark:text-white">
              {/* {stock.full_stock_name} */}
              Trading Tools
            </h1>
            <p className="text-xl text-blue-600 dark:text-blue-400">
              {/* {stock.stock_name.split(":")[1].split("-")[0]} */}
              Get the overall idea of the stock from the websites
            </p>
          </div>
        </div>
      </div>
      {/* Some clickable button section */}
      {/* Content section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Technical Analysis Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-medium dark:text-white mb-4">
                Company Profile
              </h3>
              <TradingViewWidget scriptId="symbol-profile" config={widgetConfigs['symbol-profile']} />
            </div>

            {/* Financials Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">
                Financial Data
              </h2>
              <TradingViewWidget scriptId="financials" config={widgetConfigs['financials']} />
            </div>
          </div>

          {/* Sidebar content */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg sticky top-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">
                Technical Analysis
              </h2>
              <TradingViewWidget scriptId="technical-analysis" config={widgetConfigs['technical-analysis']} />
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default StockDetailsTradingviewSection;
