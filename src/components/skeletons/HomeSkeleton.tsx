import { Skeleton } from "@/components/ui/skeleton";

const HomeSkeleton = () => {
  return (
    <div>
      {/* Hero Section Skeleton */}
      <div className="relative mb-12 overflow-hidden">
        <div className="h-[400px] w-full bg-gradient-to-r from-orange-500/50 to-orange-400/50 animate-pulse">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <Skeleton className="h-10 w-3/4 max-w-lg mb-4" />
            <Skeleton className="h-5 w-2/4 max-w-md mb-8" />
            <div className="w-full max-w-md">
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Categories Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="flex gap-2 overflow-x-auto pb-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 shrink-0" />
            ))}
          </div>
        </div>

        {/* Featured Events Skeleton */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-24" />
          </div>
          
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col">
                <Skeleton className="h-64 w-full rounded-t-lg" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Events Skeleton */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-24" />
          </div>
          
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col">
                <Skeleton className="h-64 w-full rounded-t-lg" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton; 