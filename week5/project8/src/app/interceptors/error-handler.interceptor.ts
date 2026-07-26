import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

// Step 90: global error-handling interceptor. Runs AFTER the request goes out
// (interceptors run request-order on the way out, reverse order on the way
// back) and catches any HTTP error before it reaches feature-level
// catchError blocks, so cross-cutting concerns (auth redirects, global
// notifications) live in one place instead of being repeated per service call.
export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        console.warn('401 received - redirecting to login/home');
        router.navigate(['/']);
      } else if (error.status === 500) {
        // In a real app this would push to a global toast/notification service.
        console.error('Server error (500):', error.message);
        alert('Something went wrong on the server. Please try again later.');
      }
      // Re-throw so feature-level catchError (e.g. in CourseService) still runs.
      return throwError(() => error);
    })
  );
};
