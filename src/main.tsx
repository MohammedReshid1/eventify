
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

// Add an event listener for when the page loads to check for payment return
window.addEventListener('load', () => {
  // Check if we have an order_id or tx_ref parameter, which would indicate a payment return
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('order_id');
  const txRef = urlParams.get('tx_ref');
  const transactionId = urlParams.get('transaction_id');

  // If we have payment return parameters but are not on the payment callback page, redirect
  if ((orderId || txRef || transactionId) && 
      !window.location.pathname.includes('/payment-callback')) {
    window.location.href = `/payment-callback?${urlParams.toString()}`;
  }
});

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
