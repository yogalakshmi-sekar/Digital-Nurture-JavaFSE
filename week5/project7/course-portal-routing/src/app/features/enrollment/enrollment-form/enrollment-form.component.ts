import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enrollment-form.component.html',
  styleUrls: ['./enrollment-form.component.css']
})
export class EnrollmentFormComponent {
  // Model backing the form — bound via [(ngModel)]
  studentName = '';
  studentEmail = '';
  courseId: number | null = null;
  preferredSemester = 'Odd';
  agreeToTerms = false;

  submitted = false;

  // Task 40: onSubmit logs form.value and form.valid
  onSubmit(form: NgForm): void {
    console.log('Form value:', form.value);
    console.log('Form valid:', form.valid);

    if (form.valid) {
      this.submitted = true;
    }
  }

  // Task 47: called by the Reset button (enrollForm.resetForm() is called from the template)
  onReset(): void {
    this.submitted = false;
  }
}
