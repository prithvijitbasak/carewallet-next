import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

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
    } catch (err: any) {
      return rejectWithValue(err.message || "Error fetching user");
    }
  }
);

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
    } catch (error: any) {
      return rejectWithValue(error.message || "Logout error");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType | null>) => {
      state.user = action.payload;
    },
    setIsLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<UserType>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    resetAuth: (state) => {
      state.user = null;
      state.isLogin = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUser
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
      // logoutUser
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
