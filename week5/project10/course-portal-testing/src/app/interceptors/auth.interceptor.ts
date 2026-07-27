import { HttpInterceptorFn } from '@angular/common/http';

// Task 88: functional interceptor (Angular 15+ style — what `ng generate
// interceptor` scaffolds by default now instead of a class implementing
// HttpInterceptor). Clones the outgoing request and attaches a header;
// requests are immutable, so clone() is mandatory — you cannot mutate `req`
// directly.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cloned = req.clone({
    setHeaders: { Authorization: 'Bearer mock-token-12345' }
  });
  return next(cloned);
};
