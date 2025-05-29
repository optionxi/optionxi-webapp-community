import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const NoStockData = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      {/* Custom SVG illustration */}
      <svg viewBox="0 0 200 160" className="w-48 h-48 text-gray-200">
        <path
          d="M20 80 Q50 120 80 90 T140 100 T190 85"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <circle cx="20" cy="80" r="3" fill="currentColor" />
        <circle cx="80" cy="90" r="3" fill="currentColor" />
        <circle cx="140" cy="100" r="3" fill="currentColor" />
        <circle cx="190" cy="85" r="3" fill="currentColor" />
        <rect x="40" y="120" width="120" height="2" fill="currentColor" opacity="0.5" />
      </svg>

      <Alert variant="default" className="max-w-md">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>
            Please contact the admin, optionxi24@gmail.com
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default NoStockData;