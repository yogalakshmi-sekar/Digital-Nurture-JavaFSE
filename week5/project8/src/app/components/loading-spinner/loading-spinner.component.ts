import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

// Step 91: global spinner bound to LoadingService.isLoading$ via the async pipe.
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner" *ngIf="loadingService.isLoading$ | async"></div>
  `
})
export class LoadingSpinnerComponent {
  constructor(public loadingService: LoadingService) {}
}
