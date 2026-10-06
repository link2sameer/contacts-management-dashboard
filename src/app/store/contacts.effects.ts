import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { ContactService } from '../core/services/contact.service';
import { loadContacts, loadContactsFailure, loadContactsSuccess } from './contacts.actions';

@Injectable()
export class ContactsEffects {
  private actions$ = inject(Actions);
  private contactService = inject(ContactService);

  loadContacts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadContacts),
      switchMap(({ searchTerm }) =>
        this.contactService.getContacts(searchTerm).pipe(
          map((contacts) => loadContactsSuccess({ contacts })),
          catchError(() => of(loadContactsFailure({ error: 'Failed to load contacts.' })))
        )
      )
    )
  );
}
