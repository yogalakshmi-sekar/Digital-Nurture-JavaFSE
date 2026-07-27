import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Course } from '../models/course.model';
import { Student } from '../models/student.model';
import { CourseService } from './course.service';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private baseUrl = 'http://localhost:3000/students';

  // enrolledCourseIds still lives client-side here (kept from Hands-On 6) —
  // Hands-On 8 only asks us to move COURSE data behind HTTP; a real app
  // would likely POST enrollments too, but we keep this part simple so the
  // focus stays on the RxJS/HTTP concepts being taught.
  private enrolledCourseIds: number[] = [];

  constructor(
    private http: HttpClient,
    private courseService: CourseService
  ) {}

  enroll(courseId: number): void {
    if (!this.isEnrolled(courseId)) {
      this.enrolledCourseIds.push(courseId);
    }
  }

  unenroll(courseId: number): void {
    this.enrolledCourseIds = this.enrolledCourseIds.filter((id) => id !== courseId);
  }

  isEnrolled(courseId: number): boolean {
    return this.enrolledCourseIds.includes(courseId);
  }

  // Task 79 changed getCourseById to return an Observable (it's now an HTTP
  // call), so getEnrolledCourses becomes async too. forkJoin runs all the
  // individual getCourseById() calls in parallel and emits ONE array once
  // every one of them has completed — the right tool whenever you need to
  // combine several independent HTTP calls into a single result.
  getEnrolledCourses(): Observable<Course[]> {
    if (this.enrolledCourseIds.length === 0) {
      return of([]);
    }
    const requests = this.enrolledCourseIds.map((id) => this.courseService.getCourseById(id));
    return forkJoin(requests);
  }

  // Task 87: used with switchMap in CourseDetailComponent. Given a
  // courseId, fetches the students enrolled in that course.
  getStudentsByCourse(courseId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}?courseId=${courseId}`).pipe(
      catchError((err) => {
        console.error('getStudentsByCourse failed:', err);
        return throwError(() => new Error('Failed to load enrolled students.'));
      })
    );
  }
}
