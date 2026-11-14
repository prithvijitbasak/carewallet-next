/**
 * ============================================================================
 * AUTH REDUX SLICE (Global State Management for Authentication)
 * ============================================================================
 * 
 * Beginner's Guide to Redux Toolkit:
 * 
 * 1. Store: The single JavaScript object containing our whole app's global state.
 * 2. Slice: A modular chunk of that state (e.g. auth state, UI state) with its own reducers.
 * 3. Reducers: Pure functions that describe how state changes in response to an action.
 * 4. AsyncThunk: A helper for running asynchronous operations (like calling `fetch("/api/users/me")`).
 *    It automatically dispatches three actions during its lifecycle:
 *    - `pending`: Triggered when the API request starts (we set `loading = true`).
 *    - `fulfilled`: Triggered when the API returns data successfully (we save `user`).
 *    - `rejected`: Triggered if the request fails (we save `error`).
 */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

/**
 * Shape of the user information stored in Redux
 */
export interface UserType {
  fullName: string;
  username: string;
  email?: string;
  phone?: string;
  role?: string;
  timezone?: string;
  image?: {
    data: string;
    contentType: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Redux state shape for the auth slice
 */
export interface AuthState {
  user: UserType | null;
  isLogin: boolean;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  isLogin: false,
  loading: true,
  error: null,
};

/**
 * Async thunk to fetch the currently authenticated user's profile from `/api/users/me`.
 */
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/users/me", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        return rejectWithValue("Failed to fetch user");
      }

      const data = await res.json();
      return data as UserType;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error fetching user";
      return rejectWithValue(message);
    }
  }
);

/**
 * Async thunk to log out the user by calling `/api/auth/logout`.
 * Clears the server-side authentication cookie.
 */
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Logout error";
      return rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    // Manually set user object
    setUser: (state, action: PayloadAction<UserType | null>) => {
      state.user = action.payload;
    },
    // Manually toggle login flag
    setIsLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
    // Update specific fields on the user without replacing the whole object
    updateUser: (state, action: PayloadAction<Partial<UserType>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
    // Toggle loading spinner indicator
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // Reset state back to initial logged-out state
    resetAuth: (state) => {
      state.user = null;
      state.isLogin = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Lifecycle cases for fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<UserType>) => {
        state.user = action.payload;
        state.isLogin = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.user = null;
        state.isLogin = false;
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch user";
      })
      // Lifecycle cases for logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLogin = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isLogin = false;
        state.loading = false;
      });
  },
});

export const { setUser, setIsLogin, updateUser, setLoading, resetAuth } =
  authSlice.actions;

export default authSlice.reducer;
