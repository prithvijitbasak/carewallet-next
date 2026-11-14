/**
 * ============================================================================
 * `useAuth` CUSTOM HOOK (Authentication Facade)
 * ============================================================================
 * 
 * Beginner's Guide:
 * 
 * What is a Custom Hook?
 * A custom hook is a JavaScript function that uses built-in React hooks (`useState`,
 * `useEffect`, `useCallback`) or third-party hooks (`useAppDispatch`, `useAppSelector`).
 * 
 * Why create `useAuth`?
 * Instead of writing `const dispatch = useAppDispatch(); dispatch(logoutUser());`
 * inside every button or page, components can simply do:
 * ```tsx
 * const { user, isLogin, logout } = useAuth();
 * ```
 * This pattern is known as the "Facade Pattern" — it hides complex Redux boilerplate
 * behind clean, intuitive function calls.
 */

"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchUser,
  logoutUser,
  setUser,
  setIsLogin,
  updateUser,
  UserType,
} from "@/redux/slices/authSlice";

export type { UserType };

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Read current user state from the Redux store
  const { user, isLogin, loading } = useAppSelector((state) => state.auth);

  /**
   * Refetches the user session from `/api/users/me`
   */
  const handleFetchUser = useCallback(async () => {
    return await dispatch(fetchUser()).unwrap().catch(() => null);
  }, [dispatch]);

  /**
   * Logs out the user: calls API to clear cookies, updates Redux, and redirects to home page ("/")
   */
  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.push("/");
    }
  }, [dispatch, router]);

  /**
   * Helper to set user, supporting both value and callback update functions
   */
  const handleSetUser = useCallback(
    (
      update:
        | UserType
        | null
        | ((prev: UserType | null) => UserType | null)
    ) => {
      if (typeof update === "function") {
        const updated = update(user);
        dispatch(setUser(updated));
      } else {
        dispatch(setUser(update));
      }
    },
    [dispatch, user]
  );

  /**
   * Helper to toggle isLogin flag
   */
  const handleSetIsLogin = useCallback(
    (val: boolean | ((prev: boolean) => boolean)) => {
      if (typeof val === "function") {
        dispatch(setIsLogin(val(isLogin)));
      } else {
        dispatch(setIsLogin(val));
      }
    },
    [dispatch, isLogin]
  );

  return {
    user,
    isLogin,
    loading,
    setUser: handleSetUser,
    updateUser: (patch: Partial<UserType>) => dispatch(updateUser(patch)),
    setIsLogin: handleSetIsLogin,
    fetchUser: handleFetchUser,
    logout: handleLogout,
  };
};

export default useAuth;
