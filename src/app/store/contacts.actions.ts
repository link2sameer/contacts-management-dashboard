import { createAction, props } from '@ngrx/store';
import { Contact } from '../core/models/contact.model';

export const loadContacts = createAction(
  '[Contacts] Load Contacts',
  props<{ searchTerm: string }>()
);

export const loadContactsSuccess = createAction(
  '[Contacts] Load Contacts Success',
  props<{ contacts: Contact[] }>()
);

export const loadContactsFailure = createAction(
  '[Contacts] Load Contacts Failure',
  props<{ error: string }>()
);
