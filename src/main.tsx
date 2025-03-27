import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./utils/createAdminHelper.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Create a style element to ensure dark mode styles are applied properly
if (typeof document !== 'undefined') {
  // Create a style element
  const style = document.createElement('style');
  style.textContent = `
    :root {
      color-scheme: light;
    }
    
    :root.dark {
      color-scheme: dark;
    }
    
    [data-theme="dark"] {
      color-scheme: dark;
    }
  `;
  document.head.appendChild(style);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
