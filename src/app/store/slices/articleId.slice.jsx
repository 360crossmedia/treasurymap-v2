import { createSlice } from "@reduxjs/toolkit";

export const articleSlice = createSlice({
  name: "articleId",
  initialState: false,
  reducers: {
    setArticleId: (state, action) => {
      return action.payload;
    },
  },
});

export const { setArticleId } = articleSlice.actions;

export default articleSlice.reducer;
