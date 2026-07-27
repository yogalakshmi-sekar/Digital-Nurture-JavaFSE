import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Task 72: parent shell for the nested /courses routes. Its own
// <router-outlet> renders whichever CHILD route is active
// ('' -> CourseListComponent, ':id' -> CourseDetailComponent) while this
// shell itself stays mounted — useful for shared chrome (breadcrumbs,
// tabs, filters) that should persist while the child view changes.
@Component({
  selector: 'app-courses-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="layout">
      <p class="breadcrumb">Courses</p>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .breadcrumb { font-size: 12px; color: #888; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
  `]
})
export class CoursesLayoutComponent {}
