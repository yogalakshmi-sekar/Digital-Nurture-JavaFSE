import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorHandlerInterceptor } from './interceptors/error-handler.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { courseReducer } from './store/course/course.reducer';
import { enrollmentReducer } from './store/enrollment/enrollment.reducer';
import { CourseEffects } from './store/course/course.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Step 78: provideHttpClient replaces HttpClientModule for standalone apps.
    // Step 88/90/91: interceptors run in registration order on the request
    // path, and in reverse order on the response path.
    provideHttpClient(
      withInterceptors([authInterceptor, loadingInterceptor, errorHandlerInterceptor])
    ),
    // Step 92: NgRx store + devtools (standalone equivalent of
    // StoreModule.forRoot({}) / StoreDevtoolsModule.instrument({ maxAge: 25 })).
    provideStore({ course: courseReducer, enrollment: enrollmentReducer }),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    // Step 97: register CourseEffects (standalone equivalent of
    // EffectsModule.forRoot([CourseEffects])).
    provideEffects([CourseEffects])
  ]
};
