import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SparkAreaStocksLoading() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex flex-col items-end gap-3">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-2 w-40" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="pt-4">
          <Skeleton className="h-24 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
