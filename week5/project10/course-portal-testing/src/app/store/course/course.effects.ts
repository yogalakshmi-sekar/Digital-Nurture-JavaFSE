import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CourseService } from '../../services/course.service';
import * as CourseActions from './course.actions';

// Task 97: Effects are the ONLY place in NgRx where side effects (HTTP
// calls, navigation, localStorage writes) should happen. Reducers stay
// pure; effects listen for an action, do the impure work, and dispatch a
// new (success/failure) action with the result — which THEN flows into the
// pure reducer.
@Injectable()
export class CourseEffects {
  // Flow: loadCourses dispatched -> this effect catches it via ofType ->
  // switchMap fires the HTTP call -> map wraps the result in
  // loadCoursesSuccess (or catchError wraps the failure in
  // loadCoursesFailure) -> that new action is dispatched automatically
  // (createEffect defaults to dispatching whatever the pipe emits) ->
  // the reducer picks it up -> selectors re-emit -> component re-renders.
  loadCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.loadCourses),
      switchMap(() =>
        this.courseService.getCourses().pipe(
          map((courses) => CourseActions.loadCoursesSuccess({ courses })),
          catchError((error) => of(CourseActions.loadCoursesFailure({ error: error.message })))
        )
      )
    )
  );

  addCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.addCourse),
      switchMap(({ course }) =>
        this.courseService.createCourse(course).pipe(
          map((created) => CourseActions.addCourseSuccess({ course: created })),
          catchError((error) => of(CourseActions.addCourseFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private courseService: CourseService
  ) {}
}
