'use client';

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { Clock, Info, Zap } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { Screener } from "@/datamodels/screeners_model";

interface ScannerCardProps {
  screener: Screener;
  type: 'bullish' | 'bearish';
  defaultExpanded?: boolean;
  category?: string;
}

const ACCENT = {
  bullish: { text: '#3DDC84', tint: 'rgba(61, 220, 132, 0.08)' },
  bearish: { text: '#FF5C7A', tint: 'rgba(255, 92, 122, 0.08)' },
};

// Signal counts at or above this are called out with a "hot" tag. Tune to taste.
const HOT_THRESHOLD = 10;
// Screeners updated within this window get a "live" pulse dot.
const LIVE_WINDOW_MINUTES = 15;

export const ScannerCard: React.FC<ScannerCardProps> = ({
  screener,
  type,
  defaultExpanded = false,
  category = 'bullish',
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  useEffect(() => {
    setIsExpanded(defaultExpanded);
  }, [defaultExpanded]);

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsExpanded((prev) => !prev);
  };

  const accent = ACCENT[type];
  const lastUpdate = new Date(screener.last_update);
  const timeAgo = formatDistanceToNow(lastUpdate, { addSuffix: true });
  const minutesAgo = (Date.now() - lastUpdate.getTime()) / 60_000;
  const isLive = minutesAgo <= LIVE_WINDOW_MINUTES;
  const isHot = screener.signal_count >= HOT_THRESHOLD;
  const slug = screener.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Card
      className="group relative w-full overflow-hidden border-l-4 transition-all hover:shadow-md hover:-translate-y-0.5"
      style={{ borderLeftColor: accent.text }}
    >
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={{ pathname: `/scanners/${slug}`, query: { category } }}
            className="flex-1 min-w-0"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                {screener.timeframe}
              </span>
              {isLive && (
                <span className="inline-flex items-center gap-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                      style={{ backgroundColor: accent.text }}
                    />
                    <span
                      className="relative inline-flex h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: accent.text }}
                    />
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">live</span>
                </span>
              )}
              {isHot && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-mono uppercase tracking-wide text-amber-500">
                  <Zap className="h-2.5 w-2.5 fill-amber-500" /> hot
                </span>
              )}
            </div>

            <h3 className="font-medium text-foreground leading-snug truncate group-hover:underline decoration-muted-foreground/40 underline-offset-4">
              {screener.name}
            </h3>

            <div className="flex items-baseline gap-1.5 mt-3">
              <span
                className="text-3xl font-mono font-semibold tabular-nums"
                style={{ color: accent.text }}
              >
                {screener.signal_count}
              </span>
              <span className="text-xs text-muted-foreground">
                stock{screener.signal_count === 1 ? '' : 's'}
              </span>
            </div>

            <div className="flex items-center mt-3 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{timeAgo}</span>
            </div>
          </Link>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full hover:bg-secondary"
                  onClick={handleInfoClick}
                >
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View criteria</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border animate-in fade-in slide-in-from-top-1 duration-200">
            <p className="text-sm text-muted-foreground mb-3">{screener.description}</p>
            <div className="rounded-lg p-3" style={{ backgroundColor: accent.tint }}>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
                Criteria
              </div>
              <ul className="space-y-1.5">
                {screener.criteria.map((criterion, index) => (
                  <li key={index} className="text-sm text-foreground/80 flex gap-2">
                    <span className="text-muted-foreground">·</span>
                    {criterion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};