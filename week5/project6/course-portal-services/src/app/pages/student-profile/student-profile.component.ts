import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../models/course.model';
import { EnrollmentService } from '../../services/enrollment.service';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {
  enrolledCourses: Course[] = [];

  // Task 66: EnrollmentService injected — same singleton instance that
  // CourseCardComponent calls .enroll()/.unenroll() on. Because it's one
  // shared instance, enrolling from the Courses page is immediately
  // reflected here without any manual syncing.
  constructor(private enrollmentService: EnrollmentService) {}

  ngOnInit(): void {
    this.enrolledCourses = this.enrollmentService.getEnrolledCourses();
  }
}
