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


