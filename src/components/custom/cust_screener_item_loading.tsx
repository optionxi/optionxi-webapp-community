import { Skeleton } from "../ui/skeleton";

const CustomScreenerItemLoading= () => {
  return (
    <div className="m-2 flex justify-between items-center rounded-xl p-3 dark:bg-gray-900">
    <div className="flex items-center w-3/5">
      {/* Skeleton for Image */}
      <Skeleton className="rounded-full bg-gray-300 dark:bg-gray-700 w-9 h-9 mr-2.5" />
      
      {/* Skeleton for Title */}
      <Skeleton className="h-5 w-2/3 bg-gray-300 dark:bg-gray-700 rounded-sm" />
      
    </div>
    
  </div>
  );
};

export default CustomScreenerItemLoading;