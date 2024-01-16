import { createSlice } from "@reduxjs/toolkit";

export const userIdToUpdateSlice = createSlice({
  name: "userIdToUpdate",
  initialState: false,
  reducers: {
    setUserIdToUpdate: (state, action) => {
      return action.payload;
    },
  },
});

export const { setUserIdToUpdate } = userIdToUpdateSlice.actions;

export default userIdToUpdateSlice.reducer;
