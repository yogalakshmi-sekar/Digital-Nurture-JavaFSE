import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as CourseActions from '../../store/course/course.actions';
import { selectAllCourses } from '../../store/course/course.selectors';
import { CourseSummaryWidgetComponent } from '../../components/course-summary-widget/course-summary-widget.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CourseSummaryWidgetComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  liveCourseCount$: Observable<number>;

  constructor(private store: Store) {
    this.liveCourseCount$ = this.store.select(selectAllCourses).pipe(map((courses) => courses.length));
  }

  ngOnInit(): void {
    this.store.dispatch(CourseActions.loadCourses());
  }
}
