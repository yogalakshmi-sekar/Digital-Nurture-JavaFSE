import { Routes } from '@angular/router';
import { EnrollmentFormComponent } from './pages/enrollment-form/enrollment-form.component';

export const routes: Routes = [
  { path: 'enroll', component: EnrollmentFormComponent },
  { path: '', redirectTo: 'enroll', pathMatch: 'full' },
  { path: '**', redirectTo: 'enroll' }
];
