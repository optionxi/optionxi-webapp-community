'use client';

import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils"; // Adjust the import path as needed
import { FallbackImage } from "@/components/custom/cust_fallback_image";

interface StickyHeaderProps {
  stockName: string;
}

export default function StickyHeader({ stockName }: StickyHeaderProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if we're scrolled enough to trigger sticky mode
      // Adjust threshold as needed based on your layout
      const scrollThreshold = 100;
      setIsSticky(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={cn(
      "sticky top-14 z-10 transition-all duration-300",
      "bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg",
      isSticky 
        ? "p-3 sm:p-3" // Compressed padding when sticky
        : "p-6" // Original padding when not sticky
    )}>
      <div className={cn(
        "flex justify-between items-center",
        isSticky 
          ? "flex-row" // Force row layout when sticky (even on mobile)
          : "flex-col sm:flex-row" // Original responsive layout
      )}>
        {/* Stock info section with adaptive styling */}
        <div className={cn(
          "flex items-center",
          isSticky ? "gap-3" : "gap-6"
        )}>
          <div className={cn(
            "relative",
            isSticky ? "sm:block" : ""
          )}>
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20",
              isSticky ? "hidden sm:block" : ""
            )}></div>
            <div className={cn(
              "relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300",
              isSticky ? "p-1" : "p-2"
            )}>
              <FallbackImage
                src={`/assets/stockimages/${stockName}.png`}
                alt={`${stockName} logo`}
                width={isSticky ? 40 : 72}
                height={isSticky ? 40 : 72}
                className="rounded-lg transition-all duration-300 hover:scale-105"
              />
            </div>
          </div>
          <div className="space-y-0">
            <h1 className={cn(
              "font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300",
              isSticky ? "text-xl sm:text-2xl" : "text-3xl sm:text-4xl"
            )}>
              {stockName}
            </h1>
            <p className={cn(
              "text-gray-500 dark:text-gray-400",
              isSticky ? "text-xs hidden sm:block" : "text-sm"
            )}>
              {isSticky ? "Overview" : "Comprehensive overview and insights"}
            </p>
          </div>
        </div>

        {/* Action button with adaptive styling */}
        <a
          href={`https://in.tradingview.com/chart/?symbol=${stockName}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            isSticky ? "ml-4" : "w-full sm:w-auto mt-4 sm:mt-0"
          )}
        >
          <button className={cn(
            "group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg text-white",
            isSticky 
              ? "px-3 py-2 text-xs sm:text-sm" // Smaller button when sticky
              : "w-full sm:w-auto px-6 py-3 text-sm" // Original size
          )}>
            <span className="font-medium">
              {isSticky ? "Chart" : "View Tradingview Chart"}
            </span>
            <svg
              className={cn(
                "transition-transform group-hover:translate-x-1",
                isSticky ? "w-3 h-3" : "w-4 h-4"
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </a>
      </div>
    </div>
  );
}