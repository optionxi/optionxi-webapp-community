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

const getColorScheme = (percentage: number) => {
  const colors = {
    background: '',
    hoverBackground: '',
    text: '',
    borderColor: ''
  };

  if (percentage >= 15) {
    colors.background = 'bg-[#4CAF50]/20 dark:bg-[#4CAF50]/30';
    colors.hoverBackground = 'hover:bg-[#4CAF50]/30 dark:hover:bg-[#4CAF50]/40';
    colors.text = 'text-[#2E7D32] dark:text-[#81C784]';
    colors.borderColor = 'border-[#4CAF50]/30 dark:border-[#4CAF50]/40';
  } else if (percentage >= 10) {
    colors.background = 'bg-[#66BB6A]/20 dark:bg-[#66BB6A]/30';
    colors.hoverBackground = 'hover:bg-[#66BB6A]/30 dark:hover:bg-[#66BB6A]/40';
    colors.text = 'text-[#388E3C] dark:text-[#A5D6A7]';
    colors.borderColor = 'border-[#66BB6A]/30 dark:border-[#66BB6A]/40';
  } else if (percentage >= 5) {
    colors.background = 'bg-[#81C784]/20 dark:bg-[#81C784]/30';
    colors.hoverBackground = 'hover:bg-[#81C784]/30 dark:hover:bg-[#81C784]/40';
    colors.text = 'text-[#43A047] dark:text-[#C8E6C9]';
    colors.borderColor = 'border-[#81C784]/30 dark:border-[#81C784]/40';
  } else if (percentage >= 2) {
    colors.background = 'bg-[#A5D6A7]/20 dark:bg-[#A5D6A7]/30';
    colors.hoverBackground = 'hover:bg-[#A5D6A7]/30 dark:hover:bg-[#A5D6A7]/40';
    colors.text = 'text-[#4CAF50] dark:text-[#E8F5E9]';
    colors.borderColor = 'border-[#A5D6A7]/30 dark:border-[#A5D6A7]/40';
  } else if (percentage >= 0) {
    colors.background = 'bg-[#C8E6C9]/20 dark:bg-[#C8E6C9]/30';
    colors.hoverBackground = 'hover:bg-[#C8E6C9]/30 dark:hover:bg-[#C8E6C9]/40';
    colors.text = 'text-[#66BB6A] dark:text-[#E8F5E9]';
    colors.borderColor = 'border-[#C8E6C9]/30 dark:border-[#C8E6C9]/40';
  } else if (percentage >= -2) {
    colors.background = 'bg-[#FFCDD2]/20 dark:bg-[#FFCDD2]/30';
    colors.hoverBackground = 'hover:bg-[#FFCDD2]/30 dark:hover:bg-[#FFCDD2]/40';
    colors.text = 'text-[#E53935] dark:text-[#FFCDD2]';
    colors.borderColor = 'border-[#FFCDD2]/30 dark:border-[#FFCDD2]/40';
  } else if (percentage >= -5) {
    colors.background = 'bg-[#EF9A9A]/20 dark:bg-[#EF9A9A]/30';
    colors.hoverBackground = 'hover:bg-[#EF9A9A]/30 dark:hover:bg-[#EF9A9A]/40';
    colors.text = 'text-[#D32F2F] dark:text-[#EF9A9A]';
    colors.borderColor = 'border-[#EF9A9A]/30 dark:border-[#EF9A9A]/40';
  } else if (percentage >= -10) {
    colors.background = 'bg-[#E57373]/20 dark:bg-[#E57373]/30';
    colors.hoverBackground = 'hover:bg-[#E57373]/30 dark:hover:bg-[#E57373]/40';
    colors.text = 'text-[#C62828] dark:text-[#E57373]';
    colors.borderColor = 'border-[#E57373]/30 dark:border-[#E57373]/40';
  } else if (percentage >= -15) {
    colors.background = 'bg-[#F44336]/20 dark:bg-[#F44336]/30';
    colors.hoverBackground = 'hover:bg-[#F44336]/30 dark:hover:bg-[#F44336]/40';
    colors.text = 'text-[#B71C1C] dark:text-[#F44336]';
    colors.borderColor = 'border-[#F44336]/30 dark:border-[#F44336]/40';
  } else {
    colors.background = 'bg-[#C62828]/20 dark:bg-[#C62828]/30';
    colors.hoverBackground = 'hover:bg-[#C62828]/30 dark:hover:bg-[#C62828]/40';
    colors.text = 'text-[#B71C1C] dark:text-[#EF5350]';
    colors.borderColor = 'border-[#C62828]/30 dark:border-[#C62828]/40';
  }

  return colors;
};

const CustomStockItemHeatMap: React.FC<CardProps> = ({
  logoUrl,
  title,
  price,
  percentage,
}) => {
  const colors = getColorScheme(percentage);
  const stockSymbol = title.split(":")[1]?.split("-")[0] || title;
  const exchange = title.split(":")[0];

  return (
    <div 
      className={cn(
        "relative p-4",
        "rounded-xl",
        "group cursor-pointer",
        colors.background,
        colors.hoverBackground,
        `border ${colors.borderColor}`,
        "transition-all duration-300 ease-out",
        "hover:shadow-lg",
        "hover:-translate-y-0.5",
        "backdrop-blur-sm"
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
              // className={cn(
              //   "rounded-xl",
              //   "border border-gray-200 dark:border-white/20",
              //   "transition-transform duration-300",
              //   "group-hover:scale-110",
              //   "shadow-lg"
              // )}

              className="rounded-lg transition-all duration-300 hover:scale-105"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={cn(
                "text-sm font-semibold",
                "transition-colors duration-300",
                colors.text
              )}>
                {stockSymbol}
              </p>
              <div className={cn(
                "flex items-center justify-center",
                "h-5 w-5 rounded-full",
                "bg-white/80 dark:bg-black/50",
                "transition-all duration-300",
                "group-hover:scale-110"
              )}>
                <span className={cn(
                  "text-xs font-bold",
                  colors.text,
                  "transition-transform duration-300",
                  percentage >= 0 ? "-rotate-45" : "rotate-45",
                  "group-hover:rotate-0"
                )}>
                  →
                </span>
              </div>
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

        <div className="text-right flex flex-col items-end">
          <p className={cn(
            "text-lg font-bold",
            "text-gray-900 dark:text-white",
            "transition-transform duration-300",
            "group-hover:scale-105"
          )}>
            ₹{price.toFixed(1)}
          </p>
          <div className={cn(
            "text-sm font-medium",
            "transition-colors duration-300",
            colors.text
          )}>
            {percentage.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomStockItemHeatMap;