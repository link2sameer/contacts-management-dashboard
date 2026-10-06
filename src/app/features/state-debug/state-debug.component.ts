import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import {
  decrementDebugCounter,
  incrementDebugCounter,
  resetDebugCounter
} from '../../store/state-debug.actions';
import { selectDebugCounter } from '../../store/state-debug.selectors';

@Component({
  selector: 'app-state-debug',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './state-debug.component.html',
  styleUrl: './state-debug.component.scss'
})
export class StateDebugComponent {
  // Store: dispatch sends actions into NgRx; select exposes state as an observable.
  private readonly store = inject(Store<AppState>);
  readonly counter$ = this.store.select(selectDebugCounter);

  increment(): void {
    this.store.dispatch(incrementDebugCounter());
  }

  decrement(): void {
    this.store.dispatch(decrementDebugCounter());
  }

  reset(): void {
    this.store.dispatch(resetDebugCounter());
  }
}