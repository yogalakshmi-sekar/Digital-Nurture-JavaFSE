import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Course } from '../../models/course.model';
import { Student } from '../../models/student.model';
import { EnrollmentService } from '../../services/enrollment.service';

import { loadCourses, addCourse } from '../../store/course/course.actions';
import {
  selectAllCourses,
  selectCoursesLoading,
  selectCoursesError
} from '../../store/course/course.selectors';
import {
  enrollInCourse,
  unenrollFromCourse
} from '../../store/enrollment/enrollment.actions';
import { selectEnrolledIds } from '../../store/enrollment/enrollment.selectors';

import { CourseCardComponent } from '../course-card/course-card.component';
import { CourseFormComponent } from '../course-form/course-form.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

// Step 96 + Task 2 of Hands-On 9: state now comes from the NgRx store instead
// of a direct service subscription. Step 87's switchMap lives here too, on
// the "view enrolled students for the selected course" flow.
@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, CourseCardComponent, CourseFormComponent, LoadingSpinnerComponent],
  templateUrl: './course-list.component.html'
})
export class CourseListComponent implements OnInit {
  courses$: Observable<Course[]> = this.store.select(selectAllCourses);
  loading$: Observable<boolean> = this.store.select(selectCoursesLoading);
  error$: Observable<string | null> = this.store.select(selectCoursesError);
  enrolledIds$: Observable<number[]> = this.store.select(selectEnrolledIds);

  private selectedCourseId$ = new BehaviorSubject<number | null>(null);

  // Step 87: switchMap cancels the previous inner Observable (the previous
  // course's "get enrolled students" HTTP call) the instant a new courseId
  // arrives, so if the user clicks through courses quickly, a slow response
  // for a course they've since left can never overwrite the current list.
  students$: Observable<Student[] | null> = this.selectedCourseId$.pipe(
    switchMap(courseId =>
      courseId === null
        ? [null]
        : this.enrollmentService.getStudentsByCourse(courseId)
    )
  );

  constructor(
    private store: Store,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit(): void {
    // Step 96: dispatch the load action instead of subscribing to the
    // service directly -- the effect (course.effects.ts) does the HTTP call.
    this.store.dispatch(loadCourses());
  }

  onCreate(course: Omit<Course, 'id'>): void {
    this.store.dispatch(addCourse({ course }));
  }

  onSelect(courseId: number): void {
    this.selectedCourseId$.next(courseId);
  }

  onEnroll(courseId: number): void {
    this.store.dispatch(enrollInCourse({ courseId }));
  }

  onUnenroll(courseId: number): void {
    this.store.dispatch(unenrollFromCourse({ courseId }));
  }

  onDelete(courseId: number): void {
    // Left as an exercise hook: dispatch a deleteCourse action wired to a
    // DELETE effect the same way addCourse/addCourse$ is wired above.
    console.log('Delete requested for course', courseId);
  }

  trackByCourseId(_index: number, course: Course): number {
    return course.id;
  }
}
