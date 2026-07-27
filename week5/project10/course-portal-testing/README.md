# Hands-On 10 — Unit Testing: Jasmine, Karma & TestBed

Project: `course-portal-testing` (built on top of `project9/course-portal-ngrx`)

## Setup
```bash
npm install
ng test              # runs all *.spec.ts files once (headless Chrome) and exits
```
`ng test` here is configured for a single headless run (`singleRun: true` in
`karma.conf.js`) so it works in this sandbox without a display. For local
interactive/watch-mode development, change `browsers: ['ChromeHeadlessCI']`
to `browsers: ['Chrome']` and `singleRun: true` to `false` in `karma.conf.js`.

For a coverage report: `ng test --code-coverage` → open `coverage/course-portal-testing/index.html`.

## What was built
- `karma.conf.js`, `src/test-setup.ts`, `tsconfig.spec.json`, and a `test`
  target in `angular.json` — the full Karma/Jasmine harness (this project
  was hand-assembled rather than `ng new`-generated, so these don't exist
  by default the way they would from the CLI)
- `course-card.component.spec.ts` — Tasks 101–105: component creation,
  `@Input` rendering via `fixture.debugElement.query(By.css(...))`,
  `@Output` (`cardClicked`) via `spyOn(...).emit`, store-dispatch testing
  (the NgRx-era equivalent of testing an `@Output` for enrollment — see the
  in-file comment for why), and `ngOnChanges` called directly with a
  `SimpleChanges` object
- `course.service.spec.ts` — Tasks 106–108: `HttpTestingController` +
  `provideHttpClientTesting()`, asserting the exact request URL/method/body,
  `flush()` for both success and error responses, and handling the
  `retry(2)` operator's multiple underlying HTTP attempts correctly
- `course-list.component.spec.ts` — Tasks 109–110: `provideMockStore` with
  an `initialState`, asserting rendered `<app-course-card>` count matches
  state, then `store.setState(...)` to simulate loading/error states and
  re-asserting the DOM
- `course.reducer.spec.ts` — bonus: reducers are plain functions, so they're
  tested with zero Angular machinery at all

## Concept notes (why, not just how)

**Why standalone components go in `imports`, not `declarations`**
`TestBed.configureTestingModule({ declarations: [...] })` is the NgModule
pattern from the exercise book. A `standalone: true` component (everything
in this app) is *self-contained* and gets added to `imports` instead —
`declarations` is reserved for components that belong to an `NgModule`.

**`fixture.detectChanges()` — when and why**
Setting `component.course = mockCourse` only updates the component
instance's property; Angular's change detection hasn't run yet, so the DOM
still shows the old (or no) value. `detectChanges()` triggers a change
detection pass, which is what actually updates the rendered template — only
after that is it safe to query the DOM and expect it to reflect the new input.

**`By.css()` vs `document.querySelector`**
`By.css()` operates on the Angular `DebugElement` tree, scoped to the
component under test and aware of Angular's own DOM abstractions (safe for
`OnPush` components, works with `ng-template`/`ng-container`, etc.).
`document.querySelector` reaches into the *entire* page DOM — fragile in a
test environment where multiple fixtures might exist, and it sidesteps
Angular's testing utilities entirely.

**Why `retry(2)` complicates the error test**
`getCourses()` pipes `retry(2)`, so on failure RxJS doesn't just report the
error — it **re-subscribes to the source Observable** up to 2 more times.
Each subscription to an `HttpClient` Observable fires a brand new HTTP
request. `HttpTestingController.expectOne(...)` must therefore be satisfied
**three times** (1 original + 2 retries) before the error is allowed to
reach `catchError` and propagate to the subscriber — otherwise
`httpMock.verify()` in `afterEach` fails with "unflushed requests". This is
a classic gotcha: operators that change *how many times* a request fires
change how many times your test has to `flush()`.

**`HttpTestingController.verify()`**
Called in `afterEach`, it fails the test if there's ANY HTTP request the
service made that the test never explicitly satisfied with `expectOne(...).flush(...)`.
This catches bugs like a service accidentally firing an extra background
call, or (as above) forgetting that an operator like `retry` multiplies the
number of underlying requests.

**`provideMockStore` vs the real store**
The real `provideStore(...)` runs actual reducers and (with `provideEffects`)
actual effects, meaning a dispatched action really does trigger the whole
pipeline including real HTTP calls. `provideMockStore` replaces all of that
with a stateful stub: `store.select(...)` reads directly from whatever
`initialState` (or a later `store.setState(...)`) you hand it, and
`store.dispatch(...)` is a no-op against reducer logic unless you also spy
on it. This isolates the COMPONENT under test from the correctness of the
store's internals — which get their own separate, focused tests (like
`course.reducer.spec.ts` here).

**Testing a reducer with zero Angular test infrastructure**
`courseReducer(state, action)` is just a function. Call it, inspect the
returned object. No `TestBed`, no fixture, no DOM — which is exactly why
NgRx's strict separation of pure reducers from impure effects pays off in
testing: the pure logic is trivial and fast to test in isolation.

## Cognizant-style interview questions on this topic
1. **Why call `fixture.detectChanges()` after changing a component property
   but before querying the DOM?**
2. **What's the difference between `TestBed.configureTestingModule({ declarations: [...] })`
   and putting a component in `imports` instead?**
3. **Explain what `HttpTestingController.expectOne(...).flush(...)` actually
   does, step by step.**
4. **If a service's Observable pipeline includes `retry(2)`, how many times
   must your test call `httpMock.expectOne(...)` to fully drain a failing
   request? Why?**
5. **What does `HttpTestingController.verify()` protect against, and why
   put it in `afterEach` rather than at the end of one specific test?**
6. **What is `provideMockStore`, and what does it NOT do compared to the
   real store (`provideStore`)?**
   It doesn't run real reducers/effects — `dispatch()` is inert against
   application logic; you control state directly via `initialState`/`setState`.
7. **Why can a reducer be tested without `TestBed` at all, while a component
   almost always needs it?**
   A reducer is a pure function with no Angular dependencies (DI,
   change detection, templates); a component needs Angular's runtime to
   instantiate, inject dependencies, and render a template — TestBed exists
   to provide that runtime in a test environment.
8. **How would you test that clicking a button calls a specific method on
   the component, without caring about what that method internally does?**
   Query the button via `By.css(...)`, `spyOn(component, 'methodName')`
   (or spy on whatever the method calls, like `store.dispatch`), fire
   `.nativeElement.click()`, then assert the spy was called — you're
   testing the WIRING (template → handler), not re-testing the handler's
   own logic (which gets its own unit test).
