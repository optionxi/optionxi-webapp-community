'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Coins, PiggyBank } from "lucide-react";
import { AssetsCapital, DebtLiabilities, ShareCapitalEquity } from "@/datamodels/financial_tables_model";
import { formatNumberRupees } from "@/lib/supabaseDB/helper_formatdata";
import { FallbackImage } from '../custom/cust_fallback_image';
import { cn } from '@/lib/utils';

interface StockDataTablesProps {
  assets: AssetsCapital[]
  debt: DebtLiabilities[]
  equity: ShareCapitalEquity[]
  stockname: string
}

type DataItem = AssetsCapital | DebtLiabilities | ShareCapitalEquity;

const transformData = (data: DataItem[], metrics: string[]) => {
  // Ensure year is converted to string
  const years = data.map((item) => String(item.year));
  
  // Ensure values are numbers
  const transformedData = metrics.map((metric) => ({
    metric,
    values: data.map((item) => Number(item[metric as keyof DataItem] || 0)),
  }));
  
  return { years, transformedData };
};

interface DataSectionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  years: string[];
  data: { metric: string; values: number[] }[];
}

const DataSection: React.FC<DataSectionProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  years, 
  data 
}) => (
  <Card className="w-full mb-6">
    <CardHeader className="flex flex-row items-center gap-4 p-4">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm mt-1">{description}</CardDescription>
      </div>
    </CardHeader>
    <CardContent className="p-4">
      <div className="border rounded-lg">
        <div className="overflow-x-auto scrollbar-thin">
          <div className="min-w-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  {years.map((year) => (
                    <TableHead key={year}>{year}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.metric}>
                    <TableCell className="font-medium">{row.metric}</TableCell>
                    {row.values.map((value, index) => (
                      <TableCell key={`${row.metric}-${index}`}>
                        {formatNumberRupees(value)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function StockDataTables({ assets, debt, equity, stockname }: StockDataTablesProps) {
  const assetsMetrics = ["Invested Capital", "Working Capital"];
  const debtMetrics = ["Net Debt", "Total Debt", "Current Liabilities", "Total Liabilities Net Minority Interest"];
  const equityMetrics = ["Stockholders Equity", "Retained Earnings", "Common Stock", "Share Issued"];

  const assetsTransformed = transformData(assets, assetsMetrics);
  const debtTransformed = transformData(debt, debtMetrics);
  const equityTransformed = transformData(equity, equityMetrics);

  return (
    <div className="space-y-6">
      <Card className="w-full ">
        <CardHeader className="p-4">
          <div className="p-2 flex flex-row items-center space-x-4">
                  <div className="relative">
                    <FallbackImage
                      src={`/assets/stockimages/${stockname}.png`}
                      alt={`${stockname} logo`}
                      width={60}
                      height={60}
                      className={cn(
                        "rounded-xl",
                        "border border-gray-200 dark:border-white/20",
                        "transition-transform duration-300",
                        "group-hover:scale-110",
                        "shadow-lg"
                      )}
                    />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight">{stockname}</h1>
                    <p className="text-muted-foreground hidden sm:block">Financial overview and insights</p>
                  </div>
                </div>
          {/* <CardTitle className="text-2xl">{stockname} Financial Overview</CardTitle>
          <CardDescription className="text-sm">Comprehensive financial analysis and metrics</CardDescription> */}
        </CardHeader>
      </Card>

      <DataSection
        title="Assets & Capital"
        description="Overview of company's invested and working capital positions"
        icon={Building2}
        years={assetsTransformed.years}
        data={assetsTransformed.transformedData}
      />

      <DataSection
        title="Debt & Liabilities"
        description="Analysis of company's debt structure and obligations"
        icon={Coins}
        years={debtTransformed.years}
        data={debtTransformed.transformedData}
      />

      <DataSection
        title="Share Capital & Equity"
        description="Details of stockholder equity and share structure"
        icon={PiggyBank}
        years={equityTransformed.years}
        data={equityTransformed.transformedData}
      />
    </div>
  );
}

export default StockDataTables;