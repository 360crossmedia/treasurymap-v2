import { createSlice } from "@reduxjs/toolkit";

export const sellerSlice = createSlice({
  name: "sellerSlice",
  initialState: [],
  reducers: {
    setSeller: (state, action) => {
      return action.payload;
    },
  },
});

export const { setSeller } = sellerSlice.actions;

export default sellerSlice.reducer;
