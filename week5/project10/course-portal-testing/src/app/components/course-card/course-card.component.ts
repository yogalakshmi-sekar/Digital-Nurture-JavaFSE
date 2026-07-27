import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../../models/course.model';
import { enrollInCourse, unenrollFromCourse } from '../../store/enrollment/enrollment.actions';
import { selectEnrolledIds } from '../../store/enrollment/enrollment.selectors';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css']
})
export class CourseCardComponent implements OnChanges {
  @Input({ required: true }) course!: Course;
  @Output() cardClicked = new EventEmitter<Course>();

  // Task 100: instead of injecting EnrollmentService directly, the card
  // now reads enrollment state from the STORE and DISPATCHES actions —
  // the component doesn't know or care HOW enrollment is tracked
  // internally, only that it selects state and dispatches intent.
  isEnrolled$: Observable<boolean>;

  constructor(private store: Store) {
    this.isEnrolled$ = this.store.select(selectEnrolledIds).pipe(
      map((ids) => ids.includes(this.course?.id))
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course']) {
      console.log('CourseCardComponent received a new course input:', changes['course'].currentValue);
    }
  }

  toggleEnroll(event: Event, currentlyEnrolled: boolean): void {
    event.stopPropagation();
    if (currentlyEnrolled) {
      this.store.dispatch(unenrollFromCourse({ courseId: this.course.id }));
    } else {
      this.store.dispatch(enrollInCourse({ courseId: this.course.id }));
    }
  }

  onCardClick(): void {
    this.cardClicked.emit(this.course);
  }
}
