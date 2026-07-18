import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "STAFF" | "MANAGER" | "OWNER" | "SUPER_ADMIN";
  isVerified: boolean;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: localStorage.getItem("cineverse_user")
    ? JSON.parse(localStorage.getItem("cineverse_user")!)
    : null,
  token: localStorage.getItem("cineverse_token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem("cineverse_token", action.payload.token);
      localStorage.setItem("cineverse_user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("cineverse_token");
      localStorage.removeItem("cineverse_user");
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setCredentials, logout, setError } = authSlice.actions;
export default authSlice.reducer;
export type { User, AuthState };
