import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course } from '../../models/course.model';

// Step 81: wired to CourseService.createCourse (via the store's addCourse
// action in this project, since state is now managed through NgRx).
@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form class="course-form" (ngSubmit)="submit()">
      <input name="title" [(ngModel)]="title" placeholder="Course title" required />
      <input name="credits" type="number" [(ngModel)]="credits" placeholder="Credits" required />
      <input name="instructor" [(ngModel)]="instructor" placeholder="Instructor" required />
      <button type="submit">Add Course</button>
    </form>
  `
})
export class CourseFormComponent {
  title = '';
  credits: number | null = null;
  instructor = '';

  @Output() create = new EventEmitter<Omit<Course, 'id'>>();

  submit(): void {
    if (!this.title || this.credits === null || !this.instructor) return;
    this.create.emit({ title: this.title, credits: this.credits, instructor: this.instructor });
    this.title = '';
    this.credits = null;
    this.instructor = '';
  }
}
