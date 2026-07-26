import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

// Task 67: providing NotificationService HERE, at the component level,
// instead of `providedIn: 'root'`.
//
// WHY this creates a separate instance:
// Angular's dependency injection is HIERARCHICAL — every component gets its
// own injector, and that injector checks the `providers` array on the
// @Component decorator BEFORE walking up to its parent's injector, and
// eventually the root injector. By listing NotificationService in
// `providers` here, this component (and any children it hosts) gets a
// BRAND NEW instance of NotificationService, completely separate from any
// other instance elsewhere in the app — even if another component also
// lists it in its own `providers` array. Two <app-notification> instances
// on the same page would NOT share state, unlike CourseService/EnrollmentService
// which are app-wide singletons via providedIn: 'root'.
//
// This scoping is useful for state that should reset per-component-instance —
// e.g. a multi-step form wizard where each open wizard needs its own
// isolated draft state, not one shared across the whole app.
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  providers: [NotificationService], // <-- component-level provider
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  constructor(public notificationService: NotificationService) {}

  addSample(): void {
    this.notificationService.push(`Notification at ${new Date().toLocaleTimeString()}`);
  }
}
