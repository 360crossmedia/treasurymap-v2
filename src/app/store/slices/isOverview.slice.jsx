import { createSlice } from "@reduxjs/toolkit";

export const isOverviewSlice = createSlice({
  name: "isOverview",
  initialState: true,
  reducers: {
    setIsOverview: (state, action) => {
      return action.payload;
    },
  },
});

export const { setIsOverview } = isOverviewSlice.actions;

export default isOverviewSlice.reducer;
