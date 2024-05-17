import { createSlice } from "@reduxjs/toolkit";
import { loaderInitState } from "../initState/loaderInitState";
import { loaderReducer } from "../reducers/loaderReducer";
import { userInitState } from "../initState/userInitState";
import { userReducer } from "../reducers/userReducer";

export const userSlice = createSlice({
  name: "userSlice",
  initialState: userInitState,
  reducers: userReducer,
});
