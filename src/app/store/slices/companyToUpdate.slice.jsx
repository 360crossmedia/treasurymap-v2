import { createSlice } from "@reduxjs/toolkit";

export const companyToUpdateSlice = createSlice({
  name: "companyId",
  initialState: false,
  reducers: {
    setCompanyId: (state, action) => {
      return action.payload;
    },
  },
});

export const { setCompanyId } = companyToUpdateSlice.actions;

export default companyToUpdateSlice.reducer;
