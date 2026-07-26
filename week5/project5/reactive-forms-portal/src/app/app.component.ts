import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header style="background:#4a148c;color:#fff;padding:14px 24px;">
      <h2 style="margin:0;">Hands-On 5 — Reactive Forms Portal</h2>
    </header>
    <main style="padding:20px;">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}
