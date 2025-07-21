import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LogRocket from "logrocket";

// Suppress ResizeObserver loop error (common with AG Grid)
const suppressResizeObserverError = () => {
  // Suppress ResizeObserver loop errors in the console
  const originalError = console.error;
  console.error = (...args) => {
    if (
      args.length > 0 &&
      typeof args[0] === "string" &&
      args[0].includes(
        "ResizeObserver loop completed with undelivered notifications",
      )
    ) {
      return; // Suppress this specific error
    }
    originalError.apply(console, args);
  };

  // Also handle window error events
  window.addEventListener("error", (e) => {
    if (
      e.message &&
      e.message.includes(
        "ResizeObserver loop completed with undelivered notifications",
      )
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });

  // Handle unhandled promise rejections that might contain this error
  window.addEventListener("unhandledrejection", (e) => {
    if (
      e.reason &&
      typeof e.reason === "string" &&
      e.reason.includes(
        "ResizeObserver loop completed with undelivered notifications",
      )
    ) {
      e.preventDefault();
      return false;
    }
  });
};

suppressResizeObserverError();

if (import.meta.env.PROD) {
  LogRocket.init("chg-healthcare/oneview-prototype");
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
