import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <h2>Hands-On 6 — Services &amp; Dependency Injection</h2>
      <nav>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
        <a routerLink="/courses" routerLinkActive="active">Courses</a>
        <a routerLink="/profile" routerLinkActive="active">Profile</a>
      </nav>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .topbar {
      background: #1a237e;
      color: #fff;
      padding: 14px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
    }
    .topbar h2 { margin: 0; font-size: 18px; }
    nav a {
      color: #c5cae9;
      text-decoration: none;
      margin-left: 16px;
      font-size: 14px;
    }
    nav a.active { color: #fff; font-weight: 700; }
    main { padding: 20px; max-width: 900px; margin: 0 auto; }
  `]
})
export class AppComponent {}
