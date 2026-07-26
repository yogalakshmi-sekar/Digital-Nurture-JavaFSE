# Digital Nurture 5.0 — Week 5 — Hands-On 9 (Advanced)
## State Management — NgRx Store, Actions, Reducers, Effects & Selectors — Angular v20

> Note: the exercise book only lists **2 tasks** for Hands-On 9 (unlike Hands-On 8's 3 tasks) —
> "Task 1: Set Up NgRx Store" and "Task 2: NgRx Effects for HTTP and Enrollment State".
> Both are fully implemented below.

This project carries forward the HttpClient services, interceptors, and components from
Hands-On 8 and migrates course/enrollment state management to NgRx.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Install json-server globally if you don't have it:
   ```
   npm install -g json-server
   ```
3. Install the Redux DevTools browser extension (Chrome/Edge).
4. Start the mock backend (terminal 1):
   ```
   npm run backend
   ```
5. Start the app (terminal 2):
   ```
   npm start
   ```
6. Open `http://localhost:4200`, then open Redux DevTools to watch the action stream.

## Task 1 — Set Up NgRx Store and Define Course State (steps 92–96)
- `src/app/app.config.ts` — `provideStore({ course: courseReducer, enrollment: enrollmentReducer })` and `provideStoreDevtools({ maxAge: 25 })` (standalone equivalents of `StoreModule.forRoot({})` / `StoreDevtoolsModule.instrument(...)`).
- `src/app/store/course/course.actions.ts` — `loadCourses`, `loadCoursesSuccess`, `loadCoursesFailure` (plus `addCourse*` and `selectCourse` used later), all prefixed `[Course]` so Redux DevTools can be filtered by feature.
- `src/app/store/course/course.reducer.ts` — pure reducer, state shape `{ courses, selectedCourseId, loading, error }`, handles all the above actions via `on()`.
- `src/app/store/course/course.selectors.ts` — `selectCourseState` (via `createFeatureSelector`), `selectAllCourses`, `selectCoursesLoading`, `selectCoursesError` — all memoised via `createSelector`.
- `src/app/components/course-list/course-list.component.ts` — `courses$ = store.select(selectAllCourses)`, dispatches `loadCourses()` in `ngOnInit`, renders via the async pipe.

## Task 2 — NgRx Effects for HTTP and Enrollment State (steps 97–100)
- `src/app/store/course/course.effects.ts` — `loadCourses$` effect: listens for `loadCourses`, calls `CourseService.getCourses()`, dispatches `loadCoursesSuccess`/`loadCoursesFailure`. Also includes an `addCourse$` effect for the POST flow. Registered via `provideEffects([CourseEffects])` in `app.config.ts`.
- `src/app/store/enrollment/` — `enrollment.actions.ts` (`enrollInCourse`, `unenrollFromCourse`, `setEnrolledCourses`), `enrollment.reducer.ts` (`enrolledCourseIds: number[]`), `enrollment.selectors.ts` (`selectEnrolledIds`, and the cross-slice `selectEnrolledCourses` combining the course and enrollment slices via `createSelector`).
- `src/app/components/course-card/course-card.component.ts` — toggles Enroll/Unenroll button label based on `[isEnrolled]` passed down from `selectEnrolledIds`.

## How to verify each Expected Outcome
- **Task 1**: Redux DevTools shows `[Course] Load Courses` dispatched on page load, followed by `[Course] Load Courses Success`. The state tree panel shows `course: { courses, loading, error }`. Courses render on screen via the async pipe.
- **Task 2**: In Redux DevTools, trace `loadCourses → (effect) → loadCoursesSuccess → reducer update → selector emits → component re-renders`. Click Enroll/Unenroll on a card — `[Enrollment] Enroll In Course` / `Unenroll From Course` dispatch and the button label flips immediately.

## Notes
- Built with Angular v20 standalone APIs — no `NgModule`s.
- `node_modules/` is not included — run `npm install` first.
- HttpClient services/interceptors from Hands-On 8 are included here because the NgRx effects call them directly (`course.effects.ts` depends on `CourseService`).
