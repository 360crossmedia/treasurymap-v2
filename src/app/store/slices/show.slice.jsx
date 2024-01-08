import { createSlice } from "@reduxjs/toolkit";

export const show = createSlice({
  name: "show",
  initialState: false,
  reducers: {
    setShow: (state, action) => {
      return action.payload;
    },
  },
});

export const { setShow } = show.actions;

export default show.reducer;
