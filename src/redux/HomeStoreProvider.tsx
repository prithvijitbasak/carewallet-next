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

function HomeStoreInner({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const open = useAppSelector((state) => state.ui.loginModalOpen);

  return (
    <>
      {children}
      <LoginModal
        open={open}
        onClose={() => dispatch(setLoginModalOpen(false))}
        onSuccess={() => {
          dispatch(setLoginModalOpen(false));
          router.refresh(); // re-runs the SSR call with the new login token
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
