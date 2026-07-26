import { HttpInterceptorFn } from '@angular/common/http';

// Step 88: functional interceptor (Angular 15+/20 style). Clones the outgoing
// request and adds a mock Authorization header. Verify via
// DevTools -> Network -> select a request -> Request Headers.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cloned = req.clone({
    setHeaders: { Authorization: 'Bearer mock-token-12345' }
  });
  return next(cloned);
};
