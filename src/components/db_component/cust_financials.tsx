'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchStockFinancials } from '@/lib/supabaseDB/supabase_financials';
import { StockFinancial } from '@/datamodels/financial_model';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Book } from 'lucide-react';
import { Separator } from '../ui/separator';
import { CurrentRatioInfo, DebtToAssetsInfo, StockholdersEquityInfo, TotalAssetsInfo, TotalDebtInfo, WorkingCapitalInfo } from './info_button';
import { formatNumberRupees } from '@/lib/supabaseDB/helper_formatdata';
import Link from 'next/link';
import EmptyState from '@/app/(authenticated)/atlas/atlas-empty-result';

interface StockFinancialsProps {
  stockname: string;
}

const StockFinancials = ({ stockname }: StockFinancialsProps) => {
  const [financials, setFinancials] = useState<StockFinancial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStockFinancials(stockname);
        if (data) {
          setFinancials(data);
        } else {
          setError('No data found');
        }
      } catch (err) {
        setError('An error occurred while fetching data');
        console.log("Error:"+err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stockname]);

  // Function to format the financial summary with line breaks
  const formatSummary = (summary: string | null) => {
    if (!summary) return [];
    return summary.split('\n').map((line, index) => (
      <p key={index} className={line.startsWith('  ') ? 'ml-0' : ''}>
        {line}
      </p>
    ));
  };

  // Function to render growth indicators
  const renderGrowthIndicator = (value: number | null | undefined) => {
    if (value === null || value === undefined) return null;
    const isPositive = value >= 0;
    const Icon = isPositive ? ArrowUp : ArrowDown;
    const color = isPositive ? 'text-green-500' : 'text-red-500';

    return (
      <div className="flex items-center">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className={`ml-1 ${color}`}>{Math.abs(value).toFixed(2)}%</span>
      </div>
    );
  };
  return (
    <div className="w-full">
       <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Book className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold tracking-tight">
            Financial Summary
          </CardTitle>
        </div>
        <Link href={`/financials/${stockname}`} passHref>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 cursor-pointer">
            <span className="text-sm font-semibold text-white">View more</span>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </div>
        </Link>
      </div>
        <br/>
        <div>
          {loading ? (
            <Card className="mt-6 bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground dark:text-foreground">
                  Latest News
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-3/4 bg-muted dark:bg-muted" />
                      <Skeleton className="h-4 w-full bg-muted dark:bg-muted" />
                      <Skeleton className="h-4 w-full bg-muted dark:bg-muted" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <EmptyState message={`${error} for ${stockname}`}/>
          ) : (
            <div className="space-y-6 text-foreground dark:text-foreground">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Total Assets</CardTitle>
                  <div className="flex-shrink-0">
                    <TotalAssetsInfo growth={financials?.total_assets_growth || 0} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumberRupees(financials?.total_assets || 0)}
                  </div>
                  {renderGrowthIndicator(financials?.total_assets_growth)}
                </CardContent>
              </Card>
      
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Total Debt</CardTitle>
                  <div className="flex-shrink-0">
                    <TotalDebtInfo 
                      growth={financials?.debt_growth || 0}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumberRupees(financials?.total_debt || 0)}
                  </div>
                  {renderGrowthIndicator(financials?.debt_growth)}
                </CardContent>
              </Card>
      
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Working Capital</CardTitle>
                  <div className="flex-shrink-0">
                    <WorkingCapitalInfo growth={financials?.working_capital_growth || 0} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumberRupees(financials?.working_capital || 0)}
                  </div>
                  {renderGrowthIndicator(financials?.working_capital_growth)}
                </CardContent>
              </Card>
      
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Stockholders Equity</CardTitle>
                  <div className="flex-shrink-0">
                    <StockholdersEquityInfo growth={financials?.equity_growth || 0} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumberRupees(financials?.stockholders_equity || 0)}
                  </div>
                  {renderGrowthIndicator(financials?.equity_growth)}
                </CardContent>
              </Card>
      
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Debt to Assets</CardTitle>
                  <div className="flex-shrink-0">
                    <DebtToAssetsInfo 
                      debtToAssets={financials?.debt_to_assets || 0}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {financials?.debt_to_assets?.toFixed(2)}%
                  </div>
                  <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                        Number(financials?.debt_to_assets) > 50 ? "bg-red-500" : "bg-green-500"
                      }`}
                      style={{ width: `${financials?.debt_to_assets}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
      
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Current Ratio</CardTitle>
                  <div className="flex-shrink-0">
                    <CurrentRatioInfo ratio={financials?.current_ratio || 0} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {financials?.current_ratio?.toFixed(2)}
                  </div>
                  <Badge
                    variant={
                      financials?.current_ratio
                        ? financials.current_ratio > 2
                          ? 'default'
                          : financials.current_ratio > 1
                          ? 'secondary'
                          : 'destructive'
                        : 'secondary'
                    }
                    className="mt-2"
                  >
                    {financials?.current_ratio
                      ? financials.current_ratio > 2
                        ? 'Strong'
                        : 'Moderate'
                      : 'N/A'}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
          )}
        </div>
      <br/>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Book className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold tracking-tight">
            Financial Observation
          </CardTitle>
        </div>
        {/* <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary text-sm font-medium">₹</span>
        </div> */}
      </div>
      <br/>
      <div className="space-y-2 p-4">
        {formatSummary(financials?.observations ?? `${error} for ${stockname}, Please click on view more option on the financial summary`)}
      </div>
      <br/>
      <Separator/>
    </div>
  );
};

export default StockFinancials;