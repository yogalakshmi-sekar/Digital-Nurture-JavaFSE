import { Injectable } from '@angular/core';

// NOTE: this service is intentionally NOT providedIn: 'root'.
// Task 67 provides it at the COMPONENT level instead
// (see NotificationComponent's `providers: [NotificationService]`),
// so it is deliberately left unregistered with the root injector here.
@Injectable()
export class NotificationService {
  private messages: string[] = [];

  push(message: string): void {
    this.messages.push(message);
  }

  getAll(): string[] {
    return this.messages;
  }

  clear(): void {
    this.messages = [];
  }
}
