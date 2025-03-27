import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
          <div className="max-w-md w-full text-center">
            <div className="text-orange-500 text-5xl mb-4">😕</div>
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Something went wrong</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We're having trouble displaying this page. Please try refreshing or contact support if the problem persists.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => {
                  // Reset the error state
                  this.setState({ hasError: false, error: null });
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Try Again
              </button>
            </div>
            {this.state.error && (
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md text-left">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-mono overflow-auto">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 