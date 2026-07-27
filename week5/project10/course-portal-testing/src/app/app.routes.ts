import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CoursesLayoutComponent } from './pages/courses-layout/courses-layout.component';
import { CourseListComponent } from './pages/course-list/course-list.component';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
import { StudentProfileComponent } from './pages/student-profile/student-profile.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  // Task 72: nested routes — CoursesLayoutComponent hosts its own
  // <router-outlet> for the '' (list) and ':id' (detail) children.
  {
    path: 'courses',
    component: CoursesLayoutComponent,
    children: [
      { path: '', component: CourseListComponent },
      { path: ':id', component: CourseDetailComponent }
    ]
  },

  // Task 76: guarded route — redirects to '/' if AuthService.isLoggedIn is false.
  { path: 'profile', component: StudentProfileComponent, canActivate: [authGuard] },

  // Task 73/74: lazy-loaded feature area. This chunk is only fetched the
  // first time the user navigates to /enroll — check the Network tab.
  // Also guarded (per Task 76: "/profile and /enroll" both protected).
  {
    path: 'enroll',
    canActivate: [authGuard],
    loadChildren: () => import('./features/enrollment/enrollment.routes').then((m) => m.default)
  },

  // Task 68: wildcard MUST be last.
  { path: '**', component: NotFoundComponent }
];
