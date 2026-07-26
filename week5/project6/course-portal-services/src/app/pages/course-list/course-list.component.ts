import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { CourseCardComponent } from '../../components/course-card/course-card.component';
import { NotificationComponent } from '../../components/notification/notification.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CourseCardComponent, NotificationComponent],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  newCourseName = '';

  // Task 60: CourseService injected via constructor — Angular resolves this
  // from the root injector (since providedIn: 'root') and hands back the
  // SAME instance that HomeComponent and CourseSummaryWidgetComponent get.
  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courses = this.courseService.getCourses();
  }

  // Task 62: adding a course here updates the SAME array instance that
  // HomeComponent's count and CourseSummaryWidgetComponent both read from —
  // no extra wiring needed, because they all share the singleton.
  addSampleCourse(): void {
    const nextId = Math.max(...this.courses.map((c) => c.id)) + 1;
    this.courseService.addCourse({
      id: nextId,
      name: this.newCourseName || `New Course ${nextId}`,
      code: `NEW${nextId}`,
      credits: 3,
      gradeStatus: 'pending'
    });
    this.newCourseName = '';
    // re-read to refresh the local reference used by *ngFor
    this.courses = this.courseService.getCourses();
  }
}
