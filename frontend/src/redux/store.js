import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import productReducer from "../redux/slices/productSlice";
import cartReducer from "../redux/slices/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
  },
});
export default store