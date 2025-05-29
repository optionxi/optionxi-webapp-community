import React from 'react';
import { ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
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
    accent: '',
    text: '',
    border: ''
  };

  if (percentage >= 2) {
    colors.background = 'bg-green-500/10';
    colors.accent = 'from-green-400/20 to-green-500/20';
    colors.text = 'text-green-400';
    colors.border = 'border-green-400';
  } else if (percentage >= 1) {
    colors.background = 'bg-green-400/10';
    colors.accent = 'from-green-300/20 to-green-400/20';
    colors.text = 'text-green-300';
    colors.border = 'border-green-300';
  } else if (percentage >= 0) {
    colors.background = 'bg-green-300/10';
    colors.accent = 'from-green-200/20 to-green-300/20';
    colors.text = 'text-green-200';
    colors.border = 'border-green-200';
  } else if (percentage >= -1) {
    colors.background = 'bg-red-300/10';
    colors.accent = 'from-red-200/20 to-red-300/20';
    colors.text = 'text-red-200';
    colors.border = 'border-red-200';
  } else if (percentage >= -2) {
    colors.background = 'bg-red-400/10';
    colors.accent = 'from-red-300/20 to-red-400/20';
    colors.text = 'text-red-300';
    colors.border = 'border-red-300';
  } else {
    colors.background = 'bg-red-500/10';
    colors.accent = 'from-red-400/20 to-red-500/20';
    colors.text = 'text-red-400';
    colors.border = 'border-red-400';
  }

  return colors;
};

const EnhancedStockItem: React.FC<CardProps> = ({
  logoUrl,
  title,
  price,
  priceChange,
  percentage,
}) => {
  const colors = getColorScheme(percentage);
  const stockSymbol = title.split(":")[1]?.split("-")[0] || title;
  const exchange = title.split(":")[0];
  const isPositive = percentage >= 0;

  const handleClick = () => {
    window.open(`https://in.tradingview.com/chart/?symbol=${stockSymbol}`, '_blank');
  };

  return (
    <div 
      onClick={handleClick}
      className={cn(
        "relative p-4 m-2",
        "rounded-xl cursor-pointer",
        colors.background,
        "border border-white/10",
        "transition-all duration-300 ease-out",
        "hover:scale-102",
        "group",
        "backdrop-blur-md",
        "hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
      )}
    >
      {/* Gradient overlay */}
      <div className={cn(
        "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100",
        "transition-opacity duration-300",
        "bg-gradient-to-br",
        colors.accent
      )} />

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
                "border-2",
                colors.border,
                "transition-transform duration-300",
                "group-hover:scale-110",
                "shadow-lg"
              )}
            />
            <div className="absolute -bottom-1 -right-1 bg-black/50 rounded-full p-1">
              {isPositive ? (
                <ArrowUp className={cn("h-3 w-3", colors.text)} />
              ) : (
                <ArrowDown className={cn("h-3 w-3", colors.text)} />
              )}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={cn(
                "text-sm font-semibold",
                colors.text
              )}>
                {stockSymbol}
              </p>
              <ExternalLink className="h-3 w-3 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-white/60 mt-0.5">
              {exchange}
            </p>
          </div>
        </div>

        <div className="text-right flex flex-col items-end">
          <p className="text-lg font-bold text-white">
            ₹{price.toFixed(1)}
          </p>
          <div className={cn(
            "text-sm font-medium flex items-center space-x-1",
            colors.text
          )}>
            <span>{priceChange.toFixed(2)}</span>
            <span>({percentage.toFixed(2)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedStockItem;