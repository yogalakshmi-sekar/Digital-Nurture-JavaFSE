import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Course } from '../../models/course.model';
import { Student } from '../../models/student.model';
import { CourseService } from '../../services/course.service';
import { EnrollmentService } from '../../services/enrollment.service';

import { CourseCardComponent } from '../course-card/course-card.component';
import { CourseFormComponent } from '../course-form/course-form.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

// Hands-On 8 - Task 1 (steps 78-82), Task 2 (steps 83-87): everything here
// talks to CourseService/EnrollmentService directly via subscribe() / the
// async pipe -- no NgRx yet, that's introduced in Hands-On 9.
@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, CourseCardComponent, CourseFormComponent, LoadingSpinnerComponent],
  templateUrl: './course-list.component.html'
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  enrolledIds: number[] = [];

  private selectedCourseId$ = new BehaviorSubject<number | null>(null);

  // Step 87: switchMap cancels the previous inner Observable (the previous
  // course's "get enrolled students" HTTP call) the instant a new courseId
  // arrives, so a slow response for a course the user has since left can
  // never overwrite what's currently on screen.
  students$: Observable<Student[] | null> = this.selectedCourseId$.pipe(
    switchMap(courseId =>
      courseId === null ? [null] : this.enrollmentService.getStudentsByCourse(courseId)
    )
  );

  constructor(
    private courseService: CourseService,
    private enrollmentService: EnrollmentService
  ) {}

  // Step 80: subscribe with the full observer object (next/error/complete).
  ngOnInit(): void {
    this.isLoading = true;
    this.courseService.getCourses().subscribe({
      next: courses => (this.courses = courses),
      error: err => {
        this.errorMessage = err.message;
        this.isLoading = false;
      },
      complete: () => (this.isLoading = false)
    });
  }

  // Step 81: POST a new course, wired to the form's submit handler.
  onCreate(course: Omit<Course, 'id'>): void {
    this.courseService.createCourse(course).subscribe({
      next: created => (this.courses = [...this.courses, created]),
      error: err => (this.errorMessage = err.message)
    });
  }

  // Step 82: PUT to update a course.
  onUpdate(course: Course): void {
    this.courseService.updateCourse(course).subscribe({
      next: updated => {
        this.courses = this.courses.map(c => (c.id === updated.id ? updated : c));
      },
      error: err => (this.errorMessage = err.message)
    });
  }

  // Step 82: DELETE a course.
  onDelete(courseId: number): void {
    this.courseService.deleteCourse(courseId).subscribe({
      next: () => (this.courses = this.courses.filter(c => c.id !== courseId)),
      error: err => (this.errorMessage = err.message)
    });
  }

  onSelect(courseId: number): void {
    this.selectedCourseId$.next(courseId);
  }

  onEnroll(courseId: number): void {
    this.enrollmentService.enroll(1, courseId).subscribe({
      next: () => (this.enrolledIds = [...this.enrolledIds, courseId]),
      error: err => (this.errorMessage = err.message)
    });
  }

  onUnenroll(courseId: number): void {
    this.enrolledIds = this.enrolledIds.filter(id => id !== courseId);
  }

  trackByCourseId(_index: number, course: Course): number {
    return course.id;
  }
}
