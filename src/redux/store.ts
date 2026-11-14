/**
 * ============================================================================
 * REDUX STORE CONFIGURATION
 * ============================================================================
 * 
 * Beginner's Guide:
 * 
 * In Next.js with React Server Components (RSC):
 * Instead of creating a single shared global store that could accidentally leak
 * state across different user requests on the server, we create a factory function:
 * `makeStore(preloadedState?)`
 * 
 * This enables:
 * 1. Fresh store per SSR request or client mount.
 * 2. Ability to hydrate pre-fetched server state (`preloadedState`) directly into Redux!
 */

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";

// Combine individual slice reducers into a single root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
});

// Infer the `RootState` type from the root reducer itself
export type RootState = ReturnType<typeof rootReducer>;

/**
 * Store factory function: Creates a new Redux store instance.
 * Accepts optional preloaded state (useful for hydrating server-rendered user session).
 */
export const makeStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

// Default client store instance
export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
