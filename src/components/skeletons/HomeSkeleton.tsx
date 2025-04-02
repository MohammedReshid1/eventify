import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const HomeSkeleton: React.FC = () => {
  return (
    <div className="py-0">
      {/* Hero section skeleton */}
      <div className="relative mb-16 overflow-hidden">
        <div className="bg-gradient-to-br from-orange-600 to-amber-600 min-h-[300px]">
          <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
              <div className="max-w-xl">
                <Skeleton className="h-14 w-[70%] mb-3" />
                <Skeleton className="h-4 w-[90%] mb-2" />
                <Skeleton className="h-4 w-[60%] mb-6" />
                
                <div className="flex space-x-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
              
              <Skeleton className="w-full max-w-lg h-[220px] rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Category filter skeleton */}
        <div className="mb-2">
          <Skeleton className="h-8 w-48 mb-3" />
        </div>
        
        <div className="mb-8">
          <div className="flex space-x-3 pb-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-md" />
            ))}
          </div>
        </div>
        
        {/* Events section skeleton */}
        <div className="w-full mb-12">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-24" />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-48 w-full rounded-t-md" />
                <Skeleton className="h-6 w-[80%] mx-4" />
                <div className="mx-4 space-y-2 pb-4">
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[70%]" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Another events section skeleton */}
        <div className="w-full mb-12">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-24" />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-48 w-full rounded-t-md" />
                <Skeleton className="h-6 w-[80%] mx-4" />
                <div className="mx-4 space-y-2 pb-4">
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[70%]" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works section skeleton */}
        <div className="mt-12 mb-20">
          <div className="py-12 bg-orange-50 dark:bg-gray-900 rounded-lg">
            <div className="text-center mb-8">
              <Skeleton className="h-8 w-64 mx-auto mb-3" />
              <Skeleton className="h-4 w-[50%] mx-auto" />
            </div>
            
            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto px-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <Skeleton className="h-16 w-16 rounded-full mb-4" />
                  <Skeleton className="h-6 w-[70%] mb-2" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[80%] mt-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton; 