import { CanDeactivateFn } from '@angular/router';

// A component that wants to be protected by this guard must implement
// this tiny contract — decoupling the guard from any one specific component.
export interface CanComponentDeactivate {
  hasUnsavedChanges(): boolean;
}

// Task 77: functional CanDeactivate guard. Angular calls this with the
// component instance that's about to be navigated away from. If it reports
// unsaved changes, we ask the user to confirm before allowing navigation —
// this is what stops someone from losing a half-filled enrollment form by
// accidentally clicking a nav link.
export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  if (component.hasUnsavedChanges()) {
    return window.confirm('You have unsaved changes. Leave?');
  }
  return true;
};
