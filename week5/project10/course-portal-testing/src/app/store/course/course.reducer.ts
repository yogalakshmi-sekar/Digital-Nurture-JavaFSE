import { createReducer, on } from '@ngrx/store';
import { Course } from '../../models/course.model';
import * as CourseActions from './course.actions';

// Task 94: the shape of this feature's slice of the store.
export interface CourseState {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

export const initialCourseState: CourseState = {
  courses: [],
  loading: false,
  error: null
};

// createReducer + on() handlers. Every handler returns a BRAND NEW state
// object via the spread operator (...state) — reducers must be PURE and
// treat state as IMMUTABLE. Never do `state.courses.push(...)`; NgRx's
// change detection and the Redux DevTools time-travel feature both depend
// on state references only changing when something actually changed.
export const courseReducer = createReducer(
  initialCourseState,

  on(CourseActions.loadCourses, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(CourseActions.loadCoursesSuccess, (state, { courses }) => ({
    ...state,
    courses,
    loading: false
  })),

  on(CourseActions.loadCoursesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(CourseActions.addCourseSuccess, (state, { course }) => ({
    ...state,
    courses: [...state.courses, course]
  })),

  on(CourseActions.addCourseFailure, (state, { error }) => ({
    ...state,
    error
  }))
);
