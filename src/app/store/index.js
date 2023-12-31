import { configureStore } from "@reduxjs/toolkit";
import isOverviewSlice from "./slices/isOverview.slice";
import userSlice from "./slices/user.slice";

export default configureStore({
  reducer: {
    isOverview: isOverviewSlice,
    user: userSlice,
  },
});
