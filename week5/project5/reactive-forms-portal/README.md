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

## Concept notes (why, not just how)

**Why reactive forms exist**
The entire form model — controls, validators, structure — lives in the
TypeScript class as a `FormGroup`. The template only *binds* to it. This
makes reactive forms:
- fully unit-testable without touching the DOM,
- easier to build dynamically (add/remove controls at runtime via `FormArray`),
- the natural home for complex validation logic (custom + async validators).

**`FormBuilder` vs `new FormGroup(...)`**
`FormBuilder` (`fb.group(...)`, `fb.control(...)`, `fb.array(...)`) is just a
shorthand factory — it removes the boilerplate of `new FormControl(...)`,
`new FormGroup(...)` everywhere. Functionally identical, just less verbose.

**Custom sync validator anatomy**
```ts
function noCourseCode(control: AbstractControl): ValidationErrors | null {
  return control.value?.startsWith('XX') ? { noCourseCode: true } : null;
}
```
- Input: the `AbstractControl` (so it works on `FormControl`, `FormGroup`, or `FormArray`)
- Output: `null` = valid, or an object whose key names the error (used later
  in the template as `errors?.['noCourseCode']`)

**Why async validators run *after* sync validators**
Async validators (e.g. hitting a backend to check email uniqueness) are
expensive. Angular only fires them once every synchronous validator on that
control has already passed — no point calling an API for a value that's
already known to be invalid. While pending, `control.pending` is `true`,
which is why the UI shows "Checking email availability...".

**`enrollForm.value` vs `enrollForm.getRawValue()`**
- `.value` — **excludes** disabled controls
- `.getRawValue()` — **includes every control**, disabled or not
Use `.value` for "what the user is actually submitting", and
`.getRawValue()` when you need the complete picture (e.g. persisting a draft
that includes fields you've temporarily disabled).

**`FormArray` and the typed getter**
`FormArray` models a variable-length list of controls (e.g. "add another
course"). The getter
```ts
get additionalCourses(): FormArray {
  return this.enrollForm.get('additionalCourses') as FormArray;
}
```
keeps the `as FormArray` cast in exactly one place (the component) instead of
scattering `$any(...)` / casts throughout the template, and gives you
IDE autocomplete for `.push()`, `.removeAt()`, `.controls` wherever you use it.

## Cognizant-style interview questions on this topic
1. **Why are reactive forms considered more "testable" than template-driven forms?**
   The `FormGroup` exists independently of the view — you can construct it and
   assert on its state in a plain Jasmine/Jest spec with no `TestBed` rendering needed.
2. **Write a custom validator that ensures a field's value is an even number.**
3. **What's the difference between a sync and an async validator in terms of when they run?**
4. **What does `control.pending` mean, and when would you show a UI element for it?**
5. **How do you dynamically add a new form control at runtime? Which Angular class enables this?**
   `FormArray.push(new FormControl(...))`.
6. **What's returned by a validator function to signal "invalid"? To signal "valid"?**
   An object with an error key (e.g. `{ required: true }`) for invalid; `null` for valid.
7. **`Validators.required` vs `Validators.requiredTrue` — when do you use each?**
   `required` checks for non-empty/non-null; `requiredTrue` specifically checks
   a boolean is `true` — used for "must-check" checkboxes like terms & conditions.
8. **How would you combine multiple validators on a single control?**
   Pass an array: `['', [Validators.required, Validators.minLength(3), noCourseCode]]`.
9. **Difference between `form.value` and `form.getRawValue()` — give a real scenario.**
   e.g. a "read-only preview" field is `disabled` but still needs to be saved
   to the backend — `getRawValue()` captures it, `value` silently drops it.
