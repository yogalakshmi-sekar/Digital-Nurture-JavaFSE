import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { Course } from '../models/course.model';

const API_URL = 'http://localhost:3000/courses';

// Step 78-79: CourseService refactored to use real HTTP calls instead of a
// hardcoded array. HttpClient methods return *cold* Observables -- they do
// not fire the request until something subscribes (or the async pipe does).
@Injectable({ providedIn: 'root' })
export class CourseService {
  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(API_URL).pipe(
      // Step 85: tap is for side effects (logging/analytics) and must never
      // mutate the stream's data -- use map for transformations instead.
      tap(courses => console.log('Courses loaded:', courses.length)),
      // Step 83: map transforms the response before it reaches the component.
      map(courses => courses.filter(c => c.credits >= 0)),
      // Step 86: retry(2) retries the failed request up to 2 times before
      // the error is allowed to propagate to catchError.
      retry(2),
      // Step 84: catchError intercepts the error, logs it, and re-throws a
      // friendlier error for the component to display.
      catchError(err => {
        console.error('getCourses failed:', err);
        return throwError(() => new Error('Failed to load courses. Please try again.'));
      })
    );
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${API_URL}/${id}`).pipe(
      catchError(err => {
        console.error('getCourseById failed:', err);
        return throwError(() => new Error('Failed to load the course. Please try again.'));
      })
    );
  }

  // Step 81: POST a new course.
  createCourse(course: Omit<Course, 'id'>): Observable<Course> {
    return this.http.post<Course>(API_URL, course).pipe(
      catchError(err => {
        console.error('createCourse failed:', err);
        return throwError(() => new Error('Failed to create course. Please try again.'));
      })
    );
  }

  // Step 82: PUT to update an existing course.
  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(`${API_URL}/${course.id}`, course).pipe(
      catchError(err => {
        console.error('updateCourse failed:', err);
        return throwError(() => new Error('Failed to update course. Please try again.'));
      })
    );
  }

  // Step 82: DELETE a course.
  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`).pipe(
      catchError(err => {
        console.error('deleteCourse failed:', err);
        return throwError(() => new Error('Failed to delete course. Please try again.'));
      })
    );
  }
}
