"use client";

import React, { useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type SeriesConfig = {
  key: string;
  label: string;
  color: string;
  kind?: "area" | "line";
  dashed?: boolean;
};

interface StockAreaChartProps {
  data: Record<string, any>[];
  index: string;
  series: SeriesConfig[];
  valueFormatter?: (v: number) => string;
  height?: number;
  connectNulls?: boolean;
}

export function StockAreaChart({
  data,
  index,
  series,
  valueFormatter = (v) => `${v}`,
  height = 384,
  connectNulls = true,
}: StockAreaChartProps) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const gradientIds = useMemo(
    () => Object.fromEntries(series.map((s) => [s.key, `grad-${s.key.replace(/[^a-zA-Z0-9]/g, "")}`])),
    [series]
  );

  return (
    <div className="w-full">
      {/* Legend / toggles */}
      <div className="flex flex-wrap gap-2 mb-5">
        {series.map((s) => {
          const isHidden = hidden.has(s.key);
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => toggle(s.key)}
              className={[
                "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
                isHidden
                  ? "border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600 bg-transparent"
                  : "border-transparent bg-gray-100/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 shadow-sm",
              ].join(" ")}
            >
              <span
                className="h-2 w-2 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: s.color,
                  opacity: isHidden ? 0.3 : 1,
                  boxShadow: isHidden ? "none" : `0 0 6px ${s.color}66`,
                }}
              />
              {s.label}
            </button>
          );
        })}
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {series
                .filter((s) => (s.kind ?? "area") === "area")
                .map((s) => (
                  <linearGradient key={s.key} id={gradientIds[s.key]} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                    <stop offset="45%" stopColor={s.color} stopOpacity={0.1} />
                    <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              {/* soft glow filter for the active line's leading edge */}
              <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke="currentColor"
              className="text-gray-100 dark:text-gray-800/60"
            />

            <XAxis
              dataKey={index}
              tick={{ fontSize: 11, fill: "currentColor" }}
              tickLine={false}
              axisLine={false}
              minTickGap={36}
              className="text-gray-400 dark:text-gray-500"
            />
            <YAxis
              orientation="right"
              tick={{ fontSize: 11, fill: "currentColor" }}
              tickLine={false}
              axisLine={false}
              width={64}
              tickFormatter={valueFormatter}
              domain={["auto", "auto"]}
              className="text-gray-400 dark:text-gray-500"
            />

            <Tooltip
              content={<CustomTooltip valueFormatter={valueFormatter} />}
              cursor={{ stroke: "currentColor", strokeWidth: 1, strokeDasharray: "4 4", className: "text-gray-300 dark:text-gray-700" }}
            />

            {series.map((s) => {
              if (hidden.has(s.key)) return null;
              const commonProps = {
                type: "natural" as const,
                dataKey: s.key,
                name: s.label,
                stroke: s.color,
                connectNulls,
                isAnimationActive: false,
                dot: false,
              };

              if ((s.kind ?? "area") === "line") {
                return (
                  <Line
                    key={s.key}
                    {...commonProps}
                    strokeWidth={1.5}
                    strokeDasharray={s.dashed ? "5 4" : undefined}
                    strokeLinecap="round"
                    activeDot={{ r: 3.5, strokeWidth: 0 }}
                  />
                );
              }
              return (
                <Area
                  key={s.key}
                  {...commonProps}
                  strokeWidth={2.25}
                  strokeLinecap="round"
                  fill={`url(#${gradientIds[s.key]})`}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke: "#fff",
                    filter: "url(#line-glow)",
                  }}
                />
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label, valueFormatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-xl px-3.5 py-2.5 text-xs min-w-[150px]">
      <p className="font-medium text-gray-900 dark:text-gray-100 mb-2 tracking-tight">{label}</p>
      <div className="space-y-1.5">
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: p.color ?? p.stroke, boxShadow: `0 0 4px ${p.color ?? p.stroke}80` }}
              />
              {p.name}
            </span>
            <span className="font-semibold tabular-nums text-gray-900 dark:text-gray-100">
              {p.value != null ? valueFormatter(p.value) : "–"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}