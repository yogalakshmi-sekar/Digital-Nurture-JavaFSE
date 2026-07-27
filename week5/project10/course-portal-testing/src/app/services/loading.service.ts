import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Task 91: tracks how many HTTP requests are currently in flight so the
// spinner only hides once EVERY concurrent request has finished — a naive
// boolean flag would flicker off after the first of several parallel
// requests completes.
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private activeRequests = 0;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  show(): void {
    this.activeRequests++;
    this.isLoadingSubject.next(true);
  }

  hide(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    if (this.activeRequests === 0) {
      this.isLoadingSubject.next(false);
    }
  }
}
