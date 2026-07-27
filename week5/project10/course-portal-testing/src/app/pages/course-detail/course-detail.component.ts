import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Course } from '../../models/course.model';
import { Student } from '../../models/student.model';
import { CourseService } from '../../services/course.service';
import { EnrollmentService } from '../../services/enrollment.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  course: Course | undefined;
  students$!: Observable<Student[]>;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    this.courseService.getCourseById(id).subscribe({
      next: (course) => (this.course = course)
    });

    // Task 87: switchMap chains a SECOND HTTP call that depends on the
    // route's :id param. We subscribe to route.paramMap (not snapshot)
    // here specifically to make switchMap's cancellation behavior visible:
    // if the user navigates from /courses/1 to /courses/2 quickly — before
    // the students-for-course-1 request finishes — switchMap CANCELS that
    // in-flight request and starts a fresh one for course 2. This matters
    // because without switchMap (e.g. using mergeMap), a slow response for
    // course 1 could arrive AFTER the course 2 response and incorrectly
    // overwrite the UI with stale data — the classic "out-of-order response"
    // bug. switchMap guarantees only the LATEST inner Observable's result
    // ever reaches the subscriber.
    this.students$ = this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((courseId) => this.enrollmentService.getStudentsByCourse(courseId))
    );
  }
}
