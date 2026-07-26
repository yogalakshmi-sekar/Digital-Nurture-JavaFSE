import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorHandlerInterceptor } from './interceptors/error-handler.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Step 78: provideHttpClient replaces HttpClientModule for standalone apps.
    // Step 88/90/91: interceptors run in registration order on the request
    // path, and in reverse order on the response path.
    provideHttpClient(
      withInterceptors([authInterceptor, loadingInterceptor, errorHandlerInterceptor])
    )
  ]
};
