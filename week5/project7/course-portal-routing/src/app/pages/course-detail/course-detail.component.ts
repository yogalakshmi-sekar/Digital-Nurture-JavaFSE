import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  course: Course | undefined;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    // Task 69: snapshot.paramMap is fine here because CourseDetailComponent
    // is destroyed and recreated every time :id changes (it's not reused
    // across navigations within nested routing in this setup). If the SAME
    // component instance could be reused for a different :id (e.g. clicking
    // "next course" without leaving the route), we'd subscribe to
    // route.paramMap (an Observable) instead of reading the snapshot once.
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    this.course = this.courseService.getCourseById(id);
  }
}
