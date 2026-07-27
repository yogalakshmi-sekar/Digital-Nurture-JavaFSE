import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { selectAllCourses } from '../../store/course/course.selectors';

// Proves the store is a single shared source of truth: this widget and
// HomeComponent both select from the SAME 'course' slice — no separate
// service instance or duplicate HTTP call involved.
@Component({
  selector: 'app-course-summary-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="widget">
      <strong>{{ (totalCourses$ | async) ?? 0 }}</strong> total courses tracked (shared store slice)
    </div>
  `,
  styles: [`
    .widget {
      background: #ede7f6;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 13px;
      margin-top: 12px;
    }
  `]
})
export class CourseSummaryWidgetComponent {
  totalCourses$ = this.store.select(selectAllCourses).pipe(map((courses) => courses.length));

  constructor(private store: Store) {}
}
