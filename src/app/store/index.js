import { configureStore } from "@reduxjs/toolkit";
import isOverviewSlice from "./slices/isOverview.slice";
import userSlice from "./slices/user.slice";
import isLoadingSlice from "./slices/isLoading.slice";
import companyToUpdateSlice from "./slices/companyToUpdate.slice";
import showSlice from "./slices/show.slice";
import articleIdSlice from "./slices/articleId.slice";
import videoIdSlice from "./slices/videoId.slice";

export default configureStore({
  reducer: {
    isOverview: isOverviewSlice,
    user: userSlice,
    isLoading: isLoadingSlice,
    companyId: companyToUpdateSlice,
    show: showSlice,
    articleId: articleIdSlice,
    videoId: videoIdSlice,
  },
});
