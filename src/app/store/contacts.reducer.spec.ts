import { Contact } from '../core/models/contact.model';
import { contactsReducer, initialContactsState } from './contacts.reducer';
import { loadContacts, loadContactsSuccess } from './contacts.actions';

describe('contacts reducer', () => {
  it('should set loading state while fetching contacts', () => {
    const state = contactsReducer(initialContactsState, loadContacts({ searchTerm: 'alice' }));

    expect(state.loading).toBeTrue();
    expect(state.searchTerm).toBe('alice');
    expect(state.error).toBeNull();
  });

  it('should store the loaded contacts', () => {
    const contacts: Contact[] = [{
      id: '1',
      firstName: 'Alice',
      lastName: 'Smith',
      avatar: 'avatar.jpg',
      address: '123 Lane',
      company: 'TechCorp',
      jobTitle: 'Developer',
      phoneNumber: '555-1234',
      email: 'alice@techcorp.com',
      status: 'Active'
    }];

    const state = contactsReducer(
      initialContactsState,
      loadContactsSuccess({ contacts })
    );

    expect(state.contacts).toEqual(contacts);
    expect(state.loading).toBeFalse();
    expect(state.error).toBeNull();
  });
});
