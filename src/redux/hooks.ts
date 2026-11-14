/**
 * ============================================================================
 * TYPED REDUX HOOKS (`useAppDispatch` and `useAppSelector`)
 * ============================================================================
 * 
 * Why do we create custom hooks instead of using plain `useDispatch` and `useSelector`?
 * 1. Plain `useSelector((state) => state.auth)` requires you to type `(state: RootState)` every time.
 * 2. `useAppSelector` is already pre-typed with `RootState`, providing instant auto-complete and type safety.
 * 3. `useAppDispatch` knows about Thunk action types dispatched by `createAsyncThunk`.
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
