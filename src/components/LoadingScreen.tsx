import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-950">
      <div className="relative">
        <div className="w-20 h-20 border-t-4 border-b-4 border-orange-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-orange-500">FE</span>
        </div>
      </div>
      <h2 className="mt-6 text-xl font-semibold text-gray-800 dark:text-gray-200">Loading FindEvent</h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Discovering amazing events for you...</p>
    </div>
  );
};

export default LoadingScreen; 