"use client";

// app/option-chain/page.tsx
// Single Next.js page — Tailwind CSS, Supabase integrated, desktop-first & mobile responsive

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { supabase } from '@/lib/supabase/client';

import { useSearchParams, useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChainRow {
  symbol: string;
  optionType: "CE" | "PE";
  expiry: string;
  strike: number;
  spot: number;
  ltp: number;
  volume: number;
  oi: number;
  oiChange: number;
  iv: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  pop: number;
  bidPrice: number;
  askPrice: number;
  isAtm: boolean;
  isItm: boolean;
  isOtm: boolean;
  strikeLevel: string;
  strikesFromAtm: number;
  pcr: number;
  lotSize: number;
  fetchedAt?: string;
}

interface StrikePair {
  strike: number;
  isAtm: boolean;
  call?: ChainRow;
  put?: ChainRow;
  pcr: number;
  lotSize: number;
  callLotCost: number;
  putLotCost: number;
  updatedAt?: string;
}

const PREDEFINED_SYMBOLS = ["NIFTY", "BANKNIFTY", "FINNIFTY", "MIDCPNIFTY"];

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtOI(v: number) {
  if (v >= 1e7) return `${(v / 1e7).toFixed(1)}Cr`;
  if (v >= 1e5) return `${(v / 1e5).toFixed(1)}L`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return v.toFixed(0);
}

function fmtMoney(v: number) {
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(2)}L`;
  if (v >= 1e3) return `₹${(v / 1e3).toFixed(1)}K`;
  return `₹${v.toFixed(0)}`;
}

function formatDateDisplay(d: string) {
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getDate().toString().padStart(2, "0")}-${months[date.getMonth()]}-${date.getFullYear()}`;
}

function pcrLabel(pcr: number) {
  if (pcr > 1.5) return "Very Bullish";
  if (pcr > 1.2) return "Bullish";
  if (pcr > 0.8) return "Neutral";
  if (pcr > 0.5) return "Bearish";
  return "Very Bearish";
}

function buildPairs(rows: ChainRow[], spot: number): StrikePair[] {
  const strikeSet = [...new Set(rows.map((r) => r.strike))].sort((a, b) => a - b);
  let atmStrike = 0;
  if (spot > 0 && strikeSet.length > 0) {
    atmStrike = strikeSet.reduce((a, b) => (Math.abs(a - spot) <= Math.abs(b - spot) ? a : b));
  }

  return strikeSet.map((s) => {
    const call = rows.find((r) => r.strike === s && r.optionType === "CE");
    const put = rows.find((r) => r.strike === s && r.optionType === "PE");
    const lotSize = call?.lotSize ?? put?.lotSize ?? 1;
    return {
      strike: s,
      isAtm: s === atmStrike,
      call,
      put,
      pcr: put?.pcr ?? call?.pcr ?? 0,
      lotSize,
      callLotCost: (call?.ltp ?? 0) * lotSize,
      putLotCost: (put?.ltp ?? 0) * lotSize,
      updatedAt: call?.fetchedAt ?? put?.fetchedAt,
    };
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PcrBadge({ pcr }: { pcr: number }) {
  const colorClass =
    pcr > 1.2 
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800" 
      : pcr < 0.8 
      ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800" 
      : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800";
  return (
    <span className={`text-[10px] font-bold font-mono border rounded px-1.5 py-0.5 ${colorClass}`}>
      PCR {pcr.toFixed(2)} · {pcrLabel(pcr)}
    </span>
  );
}

function TableSkeleton({ showGreeks }: { showGreeks: boolean }) {
  const ceCols = showGreeks ? 7 : 4;
  const peCols = showGreeks ? 7 : 4;
  return (
    <div className="w-full">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="flex w-full border-b border-slate-200 dark:border-slate-800 h-[52px]">
          {/* CE Shimmer */}
          <div className="flex-1 flex bg-emerald-50/30 dark:bg-emerald-950/10">
             {Array.from({ length: ceCols }).map((_, j) => (
               <div key={j} className="flex-1 flex items-center justify-center p-2">
                 <div className="w-8 h-3 rounded bg-slate-200 dark:bg-slate-800 shimmer" />
               </div>
             ))}
          </div>
          {/* Strike Shimmer */}
          <div className="w-[82px] shrink-0 border-x border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
             <div className="w-10 h-4 rounded bg-slate-200 dark:bg-slate-800 shimmer mb-1" />
             <div className="w-6 h-2 rounded bg-slate-200 dark:bg-slate-800 shimmer" />
          </div>
          {/* PE Shimmer */}
          <div className="flex-1 flex bg-rose-50/30 dark:bg-rose-950/10">
             {Array.from({ length: peCols }).map((_, j) => (
               <div key={j} className="flex-1 flex items-center justify-center p-2">
                 <div className="w-8 h-3 rounded bg-slate-200 dark:bg-slate-800 shimmer" />
               </div>
             ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface StrikeDetailProps {
  pair: StrikePair;
  onClose: () => void;
}

function StrikeDetail({ pair, onClose }: StrikeDetailProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-0 md:p-6 transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full md:w-[720px] max-h-[90vh] md:max-h-[85vh] overflow-y-auto rounded-t-3xl md:rounded-3xl
          bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-bottom-8 md:zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        <div className="p-5 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 px-2.5 py-1 rounded-md">
                  {pair.call?.symbol ?? pair.put?.symbol ?? "—"}
                </span>
                {pair.isAtm && (
                  <span className="text-[10px] font-bold font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-md">
                    ATM
                  </span>
                )}
              </div>
              <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 font-mono tracking-tight">
                {pair.strike.toFixed(0)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                Spot ₹{(pair.call?.spot ?? pair.put?.spot ?? 0).toFixed(2)}
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
              ×
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Lot Size</span>
              <span className="font-bold font-mono text-sky-600 dark:text-sky-400">{pair.lotSize}</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-2.5">
              <span className="text-slate-600 dark:text-slate-400 font-medium">CE 1 lot</span>
              <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{pair.callLotCost > 0 ? fmtMoney(pair.callLotCost) : "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-xl px-4 py-2.5">
              <span className="text-slate-600 dark:text-slate-400 font-medium">PE 1 lot</span>
              <span className="font-bold font-mono text-rose-600 dark:text-rose-400">{pair.putLotCost > 0 ? fmtMoney(pair.putLotCost) : "—"}</span>
            </div>
            {pair.pcr > 0 && <PcrBadge pcr={pair.pcr} />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["CE", "PE"] as const).map((type) => {
              const r = type === "CE" ? pair.call : pair.put;
              const isCall = type === "CE";
              if (!r) {
                return (
                  <div key={type} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 opacity-40 flex flex-col items-center justify-center min-h-[240px] bg-slate-100 dark:bg-slate-800">
                    <div className="text-4xl mb-3">∅</div>
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">No {type} data</div>
                  </div>
                );
              }
              return (
                <div key={type} className={`rounded-2xl border p-5 md:p-6 ${isCall ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/10" : "border-rose-200 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/10"}`}>
                  <div className={`text-xs md:text-sm font-bold mb-2 ${isCall ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{type} · {r.isItm ? "ITM" : r.isAtm ? "ATM" : "OTM"}</div>
                  <div className={`text-3xl md:text-4xl font-black font-mono mb-1 ${isCall ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{r.ltp.toFixed(2)}</div>
                  <div className="text-[11px] md:text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">LTP · {fmtMoney(r.ltp * pair.lotSize)}/lot</div>

                  <div className="space-y-2 text-sm border-t border-slate-200 dark:border-slate-800 pt-4">
                    {[
                      ["IV", `${r.iv.toFixed(2)}%`, "text-amber-600 dark:text-amber-400"],
                      ["OI", fmtOI(r.oi), "text-slate-900 dark:text-slate-100"],
                      ["Chg OI", fmtOI(r.oiChange), r.oiChange >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"],
                      ["Volume", fmtOI(r.volume), "text-slate-900 dark:text-slate-100"],
                      ["Bid/Ask", `${r.bidPrice.toFixed(1)} / ${r.askPrice.toFixed(1)}`, "text-slate-600 dark:text-slate-400"],
                    ].map(([label, val, cls]) => (
                      <div key={label} className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">{label}</span>
                        <span className={`font-mono font-semibold ${cls}`}>{val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                    <div className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Greeks</div>
                    <div className="space-y-2 text-sm">
                      {[
                        ["Δ Delta", isCall ? r.delta.toFixed(4) : Math.abs(r.delta).toFixed(4), "text-sky-600 dark:text-sky-400"],
                        ["Γ Gamma", r.gamma.toFixed(5), "text-slate-900 dark:text-slate-100"],
                        ["Θ Theta", r.theta.toFixed(4), "text-rose-600 dark:text-rose-400"],
                        ["ν Vega", r.vega.toFixed(4), "text-slate-900 dark:text-slate-100"],
                      ].map(([label, val, cls]) => (
                        <div key={label} className="flex justify-between items-center">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">{label}</span>
                          <span className={`font-mono font-semibold ${cls}`}>{val}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 bg-white dark:bg-slate-950 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
                      <div className="flex justify-between text-xs mb-1.5 font-medium">
                        <span className="text-slate-600 dark:text-slate-400">Probability of Profit</span>
                        <span className={`font-mono font-bold ${r.pop > 50 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{r.pop.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${r.pop > 50 ? "bg-emerald-500 dark:bg-emerald-400" : "bg-rose-500 dark:bg-rose-400"}`}
                          style={{ width: `${Math.min(r.pop, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component with Suspense for useSearchParams ────────────────────────

function OptionChainContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Fix: Handle null searchParams by providing a default
  const getSymbolFromUrl = () => {
    if (!searchParams) return "NIFTY";
    return searchParams.get("symbol")?.toUpperCase() || "NIFTY";
  };
  
  const urlSymbol = getSymbolFromUrl();
  
  const [symbol, setSymbol] = useState(urlSymbol);
  const [expiries, setExpiries] = useState<string[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState("");
  
  const [showGreeks, setShowGreeks] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [pairs, setPairs] = useState<StrikePair[]>([]);
  const [spotPrice, setSpotPrice] = useState(0);
  const [overallPcr, setOverallPcr] = useState(0);
  
  const [selectedPair, setSelectedPair] = useState<StrikePair | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const [budgetAmount, setBudgetAmount] = useState<number | null>(null);
  const [budgetActive, setBudgetActive] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [filteredPairs, setFilteredPairs] = useState<StrikePair[]>([]);
  
  // Popular symbols for lazy loading
  const [popularSymbols, setPopularSymbols] = useState<string[]>([]);
  const [loadingSymbols, setLoadingSymbols] = useState(false);

  const atmRef = useRef<HTMLTableRowElement | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Update URL when symbol changes
  const updateUrlSymbol = useCallback((newSymbol: string) => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("symbol", newSymbol);
    router.push(`/option-chain?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  // Fetch popular symbols on mount (load beforehand)
  const fetchPopularSymbols = useCallback(async () => {
    setLoadingSymbols(true);
    try {
      const { data, error } = await supabase
        .from("option_chain")
        .select("underlying_symbol")
        .limit(50);
      
      if (error) throw error;
      
      if (data) {
        const unique = Array.from(new Set(data.map((d) => d.underlying_symbol)));
        // Sort alphabetically and limit to 20
        const sorted = unique.sort().slice(0, 20);
        setPopularSymbols(sorted);
      } else {
        setPopularSymbols(PREDEFINED_SYMBOLS);
      }
    } catch (err) {
      console.error("Error fetching popular symbols:", err);
      setPopularSymbols(PREDEFINED_SYMBOLS);
    } finally {
      setLoadingSymbols(false);
    }
  }, []);

  // ── Data Fetching ───────────────────────────────────────────────────────────

  const fetchChain = useCallback(async (sym: string, forceExpiry?: string) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Meta fetch for spot price & expiries
      const { data: metaData, error: metaErr } = await supabase
        .from("option_chain")
        .select("spot_price, expiry_date")
        .eq("underlying_symbol", sym)
        .order("expiry_date", { ascending: true })
        .limit(200);

      if (metaErr) throw metaErr;

      if (!metaData || metaData.length === 0) {
        setPairs([]);
        setFilteredPairs([]);
        setSpotPrice(0);
        setExpiries([]);
        setError(`No data found for symbol: ${sym}`);
        setLoading(false);
        return;
      }

      const spot = metaData[0].spot_price || 0;
      const uniqueExpiries = Array.from(new Set(metaData.map((d) => d.expiry_date))).sort();
      
      setExpiries(uniqueExpiries);
      setSpotPrice(spot);

      let targetExpiry = forceExpiry && uniqueExpiries.includes(forceExpiry) ? forceExpiry : uniqueExpiries[0];
      
      // If forceExpiry is provided but not found, use the first available
      if (forceExpiry && !uniqueExpiries.includes(forceExpiry)) {
        console.warn(`Expiry ${forceExpiry} not found, using ${uniqueExpiries[0]}`);
        targetExpiry = uniqueExpiries[0];
      }
      
      setSelectedExpiry(targetExpiry);

      if (!targetExpiry) {
        setLoading(false);
        return;
      }

      // 2. Infer strike step from 2 rows
      const { data: stepData } = await supabase
        .from("option_chain")
        .select("strike_price")
        .eq("underlying_symbol", sym)
        .eq("expiry_date", targetExpiry)
        .order("strike_price", { ascending: true })
        .limit(2);

      let step = 50;
      if (stepData && stepData.length === 2) {
        step = Math.abs(stepData[1].strike_price - stepData[0].strike_price) || 50;
      }

      // 3. Targeted fetch (+/- 50 strikes from ATM)
      const atm = Math.round(spot / step) * step;
      const radius = 50;
      const lo = atm - radius * step;
      const hi = atm + radius * step;

      const { data: chainData, error: chainErr } = await supabase
        .from("option_chain")
        .select("*")
        .eq("underlying_symbol", sym)
        .eq("expiry_date", targetExpiry)
        .gte("strike_price", lo)
        .lte("strike_price", hi)
        .order("strike_price", { ascending: true });

      if (chainErr) throw chainErr;

      if (!chainData || chainData.length === 0) {
        setError(`No option chain data found for ${sym} on ${targetExpiry}`);
        setPairs([]);
        setFilteredPairs([]);
        setLoading(false);
        return;
      }

      const rows: ChainRow[] = chainData.map((r) => ({
        symbol: r.underlying_symbol,
        optionType: r.option_type,
        expiry: r.expiry_date,
        strike: r.strike_price,
        spot: r.spot_price,
        ltp: r.ltp,
        volume: r.volume,
        oi: r.oi,
        oiChange: r.oi_change,
        iv: r.iv,
        delta: r.delta,
        gamma: r.gamma,
        theta: r.theta,
        vega: r.vega,
        pop: r.pop,
        bidPrice: r.bid_price,
        askPrice: r.ask_price,
        isAtm: r.is_atm,
        isItm: r.is_itm,
        isOtm: r.is_otm,
        strikeLevel: r.strike_level,
        strikesFromAtm: r.strikes_from_atm,
        pcr: r.pcr,
        lotSize: r.lot_size || 1,
        fetchedAt: r.fetched_at,
      }));

      const newPairs = buildPairs(rows, spot);
      
      const totalCallOI = newPairs.reduce((s, p) => s + (p.call?.oi ?? 0), 0);
      const totalPutOI = newPairs.reduce((s, p) => s + (p.put?.oi ?? 0), 0);
      
      setPairs(newPairs);
      setFilteredPairs(newPairs);
      setOverallPcr(totalCallOI > 0 ? totalPutOI / totalCallOI : 0);

    } catch (err: unknown) {
        console.error("Fetch Chain Error:", err);

        let message = "Failed to load option chain data. Please check your connection and try again.";

        if (err instanceof Error) {
            message = err.message;
        }

        setError(message);
        setPairs([]);
        setFilteredPairs([]);
        } finally {
      setLoading(false);
    }
  }, []);

  // Load popular symbols on mount (loads beforehand)
  useEffect(() => {
    fetchPopularSymbols();
  }, [fetchPopularSymbols]);

  // Initial load from URL symbol
  useEffect(() => {
    if (urlSymbol) {
      setSymbol(urlSymbol);
      fetchChain(urlSymbol);
    }
  }, [urlSymbol, fetchChain]);

  // Fetch chain when symbol or expiry changes
  useEffect(() => {
    if (symbol) {
      fetchChain(symbol, selectedExpiry);
    }
  }, [symbol, selectedExpiry, fetchChain]);

  // Search Logic with lazy loading
  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const { data } = await supabase
          .from("option_chain")
          .select("underlying_symbol")
          .ilike("underlying_symbol", `%${searchQuery.toUpperCase()}%`)
          .limit(15);
        
        if (data) {
          const unique = Array.from(new Set(data.map((d) => d.underlying_symbol)));
          setSearchResults(unique);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    
    const timer = setTimeout(handleSearch, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Budget Filter Logic
  useEffect(() => {
    if (!budgetActive || !budgetAmount || budgetAmount <= 0) {
      setFilteredPairs(pairs);
      return;
    }
    const budget = budgetAmount;
    const callsSorted = [...pairs.filter((p) => p.callLotCost > 0)].sort(
      (a, b) => Math.abs(a.callLotCost - budget) - Math.abs(b.callLotCost - budget)
    );
    const putsSorted = [...pairs.filter((p) => p.putLotCost > 0)].sort(
      (a, b) => Math.abs(a.putLotCost - budget) - Math.abs(b.putLotCost - budget)
    );
    const strikes = new Set([
      ...callsSorted.slice(0, 3).map((p) => p.strike),
      ...putsSorted.slice(0, 3).map((p) => p.strike),
    ]);
    setFilteredPairs(pairs.filter((p) => strikes.has(p.strike)));
  }, [budgetActive, budgetAmount, pairs]);

  // Scroll to ATM
  useEffect(() => {
    if (!loading && atmRef.current) {
      setTimeout(() => atmRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
    }
  }, [loading, filteredPairs]);

  const handleSymbolSelect = (s: string) => {
    setSymbol(s);
    setSelectedExpiry("");
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchFocused(false);
    updateUrlSymbol(s);
  };

  // Columns Configuration
  const ceCols = showGreeks
    ? [["Θ", 56], ["Γ", 50], ["Δ", 52], ["IV%", 54], ["Vol", 66], ["OI", 70], ["LTP", 76]]
    : [["IV%", 54], ["Vol", 66], ["OI", 70], ["LTP", 76]];
  const peCols = showGreeks
    ? [["LTP", 76], ["OI", 70], ["Vol", 66], ["IV%", 54], ["Δ", 52], ["Γ", 50], ["Θ", 56]]
    : [["LTP", 76], ["OI", 70], ["Vol", 66], ["IV%", 54]];

  function getCeVal(col: string, r?: ChainRow): string {
    if (!r) return "—";
    switch (col) {
      case "LTP": return r.ltp.toFixed(2);
      case "OI": return fmtOI(r.oi);
      case "Vol": return fmtOI(r.volume);
      case "IV%": return `${r.iv.toFixed(1)}%`;
      case "Δ": return r.delta.toFixed(3);
      case "Γ": return r.gamma.toFixed(4);
      case "Θ": return r.theta.toFixed(2);
      default: return "—";
    }
  }
  function getPeVal(col: string, r?: ChainRow): string {
    if (!r) return "—";
    switch (col) {
      case "LTP": return r.ltp.toFixed(2);
      case "OI": return fmtOI(r.oi);
      case "Vol": return fmtOI(r.volume);
      case "IV%": return `${r.iv.toFixed(1)}%`;
      case "Δ": return Math.abs(r.delta).toFixed(3);
      case "Γ": return r.gamma.toFixed(4);
      case "Θ": return r.theta.toFixed(2);
      default: return "—";
    }
  }
  function getCeColor(col: string): string {
    switch (col) {
      case "LTP": return "text-emerald-600 dark:text-emerald-400 font-bold";
      case "IV%": return "text-amber-600 dark:text-amber-400 font-semibold";
      case "Δ": return "text-sky-600 dark:text-sky-400 font-semibold";
      case "Θ": return "text-rose-600 dark:text-rose-400 font-medium";
      default: return "text-slate-900 dark:text-slate-100 font-medium";
    }
  }
  function getPeColor(col: string): string {
    switch (col) {
      case "LTP": return "text-rose-600 dark:text-rose-400 font-bold";
      case "IV%": return "text-amber-600 dark:text-amber-400 font-semibold";
      case "Δ": return "text-sky-600 dark:text-sky-400 font-semibold";
      case "Θ": return "text-rose-600 dark:text-rose-400 font-medium";
      default: return "text-slate-900 dark:text-slate-100 font-medium";
    }
  }

  // Error component
  if (error && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Error Loading Data</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => fetchChain(symbol, selectedExpiry)}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => handleSymbolSelect("NIFTY")}
              className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Go to NIFTY
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
        .dark .shimmer {
          background: linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.05) 50%, transparent 75%);
          background-size: 200% 100%;
        }
        .scroll-thin::-webkit-scrollbar { width: 5px; height: 5px; }
        .scroll-thin::-webkit-scrollbar-track { background: transparent; }
        .scroll-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
        .dark .scroll-thin::-webkit-scrollbar-thumb { background: #475569; }
      `}} />

      <div className="min-h-screen flex flex-col text-sm font-sans antialiased bg-slate-50 dark:bg-slate-950">
        
        {/* ── HEADER ── */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-black">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-4">
            
            {/* Top Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] md:text-xs font-bold font-mono text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 px-2.5 py-1 rounded-md">
                    {symbol}
                  </span>
                </div>
              </div>

              {/* Enhanced Search Bar - More Prominent */}
              <div className="relative flex-1 lg:max-w-2xl" ref={searchRef}>
                <div className="relative group">
                  {/* Search Icon - Left */}
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-sky-500 dark:group-focus-within:text-sky-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  
                  {/* Search Input */}
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for any stock symbol... (e.g., RELIANCE, TCS, HDFC, BAJFINANCE)"
                    className="w-full pl-12 pr-2 py-3.5 md:py-2 rounded-xl md:rounded-2xl 
                      bg-slate-50 dark:bg-slate-950 
                      border-2 border-slate-200 dark:border-slate-800 
                      focus:border-sky-400 dark:focus:border-sky-500 
                      focus:ring-4 focus:ring-sky-500/20 dark:focus:ring-sky-400/20
                      text-slate-900 dark:text-slate-100 
                      text-sm md:text-base 
                      placeholder:text-slate-400 dark:placeholder:text-slate-500 
                      transition-all duration-200
                      shadow-sm hover:shadow-md"
                  />
                  
                  {/* Clear Button */}
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Loading Indicator */}
                  {isSearching && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Search Dropdown - Enhanced Design */}
                {isSearchFocused && (searchResults.length > 0 || (searchQuery === "" && popularSymbols.length > 0)) && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl md:rounded-2xl 
                    bg-white dark:bg-slate-900 
                    border border-slate-200 dark:border-slate-800 
                    shadow-2xl overflow-hidden 
                    max-h-96 overflow-y-auto
                    animate-in fade-in slide-in-from-top-2 duration-200">
                    
                    {isSearching && searchResults.length === 0 && (
                      <div className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                        Searching for &ldquo;{searchQuery}&ldquo;...
                      </div>
                    )}
                    
                    {/* Search Results */}
                    {searchResults.length > 0 && (
                      <>
                        <div className="px-4 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
                          🔍 Search Results ({searchResults.length})
                        </div>
                        {searchResults.map((s, i) => (
                          <button
                            key={`search-${s}`}
                            onClick={() => handleSymbolSelect(s)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-150 text-left group
                              ${i > 0 ? "border-t border-slate-100 dark:border-slate-800" : ""}`}
                          >
                            <span className="text-xl">📈</span>
                            <div className="flex-1">
                              <div className="font-mono font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                {s}
                              </div>
                              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                                Click to view option chain
                              </div>
                            </div>
                            <span className="text-slate-400 group-hover:text-sky-500 transition-colors">→</span>
                          </button>
                        ))}
                      </>
                    )}
                    
                    {/* Popular Symbols - Pre-loaded */}
                    {searchQuery === "" && popularSymbols.length > 0 && (
                      <>
                        <div className="px-4 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <span>⭐ Popular Symbols</span>
                          {loadingSymbols && (
                            <div className="w-3 h-3 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                          {popularSymbols.map((s, i) => (
                            <button
                              key={`popular-${s}`}
                              onClick={() => handleSymbolSelect(s)}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-150 text-left group
                                ${i < popularSymbols.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}
                                ${i % 2 === 1 ? "md:border-l md:border-slate-100 dark:md:border-slate-800" : ""}`}
                            >
                              <span className="text-lg">⭐</span>
                              <div className="flex-1">
                                <div className="font-mono font-semibold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                  {s}
                                </div>
                              </div>
                              <span className="text-slate-400 group-hover:text-sky-500 transition-colors text-xs">View →</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* No Results Message */}
                    {searchQuery && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                      <div className="px-4 py-8 text-center">
                        <div className="text-4xl mb-2">🔍</div>
                        <div className="text-slate-600 dark:text-slate-400 font-medium">
                          No symbols found for &ldquo;{searchQuery}&ldquo;
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          Try checking the spelling or try a different symbol
                        </div>
                      </div>
                    )}

                    {/* Hint for typing */}
                    {searchQuery === "" && popularSymbols.length === 0 && !loadingSymbols && (
                      <div className="px-4 py-8 text-center">
                        <div className="text-4xl mb-2">⌨️</div>
                        <div className="text-slate-600 dark:text-slate-400 font-medium">
                          Type at least 2 characters to search
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          Search for any NSE/BSE stock symbol
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Toolbar Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowGreeks(!showGreeks)}
                  className={`text-xs md:text-sm font-bold px-3 md:px-5 py-2.5 rounded-xl border transition-all ${
                    showGreeks
                      ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 shadow-sm"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  📊 Greeks
                </button>
                <button
                  onClick={() => setShowBudgetModal(true)}
                  className={`font-bold px-3 md:px-5 py-2.5 rounded-xl border transition-all flex items-center gap-1 ${
                    budgetActive
                      ? "bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-700 text-sky-600 dark:text-sky-400"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <span>💰</span> Budget
                </button>
                <button
                  onClick={() => fetchChain(symbol, selectedExpiry)}
                  className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700"
                  title="Refresh Data"
                >
                  ↻
                </button>
              </div>
            </div>

            {/* Symbol Chips */}
            <div className="flex gap-2 mt-4 overflow-x-auto scroll-thin pb-1">
              {PREDEFINED_SYMBOLS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSymbolSelect(s)}
                  className={`shrink-0 text-[11px] md:text-xs font-bold font-mono px-4 py-2 rounded-full border transition-all ${
                    s === symbol
                      ? "bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-400 shadow-sm"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-sky-300 dark:hover:border-sky-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* ── EXPIRY + PCR BAR ── */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-6 flex flex-col md:flex-row md:items-center gap-2 py-3">
            <div className="flex-1 flex gap-2 overflow-x-auto scroll-thin pb-1 md:pb-0">
              {expiries.map((e) => (
                <button
                  key={e}
                  onClick={() => fetchChain(symbol, e)}
                  className={`shrink-0 text-[11px] md:text-xs font-bold font-mono px-4 py-2 rounded-lg border transition-all ${
                    e === selectedExpiry
                      ? "bg-sky-50 dark:bg-sky-950/30 border-sky-400 dark:border-sky-600 text-sky-700 dark:text-sky-400 shadow-sm"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-sky-300 dark:hover:border-sky-700"
                  }`}
                >
                  {formatDateDisplay(e)}
                </button>
              ))}
              {expiries.length === 0 && !loading && (
                 <span className="text-xs text-slate-500 dark:text-slate-400 py-2">No expiries found</span>
              )}
            </div>
            
            {overallPcr > 0 && (
              <div
                className={`shrink-0 flex items-center gap-3 px-3.5 py-2 rounded-xl border text-sm ml-auto
                  ${overallPcr > 1.2 
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400' 
                    : overallPcr < 0.8 
                    ? 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400' 
                    : 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400'
                  }`}
              >
                <span className="font-mono text-inherit text-[10px] md:text-xs font-bold tracking-wider uppercase opacity-70">PCR</span>
                <span className="font-black font-mono text-base">{overallPcr.toFixed(2)}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5`}>
                  {pcrLabel(overallPcr)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── SPOT BANNER ── */}
        {spotPrice > 0 && (
          <div className="border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="max-w-screen-2xl mx-auto px-4 md:px-6 flex flex-wrap items-center gap-3 md:gap-5 py-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 dark:bg-sky-400 shadow-[0_0_8px] shadow-sky-500/50 dark:shadow-sky-400/50 animate-pulse" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Spot</span>
                <span className="font-black font-mono text-base md:text-lg text-sky-600 dark:text-sky-400">₹{spotPrice.toFixed(2)}</span>
              </div>
              
              {budgetActive && (
                <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 px-3 py-1 rounded-lg">
                  Max: {fmtMoney(budgetAmount ?? 0)}
                  <button onClick={() => { setBudgetActive(false); setBudgetAmount(null); }} className="ml-1 hover:text-amber-900 dark:hover:text-amber-300">×</button>
                </div>
              )}
              
              <div className="ml-auto flex items-center gap-4">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden md:inline-block">{filteredPairs.length} strikes loaded</span>
                <button
                  onClick={() => atmRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-950/50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <span className="text-[10px]">⊕</span> ATM
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TABLE ── */}
        <div className="flex-1 max-w-screen-2xl mx-auto w-full px-0 md:px-6 py-4 md:py-6">
          <div className="overflow-x-auto scroll-thin md:rounded-2xl border-y md:border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full border-collapse" style={{ minWidth: showGreeks ? 900 : 640 }}>
              <thead>
                <tr className="text-[10px] font-bold font-mono tracking-wider uppercase">
                  {/* CE Header */}
                  <th
                    colSpan={ceCols.length}
                    className="text-center py-2.5 border-b border-slate-200 dark:border-slate-800 bg-emerald-50/30 dark:bg-emerald-950/10"
                  >
                    <span className="text-emerald-600 dark:text-emerald-400">CALL (CE)</span>
                  </th>
                  {/* Strike Header */}
                  <th
                    className="py-2.5 px-2 text-center border-b border-slate-200 dark:border-slate-800 border-x bg-white dark:bg-slate-900 w-[82px]"
                  >
                    <span className="text-slate-500 dark:text-slate-400">STRIKE</span>
                  </th>
                  {/* PE Header */}
                  <th
                    colSpan={peCols.length}
                    className="text-center py-2.5 border-b border-slate-200 dark:border-slate-800 bg-rose-50/30 dark:bg-rose-950/10"
                  >
                    <span className="text-rose-600 dark:text-rose-400">PUT (PE)</span>
                  </th>
                </tr>
                <tr className="text-[10px] font-bold font-mono tracking-wide border-b border-slate-200 dark:border-slate-800">
                  {ceCols.map(([col]) => (
                    <th key={`ce-${col}`} className="py-2 text-center text-emerald-600/70 dark:text-emerald-400/70 bg-emerald-50/30 dark:bg-emerald-950/10">
                      {col}
                    </th>
                  ))}
                  <th className="py-2 px-2 text-center text-slate-500 dark:text-slate-400 border-x border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    —
                  </th>
                  {peCols.map(([col]) => (
                    <th key={`pe-${col}`} className="py-2 text-center text-rose-600/70 dark:text-rose-400/70 bg-rose-50/30 dark:bg-rose-950/10">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody className="text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={ceCols.length + peCols.length + 1} className="p-0">
                      <TableSkeleton showGreeks={showGreeks} />
                    </td>
                  </tr>
                ) : filteredPairs.length === 0 && !error ? (
                  <tr>
                    <td colSpan={ceCols.length + peCols.length + 1} className="py-32 text-center">
                      <div className="text-4xl opacity-20 mb-3">📭</div>
                      <div className="text-slate-600 dark:text-slate-400 font-medium text-base">No strikes found</div>
                      <div className="text-slate-500 dark:text-slate-400 text-sm mt-1">Try selecting a different expiry or symbol.</div>
                    </td>
                  </tr>
                ) : (
                  filteredPairs.map((pair, idx) => {
                    const isAtm = pair.isAtm;
                    const bgClass = isAtm 
                      ? "bg-amber-50 dark:bg-amber-950/20" 
                      : idx % 2 === 0 
                      ? "bg-slate-50 dark:bg-slate-900" 
                      : "bg-white dark:bg-slate-950";

                    return (
                      <tr
                        key={pair.strike}
                        ref={isAtm ? atmRef : null}
                        onClick={() => setSelectedPair(pair)}
                        className={`cursor-pointer transition-colors hover:brightness-95 dark:hover:brightness-110 border-b border-slate-200 dark:border-slate-800 h-[52px] ${bgClass}`}
                      >
                        {/* CE Columns */}
                        {ceCols.map(([col]) => {
                          const val = getCeVal(col as string, pair.call);
                          const colorCls = pair.call ? getCeColor(col as string) : "text-slate-400/40 dark:text-slate-500/40";
                          const cellBg = pair.call?.isItm ? "bg-emerald-100/50 dark:bg-emerald-900/20" : "bg-transparent";
                          return (
                            <td key={`ce-${col}`} className={`p-0 text-center ${cellBg} border-r border-slate-200/50 dark:border-slate-800/50`}>
                              <span className={`font-mono text-[11px] md:text-xs block py-3.5 ${colorCls}`}>
                                {val}
                              </span>
                            </td>
                          );
                        })}

                        {/* Strike Pin */}
                        <td className={`text-center border-x border-slate-200 dark:border-slate-800 relative w-[82px] ${isAtm ? "bg-amber-50 dark:bg-amber-950/20" : "bg-white dark:bg-slate-900"}`}>
                          {isAtm && (
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-amber-500 dark:bg-amber-400" />
                          )}
                          <div className="flex flex-col items-center justify-center py-1 px-1">
                            <span className={`font-mono font-black text-[12px] md:text-[13px] ${isAtm ? "text-amber-600 dark:text-amber-400" : "text-slate-900 dark:text-slate-100"}`}>
                              {pair.strike.toFixed(0)}
                            </span>
                            {isAtm ? (
                              <span className="text-[8px] font-bold font-mono text-amber-600 dark:text-amber-400 tracking-widest mt-0.5">ATM</span>
                            ) : pair.pcr > 0 ? (
                              <span
                                className={`text-[8px] font-bold font-mono mt-0.5 px-1.5 py-0.5 rounded ${
                                  pair.pcr > 1.2 
                                    ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30" 
                                    : pair.pcr < 0.8 
                                    ? "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30" 
                                    : "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30"
                                }`}
                              >
                                {pair.pcr.toFixed(2)}
                              </span>
                            ) : null}
                          </div>
                        </td>

                        {/* PE Columns */}
                        {peCols.map(([col]) => {
                          const val = getPeVal(col as string, pair.put);
                          const colorCls = pair.put ? getPeColor(col as string) : "text-slate-400/40 dark:text-slate-500/40";
                          const cellBg = pair.put?.isItm ? "bg-rose-100/50 dark:bg-rose-900/20" : "bg-transparent";
                          return (
                            <td key={`pe-${col}`} className={`p-0 text-center ${cellBg} border-l border-slate-200/50 dark:border-slate-800/50`}>
                              <span className={`font-mono text-[11px] md:text-xs block py-3.5 ${colorCls}`}>
                                {val}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── FOOTER NOTE ── */}
        <div className="text-center text-[11px] font-medium text-slate-500 dark:text-slate-400 py-4 bg-white dark:bg-slate-900 md:bg-transparent dark:md:bg-transparent mt-auto">
          Tap any row to view detailed options Greeks and analytics
        </div>

        {/* ── BUDGET MODAL ── */}
        {showBudgetModal && (
          <div
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-0 md:p-4 animate-in fade-in"
            onClick={() => setShowBudgetModal(false)}
          >
            <div
              className="w-full md:max-w-md rounded-t-3xl md:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-2xl animate-in slide-in-from-bottom-8 md:zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center mb-6 md:hidden">
                <div className="w-10 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              </div>
              <div className="font-extrabold text-xl text-slate-900 dark:text-slate-100 mb-2 tracking-tight">Budget Filter</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-6 font-medium leading-relaxed">
                Enter your maximum budget per lot. We&apos;ll highlight the closest CE & PE strikes within your range.
              </div>
              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sky-600 dark:text-sky-400 text-lg">₹</span>
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="e.g. 8000"
                  className="w-full pl-9 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/50 dark:focus:ring-sky-400/50 focus:border-sky-500 dark:focus:border-sky-400 transition-all shadow-sm"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setBudgetActive(false); setBudgetAmount(null); setBudgetInput(""); setShowBudgetModal(false); }}
                  className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Clear Filter
                </button>
                <button
                  onClick={() => {
                    const val = parseFloat(budgetInput);
                    if (val > 0) { setBudgetAmount(val); setBudgetActive(true); }
                    setShowBudgetModal(false);
                  }}
                  className="flex-1 py-3.5 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  Apply Budget
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STRIKE DETAIL ── */}
        {selectedPair && (
          <StrikeDetail pair={selectedPair} onClose={() => setSelectedPair(null)} />
        )}
      </div>
    </>
  );
}

// Wrap with Suspense to handle useSearchParams
export default function OptionChainPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-slate-600 dark:text-slate-400">Loading...</div>
        </div>
      </div>
    }>
      <OptionChainContent />
    </Suspense>
  );
}