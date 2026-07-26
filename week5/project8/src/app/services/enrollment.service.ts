import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Student } from '../models/student.model';

const API_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  constructor(private http: HttpClient) {}

  // Step 87: used inside switchMap -- fetches students enrolled for a given
  // course. switchMap cancels the previous inner Observable (the previous
  // course's HTTP request) whenever a new courseId arrives, so an out-of-date
  // response for a course the user has since navigated away from can never
  // "win the race" and overwrite the current selection.
  getStudentsByCourse(courseId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${API_URL}/students?courseId=${courseId}`).pipe(
      catchError(err => {
        console.error('getStudentsByCourse failed:', err);
        return throwError(() => new Error('Failed to load enrolled students.'));
      })
    );
  }

  enroll(studentId: number, courseId: number): Observable<any> {
    return this.http.post(`${API_URL}/enrollments`, { studentId, courseId });
  }

  unenroll(enrollmentId: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/enrollments/${enrollmentId}`);
  }
}
