import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";


// ===============================
// GET WISHLIST
// ===============================

export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/wishlist");

      return data.wishlist;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);


// ===============================
// ADD TO WISHLIST
// ===============================

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `/wishlist/${productId}`
      );

      return {
        productId,
        message: data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add product"
      );
    }
  }
);


// ===============================
// REMOVE FROM WISHLIST
// ===============================

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `/wishlist/${productId}`
      );

      return {
        productId,
        message: data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove product"
      );
    }
  }
);


// ===============================
// INITIAL STATE
// ===============================

const initialState = {
  items: [],
  loading: false,
  error: null,
};


// ===============================
// SLICE
// ===============================

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // GET
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // ADD
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push({
          _id: action.payload.productId,
        });
      })


      // REMOVE
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload.productId
        );
      });
  },
});

export default wishlistSlice.reducer;