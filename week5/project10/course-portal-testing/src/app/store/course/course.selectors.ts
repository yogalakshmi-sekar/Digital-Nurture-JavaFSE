import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CourseState } from './course.reducer';

// Task 95: createFeatureSelector reads the 'course' slice registered via
// provideState({ name: 'course', reducer: courseReducer }) in app.config.ts.
export const selectCourseState = createFeatureSelector<CourseState>('course');

// Task 95: derived selectors. These are MEMOISED — NgRx caches the last
// result and only re-runs the projector function (the last argument) when
// selectCourseState's reference actually changes. If the same state object
// is passed in again (nothing changed), the cached value is returned
// instantly without recomputation — this is NgRx's main performance win
// over recalculating derived data on every change detection cycle.
export const selectAllCourses = createSelector(
  selectCourseState,
  (state) => state.courses
);

export const selectCoursesLoading = createSelector(
  selectCourseState,
  (state) => state.loading
);

export const selectCoursesError = createSelector(
  selectCourseState,
  (state) => state.error
);
