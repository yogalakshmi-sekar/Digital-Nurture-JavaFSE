import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Task 75/76: functional CanActivate guard (the modern Angular 15+/standalone
// equivalent of `ng generate guard` producing a class implementing
// CanActivate — same behavior, less boilerplate, no need for an injectable
// class of its own).
//
// A guard is just a function returning boolean | UrlTree
// (or an Observable/Promise of the same). Returning `false` blocks
// navigation; returning a UrlTree (or navigating manually + returning false)
// redirects instead.
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
