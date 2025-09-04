import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Reducer/slices/authSlice"

const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

export default store;
