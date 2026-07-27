import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Task 90: global HTTP error handling in ONE place instead of repeating
// catchError logic in every service call. Still re-throws afterward
// (`throwError`) so individual components/services can add their own
// specific handling (e.g. a friendlier message) on top of this global one.
export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('401 Unauthorized — redirecting to home');
        router.navigate(['/']);
      } else if (error.status === 500) {
        console.error('Server error — a global notification would show here');
      }
      return throwError(() => error);
    })
  );
};
