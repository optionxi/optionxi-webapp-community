// app/portfolio/page.tsx

"use client";

import * as React from "react";
// UI Components (from shadcn/ui)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  AreaChart,
  Boxes,
  Briefcase,
  RefreshCw,
  Shield,
} from "lucide-react";
import { FyersRepository } from "../utils/fyers_api_endpoints";
import { FyersHoldingsResponse, FyersHoldingModel, FyersPositionsResponse, FyersPositionModel } from "../utils/fyers_datamodel";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/utils/firebaseConfig";
import { signIn } from "next-auth/react";
import Image from 'next/image';

// Helper to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// ============================================================================
// STATE & SKELETON COMPONENTS
// ============================================================================

const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center h-[400px]">
    <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
    <h3 className="mt-4 text-lg font-semibold text-foreground">
      Failed to load data
    </h3>
    <p className="mt-2 mb-4 text-sm text-muted-foreground">{message}</p>
    <Button onClick={onRetry}>
      <RefreshCw className="mr-2 h-4 w-4" />
      Retry
    </Button>
  </div>
);

const EmptyState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center h-[400px]">
    <Boxes className="mx-auto h-12 w-12 text-muted-foreground" />
    <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
    <p className="mt-2 text-sm text-muted-foreground">{description}</p>
  </div>
);

const SummarySkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {[...Array(4)].map((_, i) => (
      <Card key={i}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-5 w-2/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="mt-2 h-4 w-1/3" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const TableSkeleton = ({ columns }: { columns: number }) => (
  <Card>
    <Table>
      <TableHeader>
        <TableRow>
          {[...Array(columns)].map((_, i) => (
            <TableHead key={i}>
              <Skeleton className="h-5 w-full" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {[...Array(columns)].map((_, cellIndex) => (
              <TableCell key={cellIndex}>
                <Skeleton className="h-5 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
);

// ============================================================================
// HOLDINGS TAB COMPONENTS
// ============================================================================

const HoldingsSummary = ({ data }: { data: FyersHoldingsResponse }) => {
  const overall = data.overall;
  const isProfit = overall.totalPl >= 0;
  const pnlClass = isProfit ? "text-success-foreground" : "text-destructive";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Value</CardTitle>
          <AreaChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(overall.totalCurrentValue)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(overall.totalInvestment)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
          <div
            className={`text-sm font-bold ${pnlClass} flex items-center gap-1`}
          >
            {isProfit ? "▲" : "▼"}
            {overall.pnlPerc.toFixed(2)}%
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${pnlClass}`}>
            {formatCurrency(overall.totalPl)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Holdings</CardTitle>
          <Boxes className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overall.countTotal}</div>
        </CardContent>
      </Card>
    </div>
  );
};

const HoldingsTable = ({ holdings }: { holdings: FyersHoldingModel[] }) => (
  <Card>
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead className="text-right">Qty.</TableHead>
            <TableHead className="text-right">Avg. Cost</TableHead>
            <TableHead className="text-right">LTP</TableHead>
            <TableHead className="text-right">P&L</TableHead>
            <TableHead className="text-right">P&L %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings.map((holding) => {
            const isProfit = holding.pl >= 0;
            const pnlClass = isProfit
              ? "text-success-foreground"
              : "text-destructive";
            return (
              <TableRow key={holding.id}>
                <TableCell>
                  <div className="font-medium">{holding.symbol}</div>
                  <div className="text-xs text-muted-foreground">
                    {holding.holdingType}
                  </div>
                </TableCell>
                <TableCell className="text-right">{holding.quantity}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(holding.costPrice)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(holding.ltp)}
                </TableCell>
                <TableCell className={`text-right font-medium ${pnlClass}`}>
                  {formatCurrency(holding.pl)}
                </TableCell>
                <TableCell className={`text-right font-medium ${pnlClass}`}>
                  {isProfit ? "+" : ""}
                  {((holding.pl / (holding.costPrice * holding.quantity)) * 100).toFixed(2)}%
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  </Card>
);

const HoldingsTab = () => {
  const [data, setData] = React.useState<FyersHoldingsResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const repository = React.useMemo(() => new FyersRepository(), []);

  const fetchHoldings = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
    if (!user) return; 
      const result = await repository.getHoldings();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch holdings';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [repository]);

  React.useEffect(() => {
      // Listen to Firebase auth state
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
      });
      return () => unsubscribe();
    }, []);
  
    React.useEffect(() => {
      if (user) {
        fetchHoldings(); // ✅ Only load orders once authenticated
      }
    }, [user]);

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SummarySkeleton />
        <TableSkeleton columns={6} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={fetchHoldings}
      />
    );
  }

  if (!data || data.holdings.length === 0) {
    return (
      <EmptyState
        title="No Holdings Found"
        description="Your investments will appear here once you add them to your portfolio."
      />
    );
  }

  return (
    <div className="space-y-4">
      <HoldingsSummary data={data} />
      <HoldingsTable holdings={data.holdings} />
    </div>
  );
};



// ============================================================================
// POSITIONS TAB COMPONENTS
// ============================================================================

const PositionsSummary = ({ data }: { data: FyersPositionsResponse }) => {
  const overall = data.overall;
  const isProfit = overall.totalPnl >= 0;
  const totalPnlClass = isProfit ? "text-success-foreground" : "text-destructive";
  const unrealizedPnlClass = overall.pnlUnrealized >= 0 ? "text-success-foreground" : "text-destructive";
  const realizedPnlClass = overall.pnlRealized >= 0 ? "text-success-foreground" : "text-destructive";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
           <AreaChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalPnlClass}`}>
            {formatCurrency(overall.totalPnl)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unrealized P&L</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${unrealizedPnlClass}`}>
            {formatCurrency(overall.pnlUnrealized)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Realized P&L</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${realizedPnlClass}`}>
            {formatCurrency(overall.pnlRealized)}
          </div>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
          <Boxes className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overall.totalCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};

const PositionsTable = ({
  positions,
}: {
  positions: FyersPositionModel[];
}) => (
  <Card>
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead className="text-right">Net Qty.</TableHead>
            <TableHead className="text-right">Avg. Price</TableHead>
            <TableHead className="text-right">LTP</TableHead>
            <TableHead className="text-right">P&L</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((pos) => {
            const isProfit = pos.pl >= 0;
            const pnlClass = isProfit
              ? "text-success-foreground"
              : "text-destructive";
            const isOpen = pos.netQty !== 0;
            return (
              <TableRow key={pos.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{pos.symbol}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${isOpen ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                      {isOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {pos.productType}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">{pos.netQty}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(pos.netAvg)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(pos.ltp)}
                </TableCell>
                <TableCell className={`text-right font-medium ${pnlClass}`}>
                  {formatCurrency(pos.pl)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  </Card>
);

const PositionsTab = () => {
  const [data, setData] = React.useState<FyersPositionsResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const repository = React.useMemo(() => new FyersRepository(), []);
  const [user, setUser] =React. useState<User | null>(null);

  const fetchPositions = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
        if (!user) return; 
      const result = await repository.getPositions();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch positions';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [repository]);

   React.useEffect(() => {
      // Listen to Firebase auth state
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
      });
      return () => unsubscribe();
    }, []);
  
    React.useEffect(() => {
      if (user) {
        fetchPositions(); // ✅ Only load orders once authenticated
      }
    }, [user]);

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
  

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SummarySkeleton />
        <TableSkeleton columns={5} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={fetchPositions}
      />
    );
  }

  if (!data || data.netPositions.length === 0) {
    return (
      <EmptyState
        title="No Positions Found"
        description="Your open and closed positions for the day will appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      <PositionsSummary data={data} />
      <PositionsTable positions={data.netPositions} />
    </div>
  );
};

// ============================================================================
// MAIN PORTFOLIO PAGE COMPONENT
// ============================================================================

export default function FyersPortfolioPage() {
  const [activeTab, setActiveTab] = React.useState("holdings");

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Portfolio
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
        </TabsList>
        <TabsContent value="holdings" className="mt-6">
          <HoldingsTab />
        </TabsContent>
        <TabsContent value="positions" className="mt-6">
          <PositionsTab />
        </TabsContent>
      </Tabs>
    </main>
  );
}