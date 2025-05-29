import React from 'react';
import { FallbackImage } from './cust_fallback_image';
import { cn } from "@/lib/utils";

interface CardProps {
  logoUrl: string;
  title: string;
  price: number;
  priceChange: number;
  percentage: number;
}

const CustomStockItemWatchlist: React.FC<CardProps> = ({
  logoUrl,
  title,
}) => {
  const stockSymbol = title.split(":")[1]?.split("-")[0] || title;
  const exchange = title.split(":")[0];

  return (
    <div 
      className={cn(
        "relative p-4",
        "rounded-xl",
        "group cursor-pointer",
        "transition-all duration-300 ease-out",
        "hover:shadow-lg",
        "hover:-translate-y-0.5",
        "bg-white dark:bg-gray-800",
        "backdrop-blur-sm",
        "border-2 border-transparent",
        "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800",
        "hover:border-gradient-to-r hover:from-blue-400 hover:to-purple-400 dark:hover:from-blue-500 dark:hover:to-blue-700"
      )}
    >
      <div className="relative flex justify-between items-center gap-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="relative">
            <FallbackImage
              src={logoUrl}
              alt={`${stockSymbol} logo`}
              width={40}
              height={40}
              className={cn(
                "rounded-xl",
                "border border-gray-200 dark:border-white/20",
                "transition-transform duration-300",
                "group-hover:scale-110",
                "shadow-lg"
              )}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={cn(
                "text-sm font-semibold",
                "transition-colors duration-300",
              )}>
                {stockSymbol}
              </p>
            </div>
            <p className={cn(
              "text-xs",
              "mt-0.5",
              "text-gray-600 dark:text-gray-300",
              "transition-colors duration-300",
              "group-hover:text-gray-800 dark:group-hover:text-gray-100"
            )}>
              {exchange}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomStockItemWatchlist;
