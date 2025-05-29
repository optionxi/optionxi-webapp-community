// components/LoadingSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeletonChart() {
  return (
    <div className="p-2 flex flex-col space-y-4">
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
