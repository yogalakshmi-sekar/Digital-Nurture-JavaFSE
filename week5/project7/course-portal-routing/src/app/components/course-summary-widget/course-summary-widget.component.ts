import { Component } from '@angular/core';
import { CourseService } from '../../services/course.service';

// Task 62: a SECOND, independent component that also injects CourseService.
// Because CourseService is providedIn: 'root', this widget receives the
// EXACT SAME instance as CourseListComponent and HomeComponent — proving
// the singleton behavior. Add a course anywhere, and every consumer of
// CourseService (this widget included) sees the updated count immediately
// because they all read from the same underlying array reference.
@Component({
  selector: 'app-course-summary-widget',
  standalone: true,
  template: `
    <div class="widget">
      <strong>{{ courseService.getCourses().length }}</strong> total courses tracked
      (shared instance check)
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
  // public so it's readable directly from the template
  constructor(public courseService: CourseService) {}
}
