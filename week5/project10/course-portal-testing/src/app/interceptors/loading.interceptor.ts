import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

// Task 91: finalize() runs on BOTH success and error paths — the RxJS
// equivalent of a try/finally block — which is exactly what you want for
// hiding a spinner: it must disappear whether the request succeeded or failed.
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.show();

  return next(req).pipe(finalize(() => loadingService.hide()));
};
