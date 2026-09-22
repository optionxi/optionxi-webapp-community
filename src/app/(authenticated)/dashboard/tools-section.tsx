'use client';

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getMenuList } from "@/lib/menu-list";

/* ---------- Types ---------- */

type ToolItem = {
  name: string;
  icon: React.ReactNode;
  link: string;
  description: string;
  category: string;
  hasSubmenu: boolean;
  submenus: { href: string; label: string }[];
  accent: string; // accent color for glow + preview
};

const BALLOON_WIDTH = 240; // w-60
const VIEWPORT_MARGIN = 12;
const MOBILE_BREAKPOINT = 767;

/* ---------- Main Component ---------- */

const ToggleTools = () => {
  const menuList = getMenuList();
  const tradingToolsGroup = menuList.find((g) => g.groupLabel === "Trading Tools");

  const tools: ToolItem[] = (tradingToolsGroup?.menus ?? [])
    .filter((menu) => menu.href !== "" || (menu.submenus?.length ?? 0) > 0)
    .map((menu, index) => ({
      name: menu.label,
      icon: <menu.icon strokeWidth={1.6} className="h-full w-full" />,
      link: menu.href || menu.submenus?.[0]?.href || "#",
      description: getToolDescription(menu.label),
      category: getToolCategory(menu.label),
      hasSubmenu: Boolean(menu.submenus?.length),
      submenus: (menu.submenus ?? []).map((s) => ({ href: s.href, label: s.label })),
      accent: getToolAccent(menu.label, index),
    }));

  // ---- Mobile detection ----
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Global mouse X for dock magnification (desktop only)
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="isolate mb-6 flex w-full justify-center"
    >
      {isMobile ? (
        /* ---------- Mobile: plain 4-col grid, no hover, no balloon ---------- */
        <div className="grid w-full grid-cols-4 gap-2 px-4">
          {tools.map((tool, i) => (
            <MobileToolTile key={i} tool={tool} />
          ))}
        </div>
      ) : (
        /* ---------- Desktop: existing macOS-style dock ---------- */
        <div
          onMouseMove={(e) => mouseX.set(e.clientX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="relative flex items-end gap-2 overflow-visible rounded-[28px] border border-black/10 bg-white/70 px-4 pb-3 pt-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-2xl dark:border-white/15 dark:bg-white/[0.07] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]"
        >
          {tools.map((tool, index) => (
            <DockItem key={index} tool={tool} mouseX={mouseX} index={index} />
          ))}

          {/* bottom accent line */}
          <div className="pointer-events-none absolute inset-x-8 bottom-1.5 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/30" />
        </div>
      )}
    </motion.div>
  );
};

/* ---------- Mobile Tool Tile (no hover, tap navigates) ---------- */

function MobileToolTile({ tool }: { tool: ToolItem }) {
  return (
    <Link
      href={tool.link}
      className="flex flex-col items-center gap-1 rounded-2xl p-3 no-underline transition-transform active:scale-95"
      style={{ background: `${tool.accent}14` }}
    >
      <div className="h-8 w-8" style={{ color: tool.accent }}>
        {tool.icon}
      </div>
      <span className="text-center text-[10px] font-medium leading-tight text-zinc-700 dark:text-zinc-300">
        {tool.name}
      </span>
    </Link>
  );
}

/* ---------- Dock Item (with balloon magnification) ---------- */

function DockItem({
  tool,
  mouseX,
  index,
}: {
  tool: ToolItem;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [balloonOffset, setBalloonOffset] = useState(0);

  // distance from cursor to item center → proximity-based size (the "balloon" effect)
  const distance = useTransform(mouseX, (x) => {
    const b = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return x - b.x - b.width / 2;
  });

  const sizeSync = useTransform(distance, [-110, 0, 110], [46, 72, 46]);
  const iconScale = useTransform(distance, [-110, 0, 110], [0.65, 1, 0.65]);
  const size = useSpring(sizeSync, { mass: 0.1, stiffness: 180, damping: 13 });

  // Figure out how far the balloon needs to shift so it stays inside the viewport,
  // since by default it's centered on the icon (left: 50% + marginLeft: -width/2).
  const handleHoverStart = () => {
    setHovered(true);
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const iconCenter = rect.left + rect.width / 2;
    const balloonLeft = iconCenter - BALLOON_WIDTH / 2;
    const balloonRight = iconCenter + BALLOON_WIDTH / 2;
    const viewportWidth = window.innerWidth;

    let offset = 0;
    if (balloonLeft < VIEWPORT_MARGIN) {
      offset = VIEWPORT_MARGIN - balloonLeft;
    } else if (balloonRight > viewportWidth - VIEWPORT_MARGIN) {
      offset = (viewportWidth - VIEWPORT_MARGIN) - balloonRight;
    }
    setBalloonOffset(offset);
  };

  const handleHoverEnd = () => {
    setHovered(false);
    setBalloonOffset(0);
  };

  return (
    <Link
      href={tool.link}
      className="relative flex flex-col items-center no-underline"
      style={{ zIndex: hovered ? 999 : 1 }}
    >
      {/* ------- Preview Balloon ------- */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="pointer-events-none absolute bottom-full z-[999] mb-6 w-60"
            style={{
              // center on the icon without touching `transform`
              left: "50%",
              marginLeft: -BALLOON_WIDTH / 2,
              // let Framer Motion compose this into the transform,
              // so y/scale animations never clobber the positioning
              x: balloonOffset,
            }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-4 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.25)] backdrop-blur-2xl dark:border-white/15 dark:bg-zinc-900 dark:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)]">
              {/* accent glow */}
              <div
                className="absolute -top-10 left-1/2 h-24 w-40 -translate-x-1/2 rounded-full blur-2xl"
                style={{ background: tool.accent, opacity: 0.3 }}
              />

              {/* header: icon + name + category */}
              <div className="relative flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10 p-2.5 dark:border-white/15"
                  style={{
                    background: `${tool.accent}22`,
                    boxShadow: `0 0 20px ${tool.accent}44`,
                  }}
                >
                  <span style={{ color: tool.accent }}>{tool.icon}</span>
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                    {tool.name}
                  </div>
                  <div
                    className="text-[10px] font-bold uppercase tracking-[0.15em]"
                    style={{ color: tool.accent }}
                  >
                    {tool.category}
                  </div>
                </div>
              </div>

              {/* description */}
              <p className="relative mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {tool.description}
              </p>

              {/* mini sparkline SVG decoration */}
              <svg viewBox="0 0 200 28" className="relative mt-3 h-7 w-full opacity-70">
                <defs>
                  <linearGradient id={`sg-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={tool.accent} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={tool.accent} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 22 C 20 20, 35 10, 55 14 S 90 24, 110 16 S 150 4, 170 10 S 195 6, 200 8"
                  fill="none"
                  stroke={tool.accent}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M0 22 C 20 20, 35 10, 55 14 S 90 24, 110 16 S 150 4, 170 10 S 195 6, 200 8 L 200 28 L 0 28 Z"
                  fill={`url(#sg-${index})`}
                />
              </svg>

              {/* submenu chips */}
              {tool.hasSubmenu && tool.submenus.length > 0 && (
                <div className="relative mt-3 flex flex-wrap gap-1.5 border-t border-black/10 pt-3 dark:border-white/10">
                  {tool.submenus.map((sub) => (
                    <span
                      key={sub.href}
                      className="rounded-md border border-black/10 bg-black/[0.03] px-2 py-0.5 text-[10px] text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                    >
                      {sub.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* balloon arrow — counter-shifted so it still points at the icon
                even when the whole balloon is nudged to stay in the viewport */}
            <div
              className="absolute -bottom-[5px] left-1/2 h-3 w-3 border-b border-r border-black/10 bg-white backdrop-blur-xl dark:border-white/15 dark:bg-zinc-900/90"
              style={{
                transform: `translateX(calc(-50% - ${balloonOffset}px)) rotate(45deg)`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------- Dock Icon ------- */}
      <motion.div
        ref={ref}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        style={{ width: size, height: size }}
        whileTap={{ scale: 0.85 }}
        className="relative flex cursor-pointer items-center justify-center rounded-2xl border border-black/10 bg-gradient-to-b from-black/[0.04] to-black/[0.01] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-white/10 dark:from-white/15 dark:to-white/5 dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]"
      >
        {/* subtle always-on accent tint so the dock reads as colorful at rest */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{ background: `${tool.accent}14` }}
        />

        {/* hover glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ boxShadow: `0 0 30px 4px ${tool.accent}` }}
          animate={{ opacity: hovered ? 0.4 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          style={{ scale: iconScale, color: hovered ? tool.accent : undefined }}
          className="relative flex h-1/2 w-1/2 items-center justify-center text-zinc-700 transition-colors duration-200 [&>svg]:h-full [&>svg]:w-full dark:text-zinc-200"
        >
          {tool.icon}
        </motion.div>

        {/* running-dot indicator under hovered/active item */}
        <motion.div
          className="absolute -bottom-2.5 h-1 w-1 rounded-full"
          style={{ background: tool.accent }}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0 }}
        />
      </motion.div>

      {/* ------- Label (only rendered on hover, so idle labels never collide) ------- */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: -6 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute -bottom-7 z-[999] whitespace-nowrap rounded-md bg-white/80 px-1.5 py-0.5 text-[11px] font-medium text-zinc-800 shadow-sm backdrop-blur-sm dark:bg-black/40 dark:text-zinc-200"
          >
            {tool.name}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

/* ---------- Helpers ---------- */

function getToolDescription(label: string): string {
  const map: Record<string, string> = {
    "Strategy Builder": "Create and backtest custom trading strategies",
    "Stock performance": "Track price performance over time",
    "Top Gainers": "Stocks with highest price increase",
    "Top Losers": "Stocks with biggest price decrease",
    "Top Volume": "Highest trading volume stocks",
    "Heat Map": "Visual representation of market trends",
    Screeners: "Filter stocks by custom criteria",
    Scanners: "Real-time market opportunities",
    "Market Sentiment": "Analyze market mood and trends",
    Breakouts: "Stocks breaking resistance levels",
    "Stock Alerts": "Get notified on price movements",
  };
  return map[label] || "Access trading insights";
}

function getToolCategory(label: string): string {
  const map: Record<string, string> = {
    "Strategy Builder": "Create",
    "Stock performance": "Analysis",
    "Top Gainers": "Analysis",
    "Top Losers": "Analysis",
    "Top Volume": "Analysis",
    "Heat Map": "Visual",
    Screeners: "Filter",
    Scanners: "Discovery",
    "Market Sentiment": "Trends",
    Breakouts: "Technical",
    "Stock Alerts": "Alerts",
  };
  return map[label] || "Tool";
}

function getToolAccent(label: string, index: number): string {
  const map: Record<string, string> = {
    "Strategy Builder": "#a78bfa",
    "Stock performance": "#22d3ee",
    "Top Gainers": "#34d399",
    "Top Losers": "#f87171",
    "Top Volume": "#818cf8",
    "Heat Map": "#fbbf24",
    Screeners: "#c084fc",
    Scanners: "#60a5fa",
    "Market Sentiment": "#f472b6",
    Breakouts: "#22d3ee",
    "Stock Alerts": "#fb923c",
  };
  if (map[label]) return map[label];
  const hue = (index * 37) % 360;
  return `hsl(${hue}, 80%, 65%)`;
}

export default ToggleTools;