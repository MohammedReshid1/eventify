
import { Loader2 } from "lucide-react";
import React from "react";

export default function LoadingScreen() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#F97316]" />
        <p className="mt-4 text-lg text-gray-600">Loading content...</p>
      </div>
    </div>
  );
}
