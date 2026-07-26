# Hands-On 5 — Reactive Forms: FormBuilder, FormGroup, FormArray & Custom Validators

Project: `reactive-forms-portal` | Route: `/enroll-reactive`

## Setup
```bash
npm install
ng serve
# open http://localhost:4200/enroll-reactive
```

## What was built
- `ReactiveEnrollmentFormComponent` at `src/app/pages/reactive-enrollment-form/`
- Form built with `FormBuilder.group()` in `ngOnInit`, bound via `[formGroup]`
  and `formControlName` (no `ngModel` anywhere)
- Custom **synchronous** validator `noCourseCode` — rejects course codes starting with `XX`
- Custom **asynchronous** validator `simulateEmailCheck` — simulates an API
  call (800ms) that rejects any email containing `test@`
- `FormArray` (`additionalCourses`) for dynamically adding/removing course inputs
- A typed getter `get additionalCourses(): FormArray` instead of casting in the template
- Submit handler logging both `enrollForm.value` and `enrollForm.getRawValue()`

