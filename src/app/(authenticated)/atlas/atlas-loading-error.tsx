import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const AtlasLoadingSkeleton = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 pl-4">
            <div className="space-y-2">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
          </CardHeader>

          <CardContent className="pl-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((j) => (
                <div key={j} className="flex items-center gap-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex justify-between">
                {[1, 2, 3].map((k) => (
                  <div key={k} className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const AtlasError: React.FC<{ error: string; onRetry: () => void }> = ({ 
  error, 
  onRetry 
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>There was an error loading the Atlas signals: {error}</p>
          <Button 
            variant="outline" 
            onClick={onRetry}
            className="w-fit"
          >
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};