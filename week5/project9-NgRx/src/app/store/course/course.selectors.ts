import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CourseState } from './course.reducer';

// Step 95: createFeatureSelector picks the 'course' slice out of the root
// state; createSelector composes derived, MEMOISED values from it -- they
// only recompute when their inputs actually change, which is NgRx's key
// performance optimisation (component re-renders are skipped otherwise).
export const selectCourseState = createFeatureSelector<CourseState>('course');

export const selectAllCourses = createSelector(
  selectCourseState,
  state => state.courses
);

export const selectCoursesLoading = createSelector(
  selectCourseState,
  state => state.loading
);

export const selectCoursesError = createSelector(
  selectCourseState,
  state => state.error
);

export const selectSelectedCourseId = createSelector(
  selectCourseState,
  state => state.selectedCourseId
);
