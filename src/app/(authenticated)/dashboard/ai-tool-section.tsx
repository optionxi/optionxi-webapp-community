'use client';

import Link from "next/link";
import { Sparkles, TrendingUp, BarChart2, ArrowUpRight } from "lucide-react";

const tools = [
  {
    id: "ai-nifty",
    label: "AI Nifty",
    tagline: "Predict Nifty 50 movement",
    description:
      "Harness AI-driven analysis of Nifty 50 trends. Get real-time signal strength, predicted direction, and probability scores based on market momentum.",
    href: "/ai-nifty",
    icon: Sparkles,
    accent: "from-violet-500/10 to-purple-500/5",
    border: "border-violet-500/20 hover:border-violet-500/50",
    iconBg: "bg-violet-500/10 text-violet-500 dark:text-violet-400",
    badge: "AI Powered",
    badgeColor: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
  },
  {
    id: "ai-stocks",
    label: "AI Stocks",
    tagline: "Smart stock intelligence",
    description:
      "Scan thousands of stocks using AI. Identify bullish breakouts, sector rotations, and high-conviction setups ranked by signal strength.",
    href: "/ai-stocks",
    icon: TrendingUp,
    accent: "from-emerald-500/10 to-teal-500/5",
    border: "border-emerald-500/20 hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
    badge: "Live Signals",
    badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "fno-options",
    label: "F&O Options",
    tagline: "Options flow & analytics",
    description:
      "Track unusual options activity, open interest shifts, and PCR ratios. Decode derivatives market sentiment before it moves the underlying.",
    href: "/fno-options",
    icon: BarChart2,
    accent: "from-amber-500/10 to-orange-500/5",
    border: "border-amber-500/20 hover:border-amber-500/50",
    iconBg: "bg-amber-500/10 text-amber-500 dark:text-amber-400",
    badge: "Options Flow",
    badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
];

export default function AnalyticsToolsSection() {
  return (
    <section className="w-full py-6">
      {/* Section header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border/60" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 select-none">
          AI Tools
        </span>
        <div className="h-px flex-1 bg-border/60" />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              href={tool.href}
              className={`
                group relative flex flex-col gap-4 overflow-hidden
                rounded-2xl border bg-gradient-to-br p-5
                transition-all duration-300
                ${tool.accent} ${tool.border}
                hover:shadow-lg hover:-translate-y-0.5
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
              `}
            >
              {/* Top row: icon + badge + arrow */}
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${tool.iconBg}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${tool.badgeColor}`}
                  >
                    {tool.badge}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 text-muted-foreground/40 transition-all duration-200 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2}
                  />
                </div>
              </div>

              {/* Title + tagline */}
              <div className="space-y-0.5">
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  {tool.label}
                </h3>
                <p className="text-xs font-medium text-muted-foreground">
                  {tool.tagline}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-muted-foreground/80">
                {tool.description}
              </p>

              {/* Bottom CTA line */}
              <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-foreground/60 group-hover:text-foreground transition-colors duration-200">
                Explore tool
                <ArrowUpRight className="h-3 w-3" />
              </div>

              {/* Subtle corner glow on hover */}
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
                }}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}