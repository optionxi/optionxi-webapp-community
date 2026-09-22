"use client";

import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabase/client';

interface IndexData {
  symbol: string;
  ltp: number;
  pcnt: number;
  l: number;
  h: number;
  pc: number;
}

const displayNames: Record<string, string> = {
  NIFTY50: "NIFTY 50",
  NIFTYBANK: "BANK NIFTY",
  INDIAVIX: "INDIA VIX",
  NIFTYIT: "NIFTY IT",
  NIFTYMIDCAP50: "MIDCAP 50",
  NIFTYPHARMA: "PHARMA",
  FINNIFTY: "FIN NIFTY",
};

export default function IndicesGlance() {
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIndices = async () => {
    try {
      const { data, error } = await supabase
        .from("live_nifty_indices")
        .select("symbol, ltp, pcnt, l, h, pc")
        .in("symbol", ["NIFTY50", "NIFTYBANK", "INDIAVIX", "NIFTYIT", "NIFTYMIDCAP50","NIFTYPHARMA","FINNIFTY"]);

      if (error) throw error;
      setIndices(data || []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load indices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndices();

    const channel = supabase
      .channel("indices_updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "live_nifty_indices" },
        () => fetchIndices()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-20">
        <div className="w-5 h-5 border-2 border-neutral-300 dark:border-neutral-600 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-20">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
      {indices.map((index) => {
        const isPositive = index.pcnt >= 0;
        const change = index.ltp - index.pc;
        const progress =
          index.h > index.l
            ? Math.min(Math.max((index.ltp - index.l) / (index.h - index.l), 0), 1)
            : 0.5;

        return (
          <div
            key={index.symbol}
            className="flex-shrink-0 w-40 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors cursor-pointer group"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 truncate">
                {displayNames[index.symbol] || index.symbol}
              </span>
              <span
                className={`flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  isPositive
                    ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                    : "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10"
                }`}
              >
                <svg
                  className={`w-3 h-3 ${isPositive ? "" : "rotate-180"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.293 9.707l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 7.414l-3.293 3.293a1 1 0 01-1.414-1.414z" />
                </svg>
                {Math.abs(index.pcnt).toFixed(2)}%
              </span>
            </div>

            {/* LTP */}
            <p className="text-lg font-bold text-neutral-900 dark:text-white leading-tight">
              {index.ltp.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>

            {/* Change */}
            <p
              className={`text-xs font-medium ${
                isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {isPositive ? "+" : ""}
              {change.toFixed(2)}
            </p>

            {/* Progress Bar */}
            <div className="mt-2.5">
              <div className="h-1 w-full bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isPositive
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                      : "bg-gradient-to-r from-red-400 to-red-500"
                  }`}
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-neutral-400 dark:text-neutral-500">L: {index.l.toFixed(0)}</span>
                <span className="text-[9px] text-neutral-400 dark:text-neutral-500">H: {index.h.toFixed(0)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}