'use client';

import React from 'react';

const CircularLoadingIndicator = () => {
  return (
    <div className="relative flex items-center justify-center">
      <svg
        className="w-20 h-20 animate-spin-slow"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle
          className="text-muted-foreground/15"
          cx="50"
          cy="50"
          r="40"
          fill="none"
          strokeWidth="8"
          stroke="currentColor"
        />
        {/* Gradient overlay for modern look */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary)/0.5)" />
          </linearGradient>
        </defs>
        {/* Foreground spinning arc */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          strokeWidth="8"
          stroke="url(#gradient)"
          strokeDasharray="251.2"
          strokeDashoffset="125.6"
          strokeLinecap="round"
          className="animate-dash"
          transform="rotate(-90 50 50)"
        />
      </svg>
      {/* Subtle pulse in the middle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
      </div>
    </div>
  );
};

const PulsingCard = () => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-background/50 p-2">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent skeleton-wave" />
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-muted/60 skeleton-pulse" />
          <div className="space-y-1 flex-1">
            <div className="h-4 w-24 bg-muted/60 skeleton-pulse" />
            <div className="h-3 w-16 bg-muted/40 skeleton-pulse" />
          </div>
          <div className="space-y-1">
            <div className="h-5 w-14 bg-muted/60 skeleton-pulse" />
            <div className="h-3 w-10 ml-auto bg-muted/40 skeleton-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ScreenerResultLoadingSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Modern loading spinner */}
      <div className="w-full flex flex-col items-center justify-center py-12">
        <CircularLoadingIndicator />
        <h3 className="mt-6 font-medium text-lg animate-fade-in-out">Loading Screener Results</h3>
        <p className="text-muted-foreground text-sm mt-2">Fetching the latest market data</p>
      </div>
      
      {/* Background grid with modern pulse effect - dimmed version */}
      <div className="w-full max-w-5xl opacity-60 transition-opacity duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(20).fill(null).map((_, index) => (
            <PulsingCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScreenerResultLoadingSkeleton;