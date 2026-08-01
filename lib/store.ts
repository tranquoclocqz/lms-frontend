import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "@/lib/features/courses/coursesSlice";
import { api } from "@/lib/redux/api";

export const makeStore = () =>
  configureStore({
    reducer: {
      courses: coursesReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
