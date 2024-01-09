import { createSlice } from "@reduxjs/toolkit";

export const videoSlice = createSlice({
  name: "videoId",
  initialState: false,
  reducers: {
    setVideoId: (state, action) => {
      return action.payload;
    },
  },
});

export const { setVideoId } = videoSlice.actions;

export default videoSlice.reducer;
