"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "./store";
import { initialAuthState, type AuthState } from "./slices/authSlice";
import { initialUiState, setAuthModalOpen } from "./slices/uiSlice";
import AuthModal from "@/components/AuthModal";
import { useAppDispatch, useAppSelector } from "./hooks";

type HomeStoreProviderProps = {
  children: ReactNode;
  authState?: Partial<AuthState>;
  openAuthModal?: boolean;
  store?: AppStore;
};

function HomeStoreInner({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const isAuthOpen = useAppSelector((state) => state.ui.authModalOpen);

  return (
    <>
      {children}
      <AuthModal
        open={isAuthOpen}
        onClose={() => dispatch(setAuthModalOpen(false))}
      />
    </>
  );
}

export default function HomeStoreProvider({
  children,
  authState,
  openAuthModal = false,
  store: initialStore,
}: HomeStoreProviderProps) {
  const [store] = useState<AppStore>(
    () =>
      initialStore ||
      makeStore({
        auth: { ...initialAuthState, ...authState },
        ui: {
          ...initialUiState,
          authModalOpen: openAuthModal,
        },
      })
  );

  return (
    <Provider store={store}>
      <HomeStoreInner>{children}</HomeStoreInner>
    </Provider>
  );
}
