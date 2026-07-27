import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Course } from '../../models/course.model';
import * as CourseActions from '../../store/course/course.actions';
import { selectEnrolledCourses } from '../../store/enrollment/enrollment.selectors';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {
  // Task 99: selectEnrolledCourses is the CROSS-SLICE selector — it reads
  // from BOTH the course slice and the enrollment slice and joins them.
  enrolledCourses$: Observable<Course[]>;

  constructor(private store: Store) {
    this.enrolledCourses$ = this.store.select(selectEnrolledCourses);
  }

  ngOnInit(): void {
    // Ensure the course slice is populated even if the user lands on
    // /profile directly without visiting /courses first — the cross-slice
    // selector needs course data to join against.
    this.store.dispatch(CourseActions.loadCourses());
  }
}
