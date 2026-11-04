"use client";

import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { fetchUser } from "@/store/slices/authSlice";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
        </AuthInitializer>
      </QueryClientProvider>
    </Provider>
  );
}
