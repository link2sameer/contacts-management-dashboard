import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactListComponent } from './contact-list.component';
import { ContactService } from '../../../core/services/contact.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Contact } from '../../../core/models/contact.model';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

describe('ContactListComponent', () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;
  let mockContactService: jasmine.SpyObj<ContactService>;
  let router: Router;
  let store: MockStore;

  const mockContacts: Contact[] = [
    {
      id: '1',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice.smith@techcorp.com',
      avatar: 'avatar.jpg',
      address: '123 Lane',
      company: 'TechCorp',
      jobTitle: 'Developer',
      phoneNumber: '555-1234',
      status: 'Active'
    }
  ];

  beforeEach(async () => {
    mockContactService = jasmine.createSpyObj('ContactService', ['getContacts', 'deleteContact', 'updateContact']);
    mockContactService.getContacts.and.returnValue(of(mockContacts));
    mockContactService.deleteContact.and.returnValue(of({}));
    mockContactService.updateContact.and.returnValue(of(mockContacts[0]));

    await TestBed.configureTestingModule({
      imports: [ContactListComponent, RouterTestingModule],
      providers: [
        provideMockStore({
          initialState: {
            contacts: {
              contacts: mockContacts,
              loading: false,
              error: null,
              searchTerm: ''
            }
          }
        })
      ]
    });

    TestBed.overrideComponent(ContactListComponent, {
      set: { providers: [{ provide: ContactService, useValue: mockContactService }] }
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request contacts and dispatch the result', () => {
    spyOn(store, 'dispatch');

    component.getContacts();

    expect(mockContactService.getContacts).toHaveBeenCalledWith('');
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should fetch and display contacts from store state', () => {
    expect(component.contacts.length).toBe(1);
    expect(component.loading).toBeFalse();

    const rows = fixture.debugElement.queryAll(By.css('.contact-row'));
    expect(rows.length).toBe(1);

    const nameCell = rows[0].query(By.css('.name')).nativeElement;
    expect(nameCell.textContent).toContain('Alice Smith');
  });

  it('should navigate to details when a row is clicked', () => {
    const row = fixture.debugElement.query(By.css('.contact-row'));
    row.triggerEventHandler('click', null);

    expect(router.navigate).toHaveBeenCalledWith(['/contacts', '1']);
  });

  it('should toggle options menu for a contact', () => {
    const event = new MouseEvent('click');
    spyOn(event, 'stopPropagation');

    component.toggleMenu('1', event);
    expect(component.activeMenuContactId).toBe('1');
    expect(event.stopPropagation).toHaveBeenCalled();

    component.toggleMenu('1', event);
    expect(component.activeMenuContactId).toBeNull();
  });

  it('should open Add Contact modal', () => {
    component.openAddContact();
    expect(component.isAddEditModalOpen).toBeTrue();
    expect(component.selectedContactForEdit).toBeNull();
  });

  it('should open and close update modal', () => {
    const event = new MouseEvent('click');
    spyOn(event, 'stopPropagation');

    component.openUpdateModal(mockContacts[0], event);
    expect(component.isAddEditModalOpen).toBeTrue();
    expect(component.selectedContactForEdit).toEqual(mockContacts[0]);

    component.closeAddEditModal();
    expect(component.isAddEditModalOpen).toBeFalse();
    expect(component.selectedContactForEdit).toBeNull();
  });

  it('should refresh contacts when contact is saved', () => {
    spyOn(component, 'getContacts');
    component.isAddEditModalOpen = true;

    component.onContactSaved(mockContacts[0]);

    expect(component.isAddEditModalOpen).toBeFalse();
    expect(component.getContacts).toHaveBeenCalled();
  });

  it('should delete contact on confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const event = new MouseEvent('click');

    component.deleteContact(mockContacts[0], event);
    expect(mockContactService.deleteContact).toHaveBeenCalledWith('1');
  });
});
