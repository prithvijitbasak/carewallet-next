// Redux store configuration and factory function for SSR hydration

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

// Store factory function creating a Redux store with optional preloaded state
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
