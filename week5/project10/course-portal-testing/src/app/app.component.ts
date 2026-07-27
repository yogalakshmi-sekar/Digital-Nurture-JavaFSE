import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Task 91: global spinner bound via async pipe — no manual
         subscribe/unsubscribe needed. -->
    <div class="global-spinner" *ngIf="loadingService.isLoading$ | async">
      Loading...
    </div>

    <header class="topbar">
      <h2>Hands-On 10 — Unit Testing (Jasmine, Karma, TestBed)</h2>
      <nav>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
        <a routerLink="/courses" routerLinkActive="active">Courses</a>
        <a routerLink="/profile" routerLinkActive="active">Profile</a>
        <a routerLink="/enroll" routerLinkActive="active">Enroll</a>
        <a routerLink="/enroll/reactive" routerLinkActive="active">Enroll (Reactive)</a>
      </nav>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .global-spinner {
      position: fixed;
      top: 0; left: 0; right: 0;
      background: #ffca28;
      color: #333;
      text-align: center;
      font-size: 12px;
      padding: 4px;
      z-index: 999;
    }
    .topbar {
      background: #1a237e;
      color: #fff;
      padding: 14px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .topbar h2 { margin: 0; font-size: 16px; }
    nav a {
      color: #c5cae9;
      text-decoration: none;
      margin-left: 14px;
      font-size: 13px;
    }
    nav a.active { color: #fff; font-weight: 700; }
    main { padding: 20px; max-width: 900px; margin: 0 auto; }
  `]
})
export class AppComponent {
  constructor(public loadingService: LoadingService) {}
}
