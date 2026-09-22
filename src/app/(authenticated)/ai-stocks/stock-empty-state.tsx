// components/StockSearchEmptyState.tsx
"use client";
import { useState, useRef } from "react";
import { Search, TrendingUp, TrendingDown, X } from "lucide-react";
import { useRouter } from "next/navigation";

const QUICK_PICKS = [
  { sym: "RELIANCE", label: "Reliance" },
  { sym: "TCS", label: "TCS" },
  { sym: "INFY", label: "Infosys" },
  { sym: "HDFCBANK", label: "HDFC Bank" },
  { sym: "WIPRO", label: "Wipro" },
  { sym: "TATAMOTORS", label: "Tata Motors" },
  { sym: "SBIN", label: "SBI" },
  { sym: "ADANIENT", label: "Adani Ent" },
];

const TRENDING = [
  { sym: "BAJFINANCE", name: "Bajaj Finance",       price: 7842.30, chg: +2.14 },
  { sym: "ICICIBANK",  name: "ICICI Bank",           price: 1294.60, chg: +1.38 },
  { sym: "ZOMATO",     name: "Zomato",               price:  228.45, chg: -0.86 },
  { sym: "HCLTECH",    name: "HCL Technologies",     price: 1562.10, chg: +0.73 },
  { sym: "ONGC",       name: "ONGC",                 price:  264.80, chg: -1.22 },
];

const LOGO_COLORS = [
  ["bg-blue-50  text-blue-700",   "dark:bg-blue-950  dark:text-blue-300"],
  ["bg-emerald-50 text-emerald-700", "dark:bg-emerald-950 dark:text-emerald-300"],
  ["bg-violet-50 text-violet-700", "dark:bg-violet-950 dark:text-violet-300"],
  ["bg-orange-50 text-orange-700", "dark:bg-orange-950 dark:text-orange-300"],
  ["bg-amber-50 text-amber-700",  "dark:bg-amber-950  dark:text-amber-300"],
];

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

async function meiliSearch(query: string): Promise<StockHit[]> {
  const res = await fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: query, filter: 'type = "stock"', hitsPerPage: 6 }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.hits ?? [];
}

type StockHit = {
  symbol: string;
  name?: string;
  full_stock_name?: string;
  ltp?: number;
  percent_change?: number;
};

export function StockSearchEmptyState() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StockHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = (sym: string) => {
    router.push(`?symbol=${sym.toUpperCase()}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const hits = await meiliSearch(val.trim());
      setResults(hits);
      setSearched(true);
      setLoading(false);
    }, 240);
  };

  const isSearching = query.trim().length > 0;

  return (
    <div className="max-w-lg mx-auto px-4 py-10 space-y-6">
      {/* Heading */}
      <div className="text-center space-y-1">
        <h1 className="text-xl font-semibold text-foreground">Which stock would you like to analyse?</h1>
        {/* <p className="text-sm text-muted-foreground">Search by name or symbol, or pick from below</p> */}
      </div>

      {/* Search input */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder='Try "Infosys", "RELIANCE"…'
          value={query}
          onChange={handleChange}
          autoComplete="off"
          spellCheck={false}
          className="w-full h-12 pl-10 pr-10 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-colors"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); setSearched(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X size={11} />
          </button>
        )}
      </div>

      {/* Search results */}
      {isSearching && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {loading && Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 animate-pulse">
              <div className="w-9 h-9 rounded-lg bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/5 bg-muted rounded" />
                <div className="h-2.5 w-1/4 bg-muted rounded" />
              </div>
              <div className="h-3 w-16 bg-muted rounded" />
            </div>
          ))}
          {!loading && searched && results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">No stocks found</div>
          )}
          {!loading && results.map((s, i) => {
            const sym = s.symbol.replace("NSE:", "").replace(/-EQ|-BE|-BZ/g, "");
            const name = s.name ?? s.full_stock_name ?? sym;
            const pct  = s.percent_change;
            const up   = (pct ?? 0) >= 0;
            const [light, dark] = LOGO_COLORS[i % LOGO_COLORS.length];
            return (
              <button
                key={s.symbol}
                onClick={() => navigate(sym)}
                className="w-full flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors text-left"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${light} ${dark}`}>
                  {initials(name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{name}</p>
                  <p className="text-xs text-cyan-500">{sym}</p>
                </div>
                <div className="text-right shrink-0">
                  {s.ltp != null && <p className="text-sm font-medium text-foreground">₹{s.ltp.toFixed(2)}</p>}
                  {pct != null && (
                    <p className={`text-xs font-medium flex items-center gap-0.5 justify-end ${up ? "text-emerald-500" : "text-red-500"}`}>
                      {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {up ? "+" : ""}{pct.toFixed(2)}%
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Quick picks */}
      {!isSearching && (
        <>
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">Quick picks</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PICKS.map((q) => (
                <button
                  key={q.sym}
                  onClick={() => navigate(q.sym)}
                  className="px-3.5 py-1.5 rounded-full text-sm border border-border bg-background hover:bg-muted hover:border-border/80 transition-colors text-foreground"
                >
                  {q.label} <span className="text-cyan-500 text-[11px] ml-1">{q.sym}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">Trending today</p>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              {TRENDING.map((s, i) => {
                const up = s.chg >= 0;
                const [light, dark] = LOGO_COLORS[i % LOGO_COLORS.length];
                return (
                  <button
                    key={s.sym}
                    onClick={() => navigate(s.sym)}
                    className="w-full flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${light} ${dark}`}>
                      {initials(s.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-cyan-500">{s.sym}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-foreground">₹{s.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                      <p className={`text-xs font-medium flex items-center gap-0.5 justify-end ${up ? "text-emerald-500" : "text-red-500"}`}>
                        {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {up ? "+" : ""}{s.chg.toFixed(2)}%
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}