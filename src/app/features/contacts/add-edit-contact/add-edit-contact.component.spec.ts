import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditContactComponent } from './add-edit-contact.component';
import { ContactService } from '../../../core/services/contact.service';
import { of } from 'rxjs';
import { Contact } from '../../../core/models/contact.model';

describe('AddEditContactComponent', () => {
  let component: AddEditContactComponent;
  let fixture: ComponentFixture<AddEditContactComponent>;
  let mockContactService: jasmine.SpyObj<ContactService>;

  const mockContact: Contact = {
    id: '1',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@techcorp.com',
    avatar: 'https://i.pravatar.cc/150?u=alice',
    address: '123 Tech Lane',
    company: 'TechCorp',
    jobTitle: 'Software Engineer',
    phoneNumber: '+1-555-0100',
    status: 'Active'
  };

  beforeEach(async () => {
    mockContactService = jasmine.createSpyObj('ContactService', ['getContact', 'createContact', 'updateContact']);
    mockContactService.getContact.and.returnValue(of(mockContact));
    mockContactService.createContact.and.returnValue(of(mockContact));
    mockContactService.updateContact.and.returnValue(of(mockContact));

    await TestBed.configureTestingModule({
      imports: [AddEditContactComponent],
      providers: [
        { provide: ContactService, useValue: mockContactService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form in Add mode', () => {
    component.isOpen = true;
    component.contact = null;
    component.ngOnChanges({
      isOpen: {
        currentValue: true,
        previousValue: false,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.isEditMode).toBeFalse();
    expect(component.modalTitle).toBe('Add New Contact');
    expect(component.contactForm.get('firstName')?.value).toBe('');
  });

  it('should fetch contact by ID and populate form in Edit mode', () => {
    component.isOpen = true;
    component.contact = mockContact;
    component.ngOnChanges({
      isOpen: {
        currentValue: true,
        previousValue: false,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(mockContactService.getContact).toHaveBeenCalledWith('1');
    expect(component.isEditMode).toBeTrue();
    expect(component.modalTitle).toBe('Update Contact');
    expect(component.contactForm.get('firstName')?.value).toBe('Alice');
    expect(component.contactForm.get('email')?.value).toBe('alice.smith@techcorp.com');
  });

  it('should emit saved event on successful create', () => {
    spyOn(component.saved, 'emit');
    spyOn(component.closed, 'emit');

    component.isOpen = true;
    component.contact = null;
    component.contactForm.patchValue({
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob.jones@test.com',
      status: 'Active'
    });

    component.onSubmit();

    expect(mockContactService.createContact).toHaveBeenCalled();
    expect(component.saved.emit).toHaveBeenCalled();
    expect(component.closed.emit).toHaveBeenCalled();
  });

  it('should emit saved event on successful update', () => {
    spyOn(component.saved, 'emit');
    spyOn(component.closed, 'emit');

    component.isOpen = true;
    component.contact = mockContact;
    component.contactForm.patchValue({
      firstName: 'Alice Updated',
      lastName: 'Smith',
      email: 'alice.smith@techcorp.com',
      status: 'Active'
    });

    component.onSubmit();

    expect(mockContactService.updateContact).toHaveBeenCalledWith('1', jasmine.objectContaining({
      firstName: 'Alice Updated'
    }));
    expect(component.saved.emit).toHaveBeenCalled();
    expect(component.closed.emit).toHaveBeenCalled();
  });
});
