import { Injectable } from '@angular/core';
import { Course } from '../models/course.model';

// Task 58: providedIn: 'root' registers this service with Angular's ROOT
// injector — Angular creates exactly ONE instance for the whole app
// (a singleton) and hands that same instance to every component/service
// that injects it. This is what makes it usable as a shared data store.
@Injectable({ providedIn: 'root' })
export class CourseService {
  private courses: Course[] = [
    { id: 1, name: 'Angular Fundamentals', code: 'ANG101', credits: 4, gradeStatus: 'passed' },
    { id: 2, name: 'Data Structures', code: 'DSA201', credits: 4, gradeStatus: 'pending' },
    { id: 3, name: 'Database Systems', code: 'DBM301', credits: 3, gradeStatus: 'pending' },
    { id: 4, name: 'Java Fullstack', code: 'JFS401', credits: 5, gradeStatus: 'failed' },
    { id: 5, name: 'Cloud Computing', code: 'CLD501', credits: 3, gradeStatus: 'pending' }
  ];

  getCourses(): Course[] {
    return this.courses;
  }

  getCourseById(id: number): Course | undefined {
    return this.courses.find((c) => c.id === id);
  }

  addCourse(course: Course): void {
    this.courses.push(course);
  }
}
