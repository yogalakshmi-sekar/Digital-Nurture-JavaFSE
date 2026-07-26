import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css'
})

export class CourseList implements OnInit {

  isLoading = true;

  constructor() {
    alert("CourseList Constructor");
  }

  ngOnInit(): void {
    console.log("ngOnInit called");

    setTimeout(() => {
      console.log("Timer Executed");
      this.isLoading = false;
      console.log(this.isLoading);
    }, 1500);
  }
}