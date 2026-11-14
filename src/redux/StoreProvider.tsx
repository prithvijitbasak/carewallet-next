/**
 * ============================================================================
 * STORE PROVIDER (Client Component Redux Wrapper)
 * ============================================================================
 * 
 * Beginner's Guide:
 * In Next.js App Router, the Root Layout is a Server Component.
 * Server Components cannot use React Context directly (Redux uses React Context under the hood).
 * 
 * Therefore, we create this "use client" wrapper component.
 * We pass the store into `Provider`, making Redux available to all client components inside.
 * `useState(() => makeStore())` ensures the store is created exactly once per client session.
 */

"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./store";

export default function StoreProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Lazy initialization ensures makeStore is executed only on initial mount
  const [store] = useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
