'use client';

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component from shadcn/ui
import { Card, CardContent } from '@/components/ui/card';

export const ScannerCardSkeletonStock = () => {
  return (
    <div className="space-y-4">
      {/* Mimics the timeframe group header */}
      <div className="flex items-center space-x-2 mb-4">
        <Skeleton className="h-5 w-5 rounded-full" /> {/* Mimics the timeframe icon */}
        <Skeleton className="h-6 w-32" /> {/* Mimics the timeframe title */}
      </div>

      {/* Mimics the grid layout for screeners */}
      <div className="grid gap-4 ">
        {[...Array(1)].map((_, index) => (
          <Card key={index} className="w-full">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 flex items-center space-x-4">
                  <div>
                    <Skeleton className="h-6 w-48 mb-2" /> {/* Mimics the screener name */}
                    <Skeleton className="h-4 w-24 mt-2" /> {/* Mimics the badge */}
                    <div className="flex items-center mt-2">
                      <Skeleton className="h-4 w-4 mr-1" /> {/* Mimics the Clock icon */}
                      <Skeleton className="h-4 w-32" /> {/* Mimics the timeframe and timeAgo */}
                    </div>
                  </div>
                </div>

                <Skeleton className="h-8 w-8 rounded-full" /> {/* Mimics the info button */}
              </div>

              {/* Mimics the expanded content */}
              {/* <div className="mt-4 pt-4 border-t border-border">
                <Skeleton className="h-4 w-full mb-4" /> 
                <div className="bg-secondary/50 p-4 rounded-lg backdrop-blur-sm">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <ul className="list-disc pl-5 space-y-1">
                    {[...Array(3)].map((_, index) => (
                      <li key={index}>
                        <Skeleton className="h-4 w-64" /> 
                      </li>
                    ))}
                  </ul>
                </div>
              </div> */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};