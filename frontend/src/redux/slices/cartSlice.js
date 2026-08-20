import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

// ==========================================================
// ADD ITEM TO CART
// ==========================================================
// Product ID + quantity receive karega
// Backend se latest product data fetch karega
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ id, quantity = 1 }, { rejectWithValue }) => {
    try {
      // Latest product data backend se fetch
      const { data } = await API.get(`/products/${id}`);

      const product = data.product;

      if (!product) {
        return rejectWithValue("Product not found");
      }

      // Quantity validation
      const requestedQuantity = Number(quantity);

      if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
        return rejectWithValue("Invalid quantity");
      }

      // Stock validation
      if (product.stock <= 0) {
        return rejectWithValue("Product is out of stock");
      }

      if (requestedQuantity > product.stock) {
        return rejectWithValue(
          `Only ${product.stock} item(s) available in stock`,
        );
      }

      // Cart me store hone wala clean object
      return {
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || "",
        stock: product.stock,
        quantity: requestedQuantity,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to add product to cart",
      );
    }
  },
);

// ==========================================================
// LOCAL STORAGE HELPERS
// ==========================================================

const getCartItemsFromStorage = () => {
  try {
    const storedCart = localStorage.getItem("cartItems");

    if (!storedCart) {
      return [];
    }

    const parsedCart = JSON.parse(storedCart);

    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return [];
  }
};

const getShippingInfoFromStorage = () => {
  try {
    const storedShippingInfo =
      localStorage.getItem("shippingInfo");

    if (!storedShippingInfo) {
      return {};
    }

    const parsedShippingInfo = JSON.parse(storedShippingInfo);

    return parsedShippingInfo &&
      typeof parsedShippingInfo === "object"
      ? parsedShippingInfo
      : {};
  } catch (error) {
    console.error(
      "Failed to load shipping info from localStorage:",
      error,
    );

    return {};
  }
};

// ==========================================================
// INITIAL STATE
// ==========================================================

const initialState = {
  cartItems: getCartItemsFromStorage(),

  shippingInfo: getShippingInfoFromStorage(),

  loading: false,

  error: null,
};

// ==========================================================
// SLICE
// ==========================================================

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    // ======================================================
    // INCREASE QUANTITY
    // ======================================================

    increaseQuantity: (state, action) => {
      const productId = action.payload;

      const item = state.cartItems.find(
        (item) => item.product === productId,
      );

      if (!item) {
        return;
      }

      // Stock se zyada quantity allow nahi karni
      if (item.quantity < item.stock) {
        item.quantity += 1;

        localStorage.setItem(
          "cartItems",
          JSON.stringify(state.cartItems),
        );
      }
    },

    // ======================================================
    // DECREASE QUANTITY
    // ======================================================

    decreaseQuantity: (state, action) => {
      const productId = action.payload;

      const item = state.cartItems.find(
        (item) => item.product === productId,
      );

      if (!item) {
        return;
      }

      // Minimum quantity = 1
      if (item.quantity > 1) {
        item.quantity -= 1;

        localStorage.setItem(
          "cartItems",
          JSON.stringify(state.cartItems),
        );
      }
    },

    // ======================================================
    // SET QUANTITY
    // ======================================================

    setCartItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;

      const item = state.cartItems.find(
        (item) => item.product === productId,
      );

      if (!item) {
        return;
      }

      const newQuantity = Number(quantity);

      if (!Number.isInteger(newQuantity)) {
        return;
      }

      // Quantity 1 se kam nahi
      if (newQuantity < 1) {
        return;
      }

      // Stock se zyada nahi
      if (newQuantity > item.stock) {
        item.quantity = item.stock;
      } else {
        item.quantity = newQuantity;
      }

      localStorage.setItem(
        "cartItems",
        JSON.stringify(state.cartItems),
      );
    },

    // ======================================================
    // REMOVE ITEM
    // ======================================================

    removeCartItem: (state, action) => {
      const productId = action.payload;

      state.cartItems = state.cartItems.filter(
        (item) => item.product !== productId,
      );

      localStorage.setItem(
        "cartItems",
        JSON.stringify(state.cartItems),
      );
    },

    // ======================================================
    // CLEAR ENTIRE CART
    // ======================================================

    clearCart: (state) => {
      state.cartItems = [];

      localStorage.removeItem("cartItems");
    },

    // ======================================================
    // SAVE SHIPPING INFORMATION
    // ======================================================

    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;

      localStorage.setItem(
        "shippingInfo",
        JSON.stringify(action.payload),
      );
    },

    // ======================================================
    // CLEAR SHIPPING INFORMATION
    // ======================================================

    clearShippingInfo: (state) => {
      state.shippingInfo = {};

      localStorage.removeItem("shippingInfo");
    },

    // ======================================================
    // CLEAR ERROR
    // ======================================================

    clearCartError: (state) => {
      state.error = null;
    },
  },

  // ========================================================
  // ASYNC THUNK STATES
  // ========================================================

  extraReducers: (builder) => {
    builder

      // ----------------------------------------------------
      // ADD ITEM - PENDING
      // ----------------------------------------------------

      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // ----------------------------------------------------
      // ADD ITEM - SUCCESS
      // ----------------------------------------------------

      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const newItem = action.payload;

        const existingItem = state.cartItems.find(
          (item) => item.product === newItem.product,
        );

        // Product already exists
        if (existingItem) {
          const updatedQuantity =
            existingItem.quantity + newItem.quantity;

          // Stock limit maintain
          existingItem.quantity = Math.min(
            updatedQuantity,
            newItem.stock,
          );

          // Latest product information update
          existingItem.name = newItem.name;
          existingItem.price = newItem.price;
          existingItem.image = newItem.image;
          existingItem.stock = newItem.stock;
        }

        // New product
        else {
          state.cartItems.push(newItem);
        }

        // LocalStorage sync
        localStorage.setItem(
          "cartItems",
          JSON.stringify(state.cartItems),
        );
      })

      // ----------------------------------------------------
      // ADD ITEM - ERROR
      // ----------------------------------------------------

      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          "Failed to add product to cart";
      });
  },
});

// ==========================================================
// ACTIONS
// ==========================================================

export const {
  increaseQuantity,
  decreaseQuantity,
  setCartItemQuantity,
  removeCartItem,
  clearCart,
  saveShippingInfo,
  clearShippingInfo,
  clearCartError,
} = cartSlice.actions;

// ==========================================================
// SELECTORS
// ==========================================================

export const selectCartItems = (state) =>
  state.cart.cartItems;

export const selectCartItemCount = (state) =>
  state.cart.cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

export const selectCartSubtotal = (state) =>
  state.cart.cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0,
  );

export const selectCartLoading = (state) =>
  state.cart.loading;

export const selectCartError = (state) =>
  state.cart.error;

export const selectShippingInfo = (state) =>
  state.cart.shippingInfo;

// ==========================================================
// REDUCER
// ==========================================================

export default cartSlice.reducer;