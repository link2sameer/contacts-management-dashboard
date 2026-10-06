import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './store';
import { selectDebugCounter } from './store/state-debug.selectors';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ContactManagement');
  readonly debugCounter$ = inject(Store<AppState>).select(selectDebugCounter);
}
