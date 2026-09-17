// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import API from "../../api/axios";

// // ==========================================
// // GET ALL PRODUCTS
// // ==========================================
// export const getProducts = createAsyncThunk(
//   "product/getProducts",
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const query = new URLSearchParams();

//       Object.entries(params).forEach(([key, value]) => {
//         if (value !== undefined && value !== null && value !== "") {
//           query.append(key, value);
//         }
//       });

//       const url = query.toString()
//         ? `/products?${query.toString()}`
//         : "/products";

//       const { data } = await API.get(url);

//       return data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch products",
//       );
//     }
//   },
// );

// // ==========================================
// // GET SINGLE PRODUCT
// // ==========================================
// export const getProductDetails = createAsyncThunk(
//   "product/getProductDetails",
//   async (id, { rejectWithValue }) => {
//     try {
//       const { data } = await API.get(`/products/${id}`);

//       return data.product;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch product",
//       );
//     }
//   },
// );

// // ==========================================
// // INITIAL STATE
// // ==========================================
// const initialState = {
//   products: [],
//   product: null,

//   productCount: 0,
//   totalPages: 0,
//   resultsPerPage: 0,
//   currentPage: 1,

//   loading: false,
//   productLoading: false,

//   error: null,
//   productError: null,
// };

// // ==========================================
// // SLICE
// // ==========================================
// const productSlice = createSlice({
//   name: "product",

//   initialState,

//   reducers: {
//     clearProductError: (state) => {
//       state.error = null;
//     },

//     clearProduct: (state) => {
//       state.product = null;
//       state.productError = null;
//     },
//   },

//   extraReducers: (builder) => {
//     // ======================================
//     // GET ALL PRODUCTS
//     // ======================================

//     builder
//       .addCase(getProducts.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })

//       .addCase(getProducts.fulfilled, (state, action) => {
//         state.loading = false;

//         state.products = action.payload.products || [];

//         state.productCount = action.payload.productCount || 0;
//         state.totalPages = action.payload.totalPages || 0;
//         state.resultsPerPage = action.payload.resultsPerPage || 0;
//         state.currentPage = action.payload.currentPage || 1;
//       })

//       .addCase(getProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.products = [];
//       });

//     // ======================================
//     // GET SINGLE PRODUCT
//     // ======================================

//     builder
//       .addCase(getProductDetails.pending, (state) => {
//         state.productLoading = true;
//         state.productError = null;
//       })

//       .addCase(getProductDetails.fulfilled, (state, action) => {
//         state.productLoading = false;
//         state.product = action.payload;
//       })

//       .addCase(getProductDetails.rejected, (state, action) => {
//         state.productLoading = false;
//         state.productError = action.payload;
//         state.product = null;
//       });
//   },
// });

// export const { clearProductError, clearProduct } = productSlice.actions;

// export default productSlice.reducer;


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
// GET PRODUCT REVIEWS (dedicated endpoint)
// ==========================================
export const getProductReviews = createAsyncThunk(
  "product/getProductReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/products/${productId}/reviews`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product reviews",
      );
    }
  },
);

// ==========================================
// CREATE / UPDATE PRODUCT REVIEW
// ==========================================
export const createProductReview = createAsyncThunk(
  "product/createProductReview",
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/products/${productId}/review`, {
        rating,
        comment,
      });
      return { productId, ...data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit review",
      );
    }
  },
);

// ==========================================
// INITIAL STATE
// ==========================================
const initialState = {
  // Products
  products: [],
  product: null,

  productCount: 0,
  totalPages: 0,
  resultsPerPage: 0,
  currentPage: 1,

  // Product Listing
  loading: false,
  error: null,

  // Single Product
  productLoading: false,
  productError: null,

  // Reviews List
  reviews: [],
  reviewsLoading: false,
  reviewsError: null,

  // Create / Update Review
  reviewLoading: false,
  reviewError: null,
  reviewSuccess: false,
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
      state.productError = null;
      state.reviewError = null;
      state.reviewsError = null;
    },

    clearProduct: (state) => {
      state.product = null;
      state.productError = null;

      state.reviews = [];
      state.reviewsError = null;
      state.reviewsLoading = false;
    },

    resetReviewState: (state) => {
      state.reviewLoading = false;
      state.reviewError = null;
      state.reviewSuccess = false;
    },
  },

  extraReducers: (builder) => {
    // GET ALL PRODUCTS
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
        state.error = action.payload || "Failed to fetch products";
        state.products = [];
      });

    // GET SINGLE PRODUCT
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
        state.productError = action.payload || "Failed to fetch product";
        state.product = null;
      });

    // GET PRODUCT REVIEWS
    builder
      .addCase(getProductReviews.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewsError = null;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.reviews = action.payload.reviews || [];
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewsError =
          action.payload || "Failed to fetch product reviews";
        state.reviews = [];
      });

    // CREATE / UPDATE PRODUCT REVIEW
    builder
      .addCase(createProductReview.pending, (state) => {
        state.reviewLoading = true;
        state.reviewError = null;
        state.reviewSuccess = false;
      })
      .addCase(createProductReview.fulfilled, (state) => {
        state.reviewLoading = false;
        state.reviewSuccess = true;
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.reviewError = action.payload || "Failed to submit review";
        state.reviewSuccess = false;
      });
  },
});

export const { clearProductError, clearProduct, resetReviewState } =
  productSlice.actions;

export default productSlice.reducer;