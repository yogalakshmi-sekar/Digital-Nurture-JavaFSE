import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  searchTerm = '';

  constructor(
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.courses = this.courseService.getCourses();

    // Task 71: read the ?search= query param back on load, so a shared/
    // bookmarked URL like /courses?search=angular restores the same filter.
    this.searchTerm = this.route.snapshot.queryParamMap.get('search') ?? '';
  }

  get filteredCourses(): Course[] {
    if (!this.searchTerm.trim()) {
      return this.courses;
    }
    const term = this.searchTerm.toLowerCase();
    return this.courses.filter(
      (c) => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term)
    );
  }

  // Task 71: pushes the current search into the URL as a query param
  // (?search=angular) WITHOUT navigating to a different route — query
  // params layer on top of the current path.
  onSearchChange(): void {
    this.router.navigate(['courses'], {
      queryParams: { search: this.searchTerm || null },
      queryParamsHandling: 'merge'
    });
  }

  // Task 70: navigate to the dynamic detail route for the clicked course.
  onCardClicked(course: Course): void {
    this.router.navigate(['courses', course.id]);
  }

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
    this.courses = this.courseService.getCourses();
  }
}
