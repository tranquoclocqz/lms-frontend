import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StudentCourse } from "@/typing";

type CoursesState = {
  items: StudentCourse[];
  status: "idle" | "loaded";
  error: string | null;
};

const initialState: CoursesState = {
  items: [],
  status: "idle",
  error: null,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    initializeCourses: (state, action: PayloadAction<StudentCourse[]>) => {
      state.items = action.payload;
      state.status = "loaded";
      state.error = null;
    },
    setCourses: (state, action: PayloadAction<StudentCourse[]>) => {
      state.items = action.payload;
      state.status = "loaded";
      state.error = null;
    },
    setCoursesError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { initializeCourses, setCourses, setCoursesError } = coursesSlice.actions;

export default coursesSlice.reducer;
