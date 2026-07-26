import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { CanComponentDeactivate } from '../../../guards/unsaved-changes.guard';

// Task 53: Custom synchronous validator.
// A validator is just a function: (control) => ValidationErrors | null
// Returning null means "valid"; returning an object means "invalid", keyed by the error name.
export function noCourseCode(control: AbstractControl): ValidationErrors | null {
  const value = (control.value ?? '').toString();
  return value.startsWith('XX') ? { noCourseCode: true } : null;
}

// Task 55: Custom async validator.
// Async validators return a Promise or Observable<ValidationErrors | null>.
// Angular waits for this to resolve before marking the control PENDING -> VALID/INVALID.
// They only run after ALL sync validators on the control have already passed.
export function simulateEmailCheck(control: AbstractControl): Promise<ValidationErrors | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const taken = (control.value ?? '').toString().includes('test@');
      resolve(taken ? { emailTaken: true } : null);
    }, 800);
  });
}

@Component({
  selector: 'app-reactive-enrollment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reactive-enrollment-form.component.html',
  styleUrls: ['./reactive-enrollment-form.component.css']
})
export class ReactiveEnrollmentFormComponent implements OnInit, CanComponentDeactivate {
  enrollForm!: FormGroup;
  submitted = false;

  // Holds the last logged values so we can also show them on screen (handy for demos/interviews)
  lastValue: any = null;
  lastRawValue: any = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Task 49: form structure lives entirely in the component class
    this.enrollForm = this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(3)]],
      studentEmail: this.fb.control(
        '',
        [Validators.required, Validators.email],
        [simulateEmailCheck] // async validators go in the 3rd argument
      ),
      courseId: [null, [Validators.required, noCourseCode]],
      preferredSemester: ['Odd', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue],
      additionalCourses: this.fb.array([])
    });
  }

  // Task 57: typed getter for the FormArray.
  // Better than casting in the template (enrollForm.get('additionalCourses')) because:
  // 1. Casting logic lives in ONE place (the component), not repeated everywhere in the template.
  // 2. TypeScript gives you FormArray-specific autocomplete (controls, push, removeAt) safely.
  // 3. Template stays declarative and readable — no 'as FormArray' noise scattered around HTML.
  get additionalCourses(): FormArray {
    return this.enrollForm.get('additionalCourses') as FormArray;
  }

  addCourse(): void {
    this.additionalCourses.push(this.fb.control('', Validators.required));
  }

  removeCourse(index: number): void {
    this.additionalCourses.removeAt(index);
  }

  onSubmit(): void {
    // Task 52:
    // enrollForm.value        -> EXCLUDES disabled controls
    // enrollForm.getRawValue() -> INCLUDES all controls, even disabled ones
    // Use getRawValue() when you need the full picture (e.g. saving a draft),
    // and value when you only want what the user is actually allowed to submit.
    this.lastValue = this.enrollForm.value;
    this.lastRawValue = this.enrollForm.getRawValue();

    console.log('enrollForm.value:', this.lastValue);
    console.log('enrollForm.getRawValue():', this.lastRawValue);

    if (this.enrollForm.valid) {
      this.submitted = true;
    }
  }

  onReset(): void {
    this.enrollForm.reset({ preferredSemester: 'Odd', agreeToTerms: false });
    this.additionalCourses.clear();
    this.submitted = false;
  }

  // Task 77: read by the UnsavedChangesGuard (CanDeactivate) before allowing
  // navigation away from this route. `enrollForm.dirty` becomes true the
  // moment the user changes ANY control's value from its initial value —
  // we also ignore it once the form has been successfully submitted, since
  // there's nothing left to lose at that point.
  hasUnsavedChanges(): boolean {
    return this.enrollForm.dirty && !this.submitted;
  }
}
