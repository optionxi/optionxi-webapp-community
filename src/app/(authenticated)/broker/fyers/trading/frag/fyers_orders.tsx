'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FyersOrderModel } from '../utils/fyers_datamodel';
import { FyersRepository } from '../utils/fyers_api_endpoints';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/utils/firebaseConfig';
import { Shield } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

// --- TYPES ---
type OrderStatusFilter = 'all' | 'executed' | 'pending' | 'failed';
type OrderTypeFilter = 'all' | 'buy' | 'sell';

interface OrderFilters {
  status: OrderStatusFilter;
  type: OrderTypeFilter;
  search: string;
}

// --- HELPER ICONS ---
const SearchIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// --- HELPER FUNCTIONS (Centralized) ---
const getOrderStatus = (order: FyersOrderModel): string => {
  const statusMap: Record<number, string> = {
    1: 'Pending',
    2: 'Filled',
    3: 'Cancelled',
    4: 'Rejected',
    5: 'Partially Filled',
    6: 'Pending', // Assuming 6 is also a pending state like 'Trigger pending'
    7: 'Filled',
  };
  return statusMap[order.status] || order.orderNumStatus || 'Unknown';
};

const getOrderStatusColor = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('filled')) {
    return 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-500/20';
  }
  if (s.includes('pending') || s.includes('partially')) {
    return 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-500/20';
  }
  if (s.includes('cancelled') || s.includes('rejected')) {
    return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-500/20';
  }
  return 'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-500/20';
};

const formatDateTime = (dateTimeStr: string): string => {
  try {
    const date = new Date(dateTimeStr.replace(/(\d{2})-(\w{3})-(\d{4})/, '$2 $1, $3'));
    if (!isNaN(date.getTime())) {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    }
    return dateTimeStr;
  } catch {
    return dateTimeStr;
  }
};

// --- MAIN COMPONENT ---
const FyersOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<FyersOrderModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [filters, setFilters] = useState<OrderFilters>({
    status: 'all',
    type: 'all',
    search: '',
  });

  const repository = useMemo(() => new FyersRepository(), []);

   useEffect(() => {
    // Listen to Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadOrders(); // ✅ Only load orders once authenticated
    }
  }, [user]);

  const loadOrders = async () => {
    try {
        if (!user) return; 
      setIsLoading(true);
      setError(null);
      const ordersData = await repository.getOrders();
      setOrders(ordersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching orders.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => {
        const status = getOrderStatus(order).toLowerCase();

        // Status Filter
        if (filters.status === 'executed' && !status.includes('filled')) return false;
        if (filters.status === 'pending' && !(status.includes('pending') || status.includes('partially'))) return false;
        if (filters.status === 'failed' && !(status.includes('cancelled') || status.includes('rejected'))) return false;

        // Type Filter
        if (filters.type === 'buy' && order.side !== 1) return false;
        if (filters.type === 'sell' && order.side !== -1) return false;

        // Search Filter
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          return order.symbol.toLowerCase().includes(searchTerm) || order.description.toLowerCase().includes(searchTerm);
        }
        
        return true;
      });
  }, [orders, filters]);

  const orderCounts = useMemo(() => {
    return orders.reduce(
      (counts, order) => {
        const status = getOrderStatus(order).toLowerCase();
        if (status.includes('filled')) {
          counts.executed++;
        } else if (status.includes('pending') || status.includes('partially')) {
          counts.pending++;
        } else if (status.includes('cancelled') || status.includes('rejected')) {
          counts.failed++;
        }
        return counts;
      },
      { all: orders.length, executed: 0, pending: 0, failed: 0 }
    );
  }, [orders]);

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center  p-4">
        <div className="max-w-sm w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Welcome Back
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Sign in to connect your Fyers trading account
            </p>
          </div>
          <button
            onClick={() => signIn('google')}
            className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
          >
            <Image src="/assets/svgs/google.svg" alt="Google" width={20} height={20} className="mr-3" />
            Continue with Google
          </button>
        </div>
      </div>
    );
  }


  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} onRetry={loadOrders} />;

  return (
    <div className="min-h-screen  text-gray-900 dark:text-gray-100">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Order Book
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Track and manage all your trading orders in one place.
            </p>
          </div>
          <button
            onClick={loadOrders}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
          >
            <RefreshIcon />
            Refresh
          </button>
        </div>

        {/* Filters and Controls */}
        <div className="sticky top-0 z-10 bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-sm py-4 mb-6">
          <div className="space-y-4">
            {/* Status Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {(Object.keys(orderCounts) as OrderStatusFilter[]).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setFilters(prev => ({ ...prev, status: tab }))}
                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                      filters.status === tab
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                    }`}
                  >
                    {tab} <span className="text-xs bg-gray-200 dark:bg-gray-700/80 rounded-full px-2 py-0.5 ml-1">{orderCounts[tab]}</span>
                  </button>
                ))}
              </nav>
            </div>
            {/* Search and Type Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search by symbol or description..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              <div className="flex-shrink-0">
                 <div className="inline-flex rounded-lg shadow-sm">
                    {(['all', 'buy', 'sell'] as OrderTypeFilter[]).map((type, idx) => (
                        <button key={type} onClick={() => setFilters(p => ({...p, type}))} className={`px-4 py-2 text-sm font-medium capitalize border border-gray-300 dark:border-gray-700 transition-colors
                            ${idx === 0 ? 'rounded-l-lg' : ''}
                            ${idx === 2 ? 'rounded-r-lg' : '-ml-px'}
                            ${filters.type === type ? 'bg-blue-600 text-white border-blue-600 z-10' : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'}
                        `}>
                            {type}
                        </button>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4 md:space-y-0">
             {/* Desktop Table */}
            <div className="hidden md:block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    {['Symbol', 'Type', 'Qty', 'Price', 'Status', 'Time', 'Actions'].map(header => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredOrders.map(order => <OrderRow key={order.id} order={order} />)}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-4">
              {filteredOrders.map(order => <OrderCard key={order.id} order={order} />)}
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
};


// --- SUB-COMPONENTS ---

const OrderRow: React.FC<{ order: FyersOrderModel }> = ({ order }) => {
  const status = getOrderStatus(order);
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900 dark:text-white">{order.symbol}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{order.description}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${
          order.side === 1 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
        }`}>
          {order.side === 1 ? 'BUY' : 'SELL'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm tabular-nums">
        <span title={`Filled: ${order.filledQty}`}>{order.filledQty}</span> / <span>{order.qty}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm tabular-nums">
        <div>{`₹${order.limitPrice > 0 ? order.limitPrice.toFixed(2) : 'Market'}`}</div>
        {order.tradedPrice > 0 && <div className="text-xs text-gray-500">Avg: ₹{order.tradedPrice.toFixed(2)}</div>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${getOrderStatusColor(status)}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {formatDateTime(order.orderDateTime)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Details</button>
        {status.toLowerCase().includes('pending') && (
            <button className="ml-4 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">Cancel</button>
        )}
      </td>
    </tr>
  );
};

const OrderCard: React.FC<{ order: FyersOrderModel }> = ({ order }) => {
    const status = getOrderStatus(order);
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-4">
            {/* Card Header */}
            <div className="flex justify-between items-start">
                <div>
                    <div className="font-bold text-lg text-gray-900 dark:text-white">{order.symbol}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{order.description}</div>
                </div>
                <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${getOrderStatusColor(status)}`}>
                    {status}
                </span>
            </div>
            
            {/* Card Body */}
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                    <div className="text-gray-500 dark:text-gray-400">Type</div>
                    <div className={`font-semibold ${order.side === 1 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {order.side === 1 ? 'BUY' : 'SELL'}
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="text-gray-500 dark:text-gray-400">Quantity</div>
                    <div className="font-semibold tabular-nums">{order.filledQty} / {order.qty}</div>
                </div>
                <div className="space-y-1">
                    <div className="text-gray-500 dark:text-gray-400">Price</div>
                    <div className="font-semibold tabular-nums">
                        {`₹${order.limitPrice > 0 ? order.limitPrice.toFixed(2) : 'Market'}`}
                        {order.tradedPrice > 0 && <span className="text-xs font-normal text-gray-500"> (Avg: ₹{order.tradedPrice.toFixed(2)})</span>}
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="text-gray-500 dark:text-gray-400">Time</div>
                    <div className="font-semibold">{formatDateTime(order.orderDateTime)}</div>
                </div>
            </div>

            {/* Card Footer */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex items-center gap-4">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Details</button>
                 {status.toLowerCase().includes('pending') && (
                    <button className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">Cancel</button>
                )}
            </div>
        </div>
    );
}

const LoadingSkeleton: React.FC = () => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
    <div className="space-y-4">
      <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
      <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        ))}
      </div>
    </div>
  </div>
);

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="min-h-screen flex items-center justify-center text-center px-4">
    <div>
      <div className="text-5xl mb-4">🕸️</div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        We couldn&apos;t load your orders. Please check your connection and try again.
        <br />
        <code className="text-xs text-red-500 mt-2 block bg-red-500/10 p-2 rounded">{error}</code>
      </p>
      <button
        onClick={onRetry}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg transition-colors duration-200"
      >
        Try Again
      </button>
    </div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-16 px-6  border border-gray-200 dark:border-gray-800 rounded-lg">
    <div className="text-5xl mb-4">🗂️</div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
      No Orders Found
    </h3>
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
      There are no orders that match your current filter settings.
    </p>
  </div>
);

export default FyersOrdersPage;