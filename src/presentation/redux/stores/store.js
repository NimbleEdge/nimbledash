import { configureStore } from "@reduxjs/toolkit";
import { loaderSlice } from "../slices/loaderSlice";
import { userReducer } from "../reducers/userReducer";
import { userSlice } from "../slices/userSlice";

const store = configureStore({
  reducer: {
    loaderReducer: loaderSlice.reducer,
    userReducer: userSlice.reducer,
  },
});

export default store;
export const loaderActions = loaderSlice.actions;
export const userActions = userSlice.actions;
