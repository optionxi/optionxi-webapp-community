'use client';

import Link from "next/link";

// ── Decorative SVGs ──────────────────────────────────────────────────────────

function PulseWave() {
  return (
    <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-14 opacity-80">
      <polyline
        points="0,30 20,30 30,10 40,50 50,20 60,40 75,5 85,55 95,25 110,30 120,30"
        stroke="url(#teal-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <defs>
        <linearGradient id="teal-grad" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#2dd4bf" stopOpacity="1" />
          <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function NetworkGraph() {
  const nodes = [
    { cx: 80, cy: 20 },
    { cx: 40, cy: 40 },
    { cx: 90, cy: 55 },
    { cx: 55, cy: 70 },
    { cx: 110, cy: 35 },
    { cx: 30, cy: 70 },
  ];
  const edges = [
    [0, 1], [0, 4], [1, 3], [1, 5], [2, 3], [2, 4], [3, 5],
  ];
  return (
    <svg viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-16 opacity-80">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="#a78bfa"
          strokeWidth="1.2"
          strokeOpacity="0.5"
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.cx} cy={n.cy} r={i === 0 ? 5 : 3.5}
          fill={i === 0 ? "#a78bfa" : "none"}
          stroke="#a78bfa"
          strokeWidth="1.5"
          strokeOpacity={i === 0 ? 1 : 0.7}
        />
      ))}
    </svg>
  );
}

// ── Tool card data ───────────────────────────────────────────────────────────

const tools = [
  {
    id: "market-pulse",
    category: "NIFTY 50",
    badge: "NEW",
    badgeStyle: "bg-amber-400/15 text-amber-500 dark:text-amber-400 border border-amber-400/30",
    categoryStyle: "bg-teal-400/10 text-teal-600 dark:text-teal-400 border border-teal-400/25",
    title: "Market Pulse",
    description: "Overall market mood & nifty breakouts. Get AI-powered signals on index momentum, breadth analysis, and intraday reversal zones.",
    href: "/ai-nifty",
    cta: "Analyse",
    ctaColor: "text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300",
    borderGlow: "hover:border-teal-400/40",
    gradientOverlay: "from-teal-400/5 via-transparent to-transparent",
    glowColor: "shadow-teal-400/10",
    Graphic: PulseWave,
  },
  {
    id: "stock-sentiment",
    category: "STOCKS",
    badge: "BETA",
    badgeStyle: "bg-violet-400/15 text-violet-600 dark:text-violet-400 border border-violet-400/30",
    categoryStyle: "bg-violet-400/10 text-violet-600 dark:text-violet-400 border border-violet-400/25",
    title: "Stock Sentiment",
    description: "AI reads technicals, financials & breakout signals across thousands of stocks, ranked by conviction score and sector strength.",
    href: "/ai-stocks",
    cta: "Analyse",
    ctaColor: "text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300",
    borderGlow: "hover:border-violet-400/40",
    gradientOverlay: "from-violet-400/5 via-transparent to-transparent",
    glowColor: "shadow-violet-400/10",
    Graphic: NetworkGraph,
  },
];

// ── Section ──────────────────────────────────────────────────────────────────

export default function AIIntelligenceSection() {
  return (
    <section className="w-full py-2">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-teal-400 to-violet-500" />
        <h2 className="text-lg font-bold tracking-tight text-foreground">AI Intelligence</h2>
      </div>

      {/* Cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map(({ id, category, badge, badgeStyle, categoryStyle, title, description, href, cta, ctaColor, borderGlow, gradientOverlay, glowColor, Graphic }) => (
          <Link
            key={id}
            href={href}
            className={`
              group relative flex flex-col justify-between overflow-hidden
              rounded-2xl border border-border/60 bg-background
              p-5 transition-all duration-300
              hover:shadow-lg ${glowColor} ${borderGlow}
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
            `}
          >
            {/* Gradient wash */}
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradientOverlay} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            {/* Badge top-right */}
            <span className={`absolute top-4 right-4 text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full ${badgeStyle}`}>
              {badge}
            </span>

            {/* Top: category tag */}
            <div className="mb-3">
              <span className={`inline-block text-[11px] font-bold tracking-widest px-2.5 py-0.5 rounded-full ${categoryStyle}`}>
                {category}
              </span>
            </div>

            {/* Middle: title + description + graphic */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-foreground mb-1.5 leading-tight">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {description}
                </p>
              </div>
              <div className="flex-shrink-0 mt-1 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                <Graphic />
              </div>
            </div>

            {/* Bottom: CTA */}
            <div className="mt-5 pt-4 border-t border-border/40">
              <span className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 ${ctaColor} group-hover:gap-2.5`}>
                {cta}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}