import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { CourseService } from '../../services/course.service';
import {
  loadCourses,
  loadCoursesSuccess,
  loadCoursesFailure,
  addCourse,
  addCourseSuccess,
  addCourseFailure
} from './course.actions';

// Step 97: Effects are the ONLY place in NgRx where side effects (HTTP calls,
// navigation, localStorage) should happen -- reducers must remain pure.
@Injectable()
export class CourseEffects {
  loadCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCourses),
      switchMap(() =>
        this.courseService.getCourses().pipe(
          map(courses => loadCoursesSuccess({ courses })),
          catchError(error => of(loadCoursesFailure({ error: error.message })))
        )
      )
    )
  );

  addCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCourse),
      switchMap(({ course }) =>
        this.courseService.createCourse(course).pipe(
          map(created => addCourseSuccess({ course: created })),
          catchError(error => of(addCourseFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private courseService: CourseService
  ) {}
}

// Step 98 (trace this manually in Redux DevTools):
// dispatch(loadCourses())
//   -> loadCourses$ effect fires HTTP GET via CourseService
//   -> on success: loadCoursesSuccess({ courses }) dispatched
//   -> courseReducer updates state.courses / state.loading
//   -> selectAllCourses selector emits the new array
//   -> CourseListComponent re-renders via the async pipe
