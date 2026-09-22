'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { ArrowUp, ArrowDown, Minus, Clock, AlertCircle, RefreshCw, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';


interface AtlasData {
  id: string;
  time: string;
  created_at: string;
  type: string;
  probability: number;
  'Postive Indicators': number;
  'Neutral Indicators': number;
  'Negative Indicators': number;
}

interface BollingerData {
  id: string;
  description: string;
  sentiment: string;
  whichmode: string;
  created_at: string;
}

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'Just now';
}

function getTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'bull': return 'text-green-500';
    case 'bear': return 'text-red-500';
    default: return 'text-orange-500';
  }
}

function getTypeBgColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'bull': return 'bg-green-500';
    case 'bear': return 'bg-red-500';
    default: return 'bg-orange-500';
  }
}

function MiniIndicator({ count, type }: { count: number; type: 'positive' | 'neutral' | 'negative' }) {
  const config = {
    positive: { icon: ArrowUp, color: 'text-green-500', bg: 'bg-green-500/10' },
    neutral: { icon: Minus, color: 'text-gray-500', bg: 'bg-gray-500/10' },
    negative: { icon: ArrowDown, color: 'text-red-500', bg: 'bg-red-500/10' },
  };
  const { icon: Icon, color, bg } = config[type];

  return (
    <div className={`flex flex-col items-center justify-center w-10 h-10 rounded-md ${bg}`}>
      <Icon className={`w-3 h-3 ${color}`} />
      <span className={`text-sm font-semibold ${color}`}>{count}</span>
    </div>
  );
}

function SentimentCard({ data }: { data: AtlasData }) {
  const typeColor = getTypeColor(data.type);
  const typeBgColor = getTypeBgColor(data.type);

  return (
    <div className="group relative flex items-stretch bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer">
      <div className={`w-1 ${typeBgColor}`} />
      <div className="flex-1 p-2.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className={`text-sm font-bold uppercase ${typeColor}`}>
              {data.type}
            </span>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {data.probability.toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MiniIndicator count={data['Postive Indicators']} type="positive" />
            <MiniIndicator count={data['Neutral Indicators']} type="neutral" />
            <MiniIndicator count={data['Negative Indicators']} type="negative" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{data.time} • {formatTimeAgo(data.created_at)}</span>
        </div>
      </div>
    </div>
  );
}

function BollingerCard({ data }: { data: BollingerData }) {
  const isBullish = data.sentiment?.toLowerCase().includes('bull') || data.sentiment?.toLowerCase().includes('buy');
  const accentColor = isBullish ? 'bg-green-500' : 'bg-red-500';
  const textColor = isBullish ? 'text-green-500' : 'text-red-500';
  const bgColor = isBullish ? 'bg-green-500/10' : 'bg-red-500/10';

  return (
    <div className="group relative flex items-stretch bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer">
      <div className={`w-1 ${accentColor}`} />
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-2">
          {data.whichmode && (
            <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${bgColor} ${textColor}`}>
              {data.whichmode}
            </span>
          )}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{formatTimeAgo(data.created_at)}</span>
          </div>
        </div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
          {data.description || 'No description'}
        </p>
      </div>
    </div>
  );
}

function LoadingSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-stretch bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-pulse">
          <div className="w-1 bg-gray-300 dark:bg-gray-700" />
          <div className="flex-1 p-2.5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="flex gap-1.5">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-md" />
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-md" />
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-md" />
              </div>
            </div>
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Retry
      </button>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <TrendingUp className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
      <p className="text-sm text-gray-500 dark:text-gray-500">{message}</p>
    </div>
  );
}

export default function MarketInsightsGrid() {
  const [atlasData, setAtlasData] = useState<AtlasData[]>([]);
  const [bollingerData, setBollingerData] = useState<BollingerData[]>([]);
  const [atlasLoading, setAtlasLoading] = useState(true);
  const [bollingerLoading, setBollingerLoading] = useState(true);
  const [atlasError, setAtlasError] = useState<string | null>(null);
  const [bollingerError, setBollingerError] = useState<string | null>(null);

  const fetchAtlasData = async () => {
    setAtlasLoading(true);
    setAtlasError(null);
    try {
      const { data, error } = await supabase
        .from('atlas_output')
        .select('*')
        .order('timeinmill', { ascending: false })
        .limit(5);
      if (error) throw error;
      setAtlasData(data || []);
    } catch (e) {
      setBollingerError(e instanceof Error ? e.message : 'Failed to load breakout data');
    } finally {
      setAtlasLoading(false);
    }
  };

  const fetchBollingerData = async () => {
    setBollingerLoading(true);
    setBollingerError(null);
    try {
      const { data, error } = await supabase
        .from('bollinger_breakouts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      setBollingerData(data || []);
    } catch (e) {
      setBollingerError(e instanceof Error ? e.message :  'Failed to load breakout data');
    } finally {
      setBollingerLoading(false);
    }
  };

  useEffect(() => {
    fetchAtlasData();
    fetchBollingerData();
  }, []);

  return (
    <div className="w-full max-w-7xl ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Sentiment Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Market Sentiment</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-500">Latest market trend signals</p>
            </div>
            <Link href="/atlas">
                <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                View All
                </button>
            </Link>
            
          </div>
          
          {atlasLoading ? (
            <LoadingSkeleton count={5} />
          ) : atlasError ? (
            <ErrorState message={atlasError} onRetry={fetchAtlasData} />
          ) : atlasData.length === 0 ? (
            <EmptyState message="No sentiment data available" />
          ) : (
            <div className="space-y-3">
              {atlasData.map((item) => (
                <SentimentCard key={item.id} data={item} />
              ))}
            </div>
          )}
        </section>

        {/* Bollinger Breakouts Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Bollinger Breakouts</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-500">Live market volatility alerts</p>
            </div>
            <Link href="bollinger-breakouts">
                <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                View All
                </button>
            </Link>
            
          </div>
          
          {bollingerLoading ? (
            <LoadingSkeleton count={5} />
          ) : bollingerError ? (
            <ErrorState message={bollingerError} onRetry={fetchBollingerData} />
          ) : bollingerData.length === 0 ? (
            <EmptyState message="No recent breakouts" />
          ) : (
            <div className="space-y-3">
              {bollingerData.map((item) => (
                <BollingerCard key={item.id} data={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}