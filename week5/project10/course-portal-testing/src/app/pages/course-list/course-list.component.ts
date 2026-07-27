import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { CourseCardComponent } from '../../components/course-card/course-card.component';
import { NotificationComponent } from '../../components/notification/notification.component';
import * as CourseActions from '../../store/course/course.actions';
import { selectAllCourses, selectCoursesError, selectCoursesLoading } from '../../store/course/course.selectors';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CourseCardComponent, NotificationComponent],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  // Task 96: replace the direct service subscription with store selectors.
  // Rendered via the async pipe in the template — no manual subscribe needed.
  courses$: Observable<Course[]>;
  filteredCourses$: Observable<Course[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  private searchTerm$ = new BehaviorSubject<string>('');
  newCourseName = '';
  searchTerm = '';

  constructor(
    private store: Store,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.courses$ = this.store.select(selectAllCourses);
    this.loading$ = this.store.select(selectCoursesLoading);
    this.error$ = this.store.select(selectCoursesError);

    // combineLatest re-runs whenever EITHER the store's courses OR the
    // local search term changes — the client-side equivalent of a
    // memoised selector, but combining store state with local UI state.
    this.filteredCourses$ = combineLatest([this.courses$, this.searchTerm$]).pipe(
      map(([courses, term]) => {
        if (!term.trim()) return courses;
        const lower = term.toLowerCase();
        return courses.filter(
          (c) => c.name.toLowerCase().includes(lower) || c.code.toLowerCase().includes(lower)
        );
      })
    );
  }

  ngOnInit(): void {
    this.store.dispatch(CourseActions.loadCourses());
    this.searchTerm = this.route.snapshot.queryParamMap.get('search') ?? '';
    this.searchTerm$.next(this.searchTerm);
  }

  onSearchChange(): void {
    this.searchTerm$.next(this.searchTerm);
    this.router.navigate(['courses'], {
      queryParams: { search: this.searchTerm || null },
      queryParamsHandling: 'merge'
    });
  }

  onCardClicked(course: Course): void {
    this.router.navigate(['courses', course.id]);
  }

  // Task 97: dispatching addCourse instead of calling the service — the
  // effect handles the POST and re-adds the created course to the store.
  addSampleCourse(): void {
    this.store.dispatch(
      CourseActions.addCourse({
        course: {
          name: this.newCourseName || 'New Course',
          code: `NEW${Math.floor(Math.random() * 1000)}`,
          credits: 3,
          gradeStatus: 'pending'
        }
      })
    );
    this.newCourseName = '';
  }

  toggleStatus(course: Course): void {
    const nextStatus = course.gradeStatus === 'passed' ? 'pending' : 'passed';
    this.courseService.updateCourse(course.id, { gradeStatus: nextStatus }).subscribe({
      next: () => this.store.dispatch(CourseActions.loadCourses())
    });
  }

  removeCourse(course: Course): void {
    this.courseService.deleteCourse(course.id).subscribe({
      next: () => this.store.dispatch(CourseActions.loadCourses())
    });
  }
}
