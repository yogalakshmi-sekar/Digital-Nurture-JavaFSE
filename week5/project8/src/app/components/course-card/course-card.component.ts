import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="course-card">
      <div>
        <strong>{{ course.title }}</strong>
        <div>{{ course.credits }} credits &middot; {{ course.instructor }}</div>
      </div>
      <div>
        <button *ngIf="!isEnrolled" (click)="enroll.emit(course.id)">Enroll</button>
        <button *ngIf="isEnrolled" class="danger" (click)="unenroll.emit(course.id)">Unenroll</button>
        <button (click)="select.emit(course.id)">View Students</button>
        <button class="danger" (click)="remove.emit(course.id)">Delete</button>
      </div>
    </div>
  `
})
export class CourseCardComponent {
  @Input() course!: Course;
  @Input() isEnrolled = false;
  @Output() enroll = new EventEmitter<number>();
  @Output() unenroll = new EventEmitter<number>();
  @Output() select = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();
}
