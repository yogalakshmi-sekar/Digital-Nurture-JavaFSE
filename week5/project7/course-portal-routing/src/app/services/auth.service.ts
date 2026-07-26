import { Injectable } from '@angular/core';

// Task 75: hardcoded auth state for now — in a real app this would track
// a login token, call a backend, etc. The important part for this exercise
// is that AuthGuard depends on THIS service to decide whether to allow
// navigation, not on hardcoding the check inside the guard itself.
@Injectable({ providedIn: 'root' })
export class AuthService {
  isLoggedIn = true; // flip to false to see the guard redirect in action
}
