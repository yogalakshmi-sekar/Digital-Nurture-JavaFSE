import { Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { CourseService } from './course.service';

// Task 63/64: EnrollmentService also providedIn: 'root' (singleton), and it
// injects CourseService internally — SERVICE-TO-SERVICE injection. This is
// a layered-architecture pattern: EnrollmentService only knows "which IDs
// are enrolled"; it delegates to CourseService to turn IDs into full Course
// objects, rather than duplicating course data.
@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private enrolledCourseIds: number[] = [];

  constructor(private courseService: CourseService) {}

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

  getEnrolledCourses(): Course[] {
    return this.enrolledCourseIds
      .map((id) => this.courseService.getCourseById(id))
      .filter((c): c is Course => !!c);
  }
}
