// Client component wrapper providing the Redux store to the component tree

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
