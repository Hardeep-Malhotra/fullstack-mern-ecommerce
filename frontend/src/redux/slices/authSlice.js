import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

// ======================================================
// 1. Login User
// ======================================================

export const loginUser = createAsyncThunk(
  "auth/loginUser",

  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      console.log("LOGIN STATUS:", error.response?.status);
      console.log("LOGIN ERROR:", error.response?.data);

      return rejectWithValue(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    }
  },
);

// ======================================================
// 2. Register User
// ======================================================

export const registerUser = createAsyncThunk(
  "auth/registerUser",

  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/register", userData);

      return response.data;
    } catch (error) {
      console.log("REGISTER STATUS:", error.response?.status);

      console.log("REGISTER ERROR:", error.response?.data);

      return rejectWithValue(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    }
  },
);

// ======================================================
// 3. Forgot Password
// ======================================================

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",

  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/password/forgot", {
        email,
      });

      return response.data;
    } catch (error) {
      console.log("FORGOT PASSWORD STATUS:", error.response?.status);

      console.log("FORGOT PASSWORD ERROR:", error.response?.data);

      return rejectWithValue(
        error.response?.data?.message || "Failed to send reset link.",
      );
    }
  },
);

// ======================================================
// 4. Reset Password
// ======================================================

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",

  async ({ token, passwords }, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `/auth/password/reset/${token}`,
        passwords,
      );

      return response.data;
    } catch (error) {
      console.log("RESET PASSWORD STATUS:", error.response?.status);

      console.log("RESET PASSWORD ERROR:", error.response?.data);

      return rejectWithValue(
        error.response?.data?.message || "Token invalid or expired.",
      );
    }
  },
);

// ======================================================
// 5. Load User
// ======================================================

export const loadUser = createAsyncThunk(
  "auth/loadUser",

  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/auth/me");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Session expired.",
      );
    }
  },
);

// ======================================================
// 6. Logout User
// ======================================================

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",

  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/auth/logout");

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed.");
    }
  },
);

// ======================================================
// Initial State
// ======================================================

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// ======================================================
// Auth Slice
// ======================================================

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==================================================
      // LOAD USER
      // ==================================================

      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })

      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // ==================================================
      // LOGIN
      // ==================================================

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })

      // ======================================================
      // REGISTER USER (Buyer + Seller Approval Handled)
      // ======================================================
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || null;

        // Agar server se user object aa raha hai (Buyer flow), tabhi authenticate karo
        if (action.payload.user) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
        } else {
          // Seller flow: Only show approval message, keep user logged out
          state.isAuthenticated = false;
          state.user = null;
        }
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })

      // ==================================================
      // FORGOT PASSWORD
      // ==================================================

      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================================================
      // RESET PASSWORD
      // ==================================================

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================================================
      // LOGOUT
      // ==================================================

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })

      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;

        // Local state ko logout kar dena
        // even if backend logout request fails
        state.isAuthenticated = false;
        state.user = null;

        state.error = action.payload;
      });
  },
});

export const { clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;
