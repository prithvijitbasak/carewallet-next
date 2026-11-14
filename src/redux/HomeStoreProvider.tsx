/**
 * ============================================================================
 * HOME STORE PROVIDER (SSR Preloaded State Hydration & Global Login Modal)
 * ============================================================================
 * 
 * Beginner's Guide:
 * On the home page, the server checks the incoming cookies to see if the user is logged in.
 * Rather than waiting for the client to run a `useEffect` and trigger an extra network request,
 * we pass the server-discovered `authState` into this provider!
 * 
 * Benefits:
 * 1. Zero-delay UI: The UI renders immediately in the correct logged-in or logged-out state.
 * 2. Hydration: The Redux store starts initialized with the exact server state.
 * 3. Modal integration: Hosts the global `<LoginModal />` controlled by Redux.
 */

"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "./store";
import { initialAuthState, type AuthState } from "./slices/authSlice";
import { initialUiState, setLoginModalOpen } from "./slices/uiSlice";
import LoginModal from "@/components/LoginModal";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useRouter } from "next/navigation";

type HomeStoreProviderProps = {
  children: ReactNode;
  authState?: Partial<AuthState>;
  openLoginModal?: boolean;
  store?: AppStore;
};

/**
 * Inner component that can safely use Redux hooks (`useAppDispatch`, `useAppSelector`)
 * because it is rendered inside the `<Provider>`.
 */
function HomeStoreInner({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const open = useAppSelector((state) => state.ui.loginModalOpen);

  return (
    <>
      {children}
      {/* Global Login Modal accessible from any button on the home page */}
      <LoginModal
        open={open}
        onClose={() => dispatch(setLoginModalOpen(false))}
        onSuccess={() => {
          dispatch(setLoginModalOpen(false));
          router.refresh(); // Re-runs the Server Component to refresh server data
        }}
      />
    </>
  );
}

const HomeStoreProvider = ({
  children,
  authState,
  openLoginModal = false,
  store: initialStore,
}: HomeStoreProviderProps) => {
  // Preload Redux store with authState received from Next.js Server Component
  const [store] = useState<AppStore>(
    () =>
      initialStore ||
      makeStore({
        auth: { ...initialAuthState, ...authState },
        ui: { ...initialUiState, loginModalOpen: openLoginModal },
      })
  );

  return (
    <Provider store={store}>
      <HomeStoreInner>{children}</HomeStoreInner>
    </Provider>
  );
};

export default HomeStoreProvider;
