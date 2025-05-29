import React from 'react';
import Link from "next/link";
import { Clock, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from 'date-fns'; // Import the function

// shadcn/ui components
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

// Types
import { Screener } from "@/datamodels/screeners_model";

interface ScannerCardProps {
  screener: Screener;
  type: 'bullish' | 'bearish';
  defaultExpanded?: boolean;
  category?: string;
}

export const ScannerCard: React.FC<ScannerCardProps> = ({
  screener,
  type,
  defaultExpanded = false,
  category = 'bullish'
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  useEffect(() => {
    setIsExpanded(defaultExpanded);
  }, [defaultExpanded]);

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Convert the last_update timestamp to a "time ago" format
  const timeAgo = formatDistanceToNow(new Date(screener.last_update), { addSuffix: true });

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <Link 
            href={{
              pathname: `/scanners/${screener.name.toLowerCase().replace(/\s+/g, '-')}`,
              query: { category }
            }}
            className="flex-1 flex items-center space-x-4"
          >
            <div>
              <h3 className="font-medium">{screener.name}</h3>
              <Badge 
                variant={type === 'bullish' ? 'default' : 'destructive'} 
                className="mt-2"
              >
                {screener.signal_count} stocks
              </Badge>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>{screener.timeframe} • {timeAgo}</span> {/* Use timeAgo here */}
              </div>
            </div>
          </Link>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-secondary"
                  onClick={handleInfoClick}
                >
                  <Info className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                View details
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="text-muted-foreground mb-4">
              {screener.description}
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg backdrop-blur-sm">
              <div className="font-medium mb-2 text-foreground">Screening Criteria:</div>
              <ul className="list-disc pl-5 space-y-1">
                {screener.criteria.map((criterion, index) => (
                  <li key={index} className="text-muted-foreground">{criterion}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};