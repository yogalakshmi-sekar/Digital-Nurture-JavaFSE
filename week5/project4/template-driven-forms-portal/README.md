# Hands-On 4 — Template-Driven Forms & Validation

Project: `template-driven-forms-portal` | Route: `/enroll`

## Setup (run locally before pushing / after cloning)
```bash
npm install
ng serve
# open http://localhost:4200/enroll
```

## What was built
- `EnrollmentFormComponent` at `src/app/pages/enrollment-form/`
- A template-driven form (`#enrollForm="ngForm"`) with 5 fields, each wired
  with `[(ngModel)]` and a `name` attribute
- Built-in validators: `required`, `minlength`, `email`, `requiredTrue`-style checkbox check
- Per-field template reference variables (`#nameCtrl="ngModel"`) to read
  `touched` / `errors` state and show contextual messages
- `ng-valid` / `ng-invalid` / `ng-touched` CSS state classes for live red/green borders
- Submit handler that logs `form.value` and `form.valid`
- Reset button using `enrollForm.resetForm()`


