import { createAction, props } from '@ngrx/store';
import { Course } from '../../models/course.model';

// Task 93: the '[Course]' prefix is a NAMING CONVENTION (a "source tag") —
// it groups every action related to the course feature so the Redux
// DevTools timeline can be filtered by '[Course]' to see only these
// actions, separate from '[Enrollment]' or any other feature's actions.
export const loadCourses = createAction('[Course] Load Courses');

export const loadCoursesSuccess = createAction(
  '[Course] Load Courses Success',
  props<{ courses: Course[] }>()
);

export const loadCoursesFailure = createAction(
  '[Course] Load Courses Failure',
  props<{ error: string }>()
);

// Extra actions to support Hands-On 8's POST flow through the store too,
// so CourseListComponent can dispatch instead of calling CourseService directly.
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
