import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice";
import lessonsReducer from "./slices/lessonsSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    lessons: lessonsReducer,
  },
});

export default store;
