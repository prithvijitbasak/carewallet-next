// Custom hook providing an authentication facade over Redux actions and state

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

  // Refetches the user session from /api/users/me
  const handleFetchUser = useCallback(async () => {
    return await dispatch(fetchUser()).unwrap().catch(() => null);
  }, [dispatch]);

  // Logs out the user, clears session cookies, and redirects to home
  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.push("/");
    }
  }, [dispatch, router]);

  // Helper to update user state with direct value or callback
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

  // Helper to toggle login state
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
