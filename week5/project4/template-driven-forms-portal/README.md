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

## Concept notes (why, not just how)

**Why template-driven forms exist**
Angular gives you two form strategies. Template-driven forms let the *template*
own the form model — Angular builds an internal `FormGroup` for you behind the
scenes, driven by the `name` attributes and `ngModel` directives. It's fast to
write for simple forms, but harder to unit test (the model doesn't exist until
the view renders) and harder to scale to dynamic/complex forms.

**`ngModel` two-way binding**
`[(ngModel)]="studentName"` is banana-in-a-box syntax for
`[ngModel]="studentName" (ngModelChange)="studentName = $event"`. It keeps the
component property and the input's DOM value in sync in both directions.

**Why `name` is mandatory**
Without a `name` attribute, Angular can't register the control under the
parent `NgForm` — you'd get a runtime error ("name attribute must be set").
The `name` value becomes the key in `form.value`.

**`touched` vs `dirty` vs `pristine`**
- `touched`: control has been focused and blurred at least once
- `dirty`: value has changed from its initial value
- `pristine`: opposite of dirty
We show errors on `touched` (not `dirty`) so the user isn't shown an error
message while they're still mid-typing on first entry — only after they've
left the field.

**`ngForm` / `NgForm`**
`#enrollForm="ngForm"` exposes the directive instance that Angular
automatically creates on any `<form>` tag once `FormsModule` is imported.
It exposes `.value`, `.valid`, `.invalid`, `.controls`, and `.resetForm()`.

## Cognizant-style interview questions on this topic
1. **Template-driven vs Reactive forms — when would you choose one over the other?**
   *Template-driven*: simple forms, quick prototypes, form logic mostly in HTML.
   *Reactive*: complex/dynamic forms, need unit testing without rendering DOM,
   need fine-grained control over validation timing (sync + async), dynamic
   controls via `FormArray`.
2. **What does the `name` attribute do in a template-driven form, and what breaks without it?**
3. **Difference between `ng-touched` and `ng-dirty`?**
4. **How do you disable a submit button until the form is valid?**
   `[disabled]="enrollForm.invalid"`.
5. **How would you reset just one field vs the whole form?**
   Whole form: `form.resetForm()`. Single control: get the control via
   `form.controls['fieldName'].reset()`.
6. **Is the form model available before the view renders in template-driven forms?**
   No — this is the main reason they're harder to unit test than reactive forms.
7. **What's the built-in Angular validator for "must be checked" (e.g. a terms
   checkbox) in template-driven forms?**
   `required` on a checkbox effectively requires it to be `true` (checked);
   contrast this with reactive forms where `Validators.requiredTrue` is explicit.
