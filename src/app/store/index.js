import { configureStore } from "@reduxjs/toolkit";
import isOverviewSlice from "./slices/isOverview.slice";

export default configureStore({
  reducer: {
    isOverview: isOverviewSlice,
  },
});
