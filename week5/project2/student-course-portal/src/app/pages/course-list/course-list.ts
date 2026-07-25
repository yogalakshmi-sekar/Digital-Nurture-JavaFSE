import { Component } from '@angular/core';
import { CourseCard } from '../../components/course-card/course-card';

@Component({
  selector: 'app-course-list',
  imports: [CourseCard],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css'
})
export class CourseList {

  selectedCourseId: number | null = null;

  course1 = {
    id: 1,
    name: 'Java',
    code: 'CS101',
    credits: 4
  };

  course2 = {
    id: 2,
    name: 'Angular',
    code: 'CS201',
    credits: 3
  };

  course3 = {
    id: 3,
    name: 'Spring Boot',
    code: 'CS301',
    credits: 4
  };

  onEnroll(courseId: number) {
    console.log("Enrolling in Course:", courseId);
    this.selectedCourseId = courseId;
  }

}