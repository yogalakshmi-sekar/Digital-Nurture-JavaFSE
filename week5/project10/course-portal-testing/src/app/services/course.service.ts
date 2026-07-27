import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { Course } from '../models/course.model';

// Task 78/79: CourseService now talks to a real (mock) backend via
// HttpClient instead of holding an in-memory array. It's still
// providedIn: 'root' — the singleton behavior doesn't change, only WHERE
// the data lives.
@Injectable({ providedIn: 'root' })
export class CourseService {
  private baseUrl = 'http://localhost:3000/courses';

  constructor(private http: HttpClient) {}

  // Task 83/84/85/86: map, tap, catchError, retry all chained via .pipe().
  //
  // - tap: for the SIDE EFFECT of logging. tap never changes what flows
  //   through the stream — it just "taps into" the value as it passes.
  //   We use tap (not map) for logging because map's contract is
  //   "transform the value and return the new value" — using it purely
  //   for a console.log with no real transformation is misleading to
  //   anyone reading the code later, and risks accidentally mutating
  //   data if the callback isn't written carefully.
  // - retry(2): if the HTTP call fails (e.g. JSON Server briefly
  //   unreachable), RxJS re-subscribes up to 2 more times before giving
  //   up and letting the error continue to catchError.
  // - catchError: converts a raw HTTP error into a friendlier Error the
  //   component can display, and this is the ONLY place the true error
  //   is logged in detail (console.error) — the component never needs to
  //   know about HttpErrorResponse internals.
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl).pipe(
      tap((courses) => console.log('Courses loaded:', courses.length)),
      retry(2),
      catchError((err) => {
        console.error('getCourses failed:', err);
        return throwError(() => new Error('Failed to load courses. Please try again.'));
      })
    );
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/${id}`).pipe(
      catchError((err) => {
        console.error('getCourseById failed:', err);
        return throwError(() => new Error('Failed to load that course.'));
      })
    );
  }

  // Task 81: POST — the server assigns the id, so the input omits it.
  createCourse(course: Omit<Course, 'id'>): Observable<Course> {
    return this.http.post<Course>(this.baseUrl, course).pipe(
      catchError((err) => {
        console.error('createCourse failed:', err);
        return throwError(() => new Error('Failed to create course.'));
      })
    );
  }

  // Task 82: PUT — full or partial update of an existing course.
  updateCourse(id: number, changes: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/${id}`, { id, ...changes }).pipe(
      catchError((err) => {
        console.error('updateCourse failed:', err);
        return throwError(() => new Error('Failed to update course.'));
      })
    );
  }

  // Task 82: DELETE.
  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError((err) => {
        console.error('deleteCourse failed:', err);
        return throwError(() => new Error('Failed to delete course.'));
      })
    );
  }
}
