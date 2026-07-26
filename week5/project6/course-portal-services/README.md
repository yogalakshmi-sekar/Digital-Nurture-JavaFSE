# Hands-On 6 — Services & Dependency Injection

Project: `course-portal-services` | Routes: `/`, `/courses`, `/profile`

## Setup
```bash
npm install
ng serve
# open http://localhost:4200
```

## What was built
- `Course` interface — `src/app/models/course.model.ts`
- `CourseService` (`providedIn: 'root'`) — singleton, holds the course array,
  exposes `getCourses()`, `getCourseById()`, `addCourse()`
- `EnrollmentService` (`providedIn: 'root'`) — injects `CourseService`
  internally (service-to-service DI), tracks enrolled IDs, exposes
  `enroll()`, `unenroll()`, `isEnrolled()`, `getEnrolledCourses()`
- `NotificationService` — **not** `providedIn: 'root'`; instead provided at
  component level inside `NotificationComponent` to demonstrate scoped DI
- `HomeComponent` — reads `getCourses().length` for a live stats card, and
  renders `CourseSummaryWidgetComponent`
- `CourseListComponent` — reads `getCourses()`, renders `CourseCardComponent`
  for each, has an "Add Course" button that proves the singleton by updating
  the count visible on the Home page too
- `CourseCardComponent` — injects `EnrollmentService` directly, toggles
  Enroll/Unenroll
- `StudentProfileComponent` — injects `EnrollmentService`, lists
  `getEnrolledCourses()`
- `CourseSummaryWidgetComponent` — a second, independent consumer of
  `CourseService`, proving all three components (`Home`, `CourseList`,
  `CourseSummaryWidget`) share the exact same instance

## Concept notes (why, not just how)

**Why services exist at all**
Components should stay focused on presentation. Shared data, business logic,
and anything that needs to persist across navigation (which destroys and
recreates components) belongs in a service instead.

**`providedIn: 'root'` — what it actually does**
It tells Angular's DI system to register the service with the **root
injector** and to create it **lazily, once** — the first time something
asks for it. Every subsequent injection anywhere in the app receives that
same object reference. This is what makes a service usable as a shared
state store: `CourseListComponent` mutates the array via `addCourse()`, and
`HomeComponent` reading `getCourses().length` sees the change immediately —
they're not two separate copies of data, they're the same object.

**Constructor injection**
`constructor(private courseService: CourseService) {}` — Angular's DI reads
the constructor parameter types (via TypeScript's emitted metadata) and
supplies an instance automatically. You never call `new CourseService()`
yourself; that's the whole point of *inversion of control*.

**Service-to-service injection (`EnrollmentService` → `CourseService`)**
Services can inject other services in their own constructor exactly like
components do. This lets you build a layered architecture: `EnrollmentService`
doesn't know how courses are stored — it delegates that to `CourseService`
and only owns "which IDs the student picked."

**Hierarchical DI — root vs component-level providers**
Angular's injectors form a tree that mirrors the component tree. When a
component asks for a service, Angular first checks that component's own
`providers` array; if not found there, it walks up to the parent, and
eventually the root injector. Listing a service in `providers: [...]` on a
`@Component` creates a **new instance scoped to that component and its
children** — separate from the root singleton (or from any other
component's own scoped instance). `NotificationComponent` demonstrates this:
if you rendered two `<app-notification>` instances side by side, each would
have its own independent list of messages.

**When to use component-level providers**
Anytime you want isolated, per-instance state rather than app-wide shared
state — e.g. a multi-step wizard where each open instance of the wizard
needs its own draft data, or a widget that could legitimately be rendered
multiple times on the same page with independent state.

## Cognizant-style interview questions on this topic
1. **What problem do Angular services solve that components alone can't?**
2. **Explain `providedIn: 'root'`. What happens if you provide the same
   service in `providers: [...]` at both the root `AppComponent` AND a
   child component?**
   The child gets its *own* separate instance (component-level provider
   wins for that component's injector); the rest of the app still shares
   the root instance.
3. **How does Angular know what to inject into a constructor?**
   Via TypeScript type metadata (`reflect-metadata`/Ivy) read at compile
   time — the parameter's type is the DI token by default.
4. **Can a service inject another service? How?**
   Yes — constructor injection works identically in services as in components.
5. **What's the practical difference between a singleton service and a
   component-scoped service? Give a real example of when you'd want each.**
6. **If two sibling components both inject the same root-provided service
   and one calls a method that mutates internal state, does the other see
   the change immediately? Why?**
   Yes — they share the same object reference; there's no copying involved.
7. **Why prefer an interface (`Course`) over `any` for shared data models?**
   Compile-time checking across every file that touches that shape, plus
   IDE autocomplete — catches typos like `.gradeStatus` vs `.status` at
   build time instead of at runtime.
