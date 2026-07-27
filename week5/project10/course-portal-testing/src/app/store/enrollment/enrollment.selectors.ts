import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EnrollmentState } from './enrollment.reducer';
import { selectAllCourses } from '../course/course.selectors';

export const selectEnrollmentState = createFeatureSelector<EnrollmentState>('enrollment');

export const selectEnrolledIds = createSelector(
  selectEnrollmentState,
  (state) => state.enrolledCourseIds
);

// Task 99: a CROSS-SLICE selector — it takes input selectors from TWO
// different feature states (course + enrollment) and derives joined data
// without either slice needing to duplicate the other's data. This is one
// of NgRx's most powerful patterns: state stays normalized (courses live
// only in the course slice, enrolled IDs only in the enrollment slice), and
// selectors do the joining on read, memoised so it only recomputes when
// either input actually changes.
export const selectEnrolledCourses = createSelector(
  selectAllCourses,
  selectEnrolledIds,
  (courses, enrolledIds) => courses.filter((c) => enrolledIds.includes(c.id))
);
