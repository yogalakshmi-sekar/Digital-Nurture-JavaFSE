# Digital Nurture 5.0 — Week 5 — Hands-On 8 (Advanced)
## HTTP Client — API Integration, Observables & Interceptors — Angular v20

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Install json-server globally if you don't have it:
   ```
   npm install -g json-server
   ```
3. Start the mock backend (terminal 1):
   ```
   npm run backend
   ```
   Serves `db.json` on `http://localhost:3000` (`/courses`, `/students`, `/enrollments`).
4. Start the app (terminal 2):
   ```
   npm start
   ```
5. Open `http://localhost:4200`.

## Task 1 — Replace Service Data with HttpClient Calls (steps 78–82)
- `src/app/app.config.ts` — `provideHttpClient()` (standalone equivalent of importing `HttpClientModule`).
- `src/app/services/course.service.ts` — `getCourses`, `getCourseById`, `createCourse`, `updateCourse`, `deleteCourse` all backed by real HTTP calls to json-server.
- `src/app/components/course-list/course-list.component.ts` — `ngOnInit` subscribes with the full `{ next, error, complete }` observer object.
- `src/app/components/course-form/course-form.component.ts` — form wired to `onCreate()`, which calls `createCourse`.

## Task 2 — RxJS Operators and Error Handling (steps 83–87)
- `course.service.ts`:
  - `map` filters/transforms the response.
  - `tap` logs how many courses loaded (side effect only, no data mutation).
  - `retry(2)` retries a failed GET twice before giving up.
  - `catchError` converts the raw HTTP error into a friendly message shown in the UI.
- `course-list.component.ts` — `students$` uses `switchMap` to load enrolled students for whichever course was last selected, cancelling any in-flight request for a previously selected course.

## Task 3 — HTTP Interceptors (steps 88–91)
- `src/app/interceptors/auth.interceptor.ts` — adds `Authorization: Bearer mock-token-12345` to every outgoing request.
- `src/app/interceptors/error-handler.interceptor.ts` — global handling for `401` (redirect) and `500` (alert/notification) responses.
- `src/app/interceptors/loading.interceptor.ts` + `src/app/services/loading.service.ts` + `src/app/components/loading-spinner/` — shows/hides a global spinner using `finalize`, guaranteed to run whether the request succeeds or fails.
- All three registered together in `app.config.ts` via `provideHttpClient(withInterceptors([...]))`.

## How to verify each Expected Outcome

- **Task 1**: Course list loads from json-server on page load. Adding a course via the form persists it (check `db.json` — it updates live since json-server watches the file). Delete removes it from the UI and the file.
- **Task 2**: Stop `json-server` and reload — after ~2 retries, the error banner appears. Click "View Students" on different courses quickly — only the last-clicked course's students load.
- **Task 3**: Open Chrome DevTools → Network → click any request → Request Headers shows the `Authorization` header. A spinner appears briefly on every request. Simulate a 401/500 to see `error-handler.interceptor.ts` fire (see comments in that file for how to trigger this manually against json-server, e.g. by pointing a request at a non-existent route).

## Notes
- Built with Angular v20 standalone APIs — no `NgModule`s.
- `node_modules/` is not included — run `npm install` first.
- This project does **not** include NgRx — that's Hands-On 9 (separate folder/zip).
