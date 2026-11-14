// Global React Query, Redux, and Toast notification providers

"use client";

import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useAppDispatch } from "@/redux/hooks";
import { fetchUser } from "@/redux/slices/authSlice";

// Restores the authenticated user session into Redux on app mount
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
