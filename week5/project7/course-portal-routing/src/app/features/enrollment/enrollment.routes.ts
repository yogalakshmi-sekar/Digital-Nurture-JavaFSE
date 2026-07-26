import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../../guards/unsaved-changes.guard';

// Task 73: this file plays the role of "enrollment.module.ts" +
// "enrollment-routing.module.ts" from the exercise, adapted to Angular's
// standalone API. Instead of an NgModule with `declarations`, standalone
// components are lazy-loaded directly via `loadComponent`, and a whole
// sub-tree of routes is lazy-loaded via `loadChildren` pointing at THIS
// file's default export — same chunking behavior, no NgModule required.
//
// (If your course specifically wants the NgModule-based
// `ng generate module features/enrollment --routing` version, the
// equivalent would wrap these two route entries in an EnrollmentModule
// with `imports: [EnrollmentFormComponent, ReactiveEnrollmentFormComponent, RouterModule.forChild(routes)]`
// and lazy-load via `loadChildren: () => import('./enrollment.module').then(m => m.EnrollmentModule)`.)
export const ENROLLMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./enrollment-form/enrollment-form.component').then((m) => m.EnrollmentFormComponent)
  },
  {
    path: 'reactive',
    loadComponent: () =>
      import('./reactive-enrollment-form/reactive-enrollment-form.component').then(
        (m) => m.ReactiveEnrollmentFormComponent
      ),
    canDeactivate: [unsavedChangesGuard]
  }
];

export default ENROLLMENT_ROUTES;
