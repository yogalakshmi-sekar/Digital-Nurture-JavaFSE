import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Task 68: wildcard { path: '**' } route target. Must always be registered
// LAST in the routes array — Angular matches top to bottom and stops at the
// first match, so a wildcard placed earlier would swallow every route
// after it, including legitimate ones.
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <h2>404</h2>
      <p>That page doesn't exist.</p>
      <a routerLink="/">Go home</a>
    </div>
  `,
  styles: [`
    .not-found { text-align: center; padding: 60px 0; }
    .not-found h2 { font-size: 48px; margin: 0; color: #1a237e; }
  `]
})
export class NotFoundComponent {}
