import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../models/course.model';
import { EnrollmentService } from '../../services/enrollment.service';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css']
})
export class CourseCardComponent {
  @Input({ required: true }) course!: Course;

  // Task 70: lets the parent (CourseListComponent) navigate on card click
  // without CourseCardComponent needing to know about the Router itself —
  // keeps this component reusable/presentational.
  @Output() cardClicked = new EventEmitter<Course>();

  // Task 65: EnrollmentService injected directly into the card.
  constructor(private enrollmentService: EnrollmentService) {}

  get isEnrolled(): boolean {
    return this.enrollmentService.isEnrolled(this.course.id);
  }

  toggleEnroll(event: Event): void {
    event.stopPropagation(); // don't trigger card navigation when clicking the button
    if (this.isEnrolled) {
      this.enrollmentService.unenroll(this.course.id);
    } else {
      this.enrollmentService.enroll(this.course.id);
    }
  }

  onCardClick(): void {
    this.cardClicked.emit(this.course);
  }
}
