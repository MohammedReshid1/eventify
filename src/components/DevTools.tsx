import { useEffect } from 'react';

/**
 * A component that adds global error handlers for debugging
 */
const DevTools = () => {
  useEffect(() => {
    // Store the original console.error
    const originalConsoleError = console.error;

    // Override console.error to log to both console and localStorage
    console.error = (...args) => {
      // Call the original console.error
      originalConsoleError.apply(console, args);

      // Get existing errors from localStorage
      const existingErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      
      // Add new error with timestamp
      existingErrors.push({
        timestamp: new Date().toISOString(),
        message: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' '),
      });
      
      // Keep only the last 20 errors
      const trimmedErrors = existingErrors.slice(-20);
      
      // Save back to localStorage
      localStorage.setItem('app_errors', JSON.stringify(trimmedErrors));
    };

    // Add global unhandled error listener
    const handleGlobalError = (event) => {
      console.error('Unhandled error:', event.error || event.message);
      // Optionally prevent the browser from showing its own error dialog
      event.preventDefault();
    };

    // Add global unhandled promise rejection listener
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup function
    return () => {
      console.error = originalConsoleError;
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default DevTools; 