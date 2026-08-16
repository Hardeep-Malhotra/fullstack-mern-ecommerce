import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

// ==========================================
// GET ALL PRODUCTS
// ==========================================
export const getProducts = createAsyncThunk(
  "product/getProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          query.append(key, value);
        }
      });

      const url = query.toString()
        ? `/products?${query.toString()}`
        : "/products";

      const { data } = await API.get(url);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

// ==========================================
// GET SINGLE PRODUCT
// ==========================================
export const getProductDetails = createAsyncThunk(
  "product/getProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/products/${id}`);

      return data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product",
      );
    }
  },
);

// ==========================================
// INITIAL STATE
// ==========================================
const initialState = {
  products: [],
  product: null,

  productCount: 0,
  totalPages: 0,
  resultsPerPage: 0,
  currentPage: 1,

  loading: false,
  productLoading: false,

  error: null,
  productError: null,
};

// ==========================================
// SLICE
// ==========================================
const productSlice = createSlice({
  name: "product",

  initialState,

  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },

    clearProduct: (state) => {
      state.product = null;
      state.productError = null;
    },
  },

  extraReducers: (builder) => {
    // ======================================
    // GET ALL PRODUCTS
    // ======================================

    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;

        state.products = action.payload.products || [];

        state.productCount = action.payload.productCount || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.resultsPerPage = action.payload.resultsPerPage || 0;
        state.currentPage = action.payload.currentPage || 1;
      })

      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.products = [];
      });

    // ======================================
    // GET SINGLE PRODUCT
    // ======================================

    builder
      .addCase(getProductDetails.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })

      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.productLoading = false;
        state.product = action.payload;
      })

      .addCase(getProductDetails.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = action.payload;
        state.product = null;
      });
  },
});

export const { clearProductError, clearProduct } = productSlice.actions;

export default productSlice.reducer;
