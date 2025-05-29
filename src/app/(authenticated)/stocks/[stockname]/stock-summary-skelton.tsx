import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, PieChart, ChartArea } from "lucide-react";

export function StockSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Current Price Skeleton */}
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Current Price
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <Skeleton className="w-24 h-10" />
            <Skeleton className="w-12 h-5" />
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex justify-between items-center">
              <Skeleton className="w-20 h-5" />
              <Skeleton className="w-16 h-5" />
            </div>
            <br />
            <Skeleton className="w-48 h-4" />
          </div>
        </CardContent>
      </Card>

      {/* Price Range Skeleton */}
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ChartArea className="h-4 w-4 text-blue-500" />
            52 Week Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <Skeleton className="w-24 h-10" />
              <Skeleton className="w-12 h-5" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="w-full h-2 rounded-full" />
            <div className="flex justify-between text-sm">
              <div className="flex flex-col">
                <Skeleton className="w-12 h-4" />
                <Skeleton className="w-16 h-5" />
              </div>
              <div className="flex flex-col text-right">
                <Skeleton className="w-12 h-4" />
                <Skeleton className="w-16 h-5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Skeleton */}
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <PieChart className="h-4 w-4 text-blue-500" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-12 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-12 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-12 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StockSummarySkeleton;
