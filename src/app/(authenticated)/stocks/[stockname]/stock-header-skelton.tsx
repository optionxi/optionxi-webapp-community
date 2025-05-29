'use client';
import { Skeleton } from "@/components/ui/skeleton";

export default function HeaderSkeleton() {
  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md p-2">
              <Skeleton className="h-[72px] w-[72px] rounded-lg" />
            </div>
          </div>
          <div className="space-y-0">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-5 w-[220px] mt-2" />
          </div>
        </div>
        <div className="w-full sm:w-auto mt-4 sm:mt-0">
          <Skeleton className="h-12 w-full sm:w-[180px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}