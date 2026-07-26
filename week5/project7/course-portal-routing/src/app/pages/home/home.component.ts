import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { CourseSummaryWidgetComponent } from '../../components/course-summary-widget/course-summary-widget.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CourseSummaryWidgetComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Task 61: same CourseService singleton injected here as in CourseListComponent.
  liveCourseCount = 0;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.liveCourseCount = this.courseService.getCourses().length;
  }
}
