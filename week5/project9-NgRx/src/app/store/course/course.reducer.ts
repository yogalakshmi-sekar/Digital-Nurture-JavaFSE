import { createReducer, on } from '@ngrx/store';
import { Course } from '../../models/course.model';
import {
  loadCourses,
  loadCoursesSuccess,
  loadCoursesFailure,
  addCourseSuccess,
  addCourseFailure,
  selectCourse
} from './course.actions';

// Step 94: state shape for the course feature slice.
export interface CourseState {
  courses: Course[];
  selectedCourseId: number | null;
  loading: boolean;
  error: string | null;
}

export const initialCourseState: CourseState = {
  courses: [],
  selectedCourseId: null,
  loading: false,
  error: null
};

// Step 94: reducers must stay pure -- no HTTP calls, no mutation, only
// returning new state objects. Side effects belong in course.effects.ts.
export const courseReducer = createReducer(
  initialCourseState,
  on(loadCourses, state => ({ ...state, loading: true, error: null })),
  on(loadCoursesSuccess, (state, { courses }) => ({
    ...state,
    courses,
    loading: false,
    error: null
  })),
  on(loadCoursesFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(addCourseSuccess, (state, { course }) => ({
    ...state,
    courses: [...state.courses, course]
  })),
  on(addCourseFailure, (state, { error }) => ({ ...state, error })),
  on(selectCourse, (state, { courseId }) => ({ ...state, selectedCourseId: courseId }))
);
