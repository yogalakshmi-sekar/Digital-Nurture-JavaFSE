import { createAction, props } from '@ngrx/store';
import { Course } from '../../models/course.model';

// Step 93: the '[Course]' prefix groups actions by feature in the Redux
// DevTools timeline -- filter by '[Course]' to see only course-related actions.
export const loadCourses = createAction('[Course] Load Courses');

export const loadCoursesSuccess = createAction(
  '[Course] Load Courses Success',
  props<{ courses: Course[] }>()
);

export const loadCoursesFailure = createAction(
  '[Course] Load Courses Failure',
  props<{ error: string }>()
);

export const addCourse = createAction(
  '[Course] Add Course',
  props<{ course: Omit<Course, 'id'> }>()
);

export const addCourseSuccess = createAction(
  '[Course] Add Course Success',
  props<{ course: Course }>()
);

export const addCourseFailure = createAction(
  '[Course] Add Course Failure',
  props<{ error: string }>()
);

export const selectCourse = createAction(
  '[Course] Select Course',
  props<{ courseId: number }>()
);
