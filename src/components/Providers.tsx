/**
 * ============================================================================
 * GLOBAL PROVIDERS COMPONENT
 * ============================================================================
 * 
 * Beginner's Guide to Providers in React:
 * 
 * What is a Provider?
 * React uses "Context Providers" to pass data and services down to every nested
 * component in the application without having to manually pass props at every level ("prop drilling").
 * 
 * This file sets up 3 essential providers:
 * 1. Redux Provider (`<Provider store={store}>`):
 *    Makes the global Redux store accessible to all client components.
 * 2. React Query Provider (`<QueryClientProvider client={queryClient}>`):
 *    Manages asynchronous server data fetching, automatic caching, and background refreshing.
 * 3. Auth Initializer (`<AuthInitializer>`):
 *    Fires on app mount to check if an active user session exists in cookies and populates Redux.
 * 4. Toast Notifications (`<ToastContainer>`):
 *    Allows any component to show friendly alerts: `toast.success(...)`, `toast.error(...)`.
 */

"use client";

import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useAppDispatch } from "@/redux/hooks";
import { fetchUser } from "@/redux/slices/authSlice";

/**
 * Client initializer that triggers once when the app loads to restore the logged-in session.
 */
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  // `useState(() => new QueryClient(...))` ensures QueryClient is instantiated once per user session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // Don't trigger refetches just because user changed tabs
            retry: 1,                    // Retry failed requests once before showing an error
          },
        },
      })
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          {children}
          {/* Global toast notification system configured to dismiss automatically after 3 seconds */}
          <ToastContainer position="top-right" autoClose={3000} />
        </AuthInitializer>
      </QueryClientProvider>
    </Provider>
  );
}
