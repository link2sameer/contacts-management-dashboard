import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ContactService } from './contact.service';
import { Contact, EmailAddress } from '../models/contact.model';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;

  const mockContacts: Contact[] = [
    {
      id: '1',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice.smith@techcorp.com',
      avatar: 'https://i.pravatar.cc/150?u=alice',
      address: '123 Tech Lane, San Francisco, CA',
      company: 'TechCorp',
      jobTitle: 'Software Engineer',
      phoneNumber: '+1-555-0100',
      status: 'Active'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContactService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch contacts', () => {
    service.getContacts().subscribe(contacts => {
      expect(contacts.length).toBe(1);
      expect(contacts).toEqual(mockContacts);
    });

    const req = httpMock.expectOne('http://localhost:3000/contacts');
    expect(req.request.method).toBe('GET');
    req.flush(mockContacts);
  });

  it('should fetch contacts with search parameter', () => {
    service.getContacts('Alice').subscribe(contacts => {
      expect(contacts.length).toBe(1);
      expect(contacts).toEqual(mockContacts);
    });

    const req = httpMock.expectOne(
      request => request.url === 'http://localhost:3000/contacts' && request.params.get('search') === 'Alice'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockContacts);
  });

  it('should fetch a single contact by id', () => {
    service.getContact('1').subscribe(contact => {
      expect(contact).toEqual(mockContacts[0]);
    });

    const req = httpMock.expectOne('http://localhost:3000/contacts/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockContacts[0]);
  });

  it('should delete a contact by id', () => {
    service.deleteContact('1').subscribe();

    const req = httpMock.expectOne('http://localhost:3000/contacts/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should create a new contact', () => {
    const newContact: Partial<Contact> = {
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob@test.com'
    };
    const createdContact: Contact = {
      id: '2',
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob@test.com',
      avatar: '',
      address: '',
      company: '',
      jobTitle: '',
      phoneNumber: '',
      status: 'Active'
    };

    service.createContact(newContact).subscribe(res => {
      expect(res).toEqual(createdContact);
    });

    const req = httpMock.expectOne('http://localhost:3000/contacts');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newContact);
    req.flush(createdContact);
  });

  it('should update a contact by id', () => {
    const updatedData = { ...mockContacts[0], firstName: 'Alicia' };
    service.updateContact('1', updatedData).subscribe(res => {
      expect(res).toEqual(updatedData);
    });

    const req = httpMock.expectOne('http://localhost:3000/contacts/1');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedData);
  });

  it('should fetch contact emails', () => {
    const mockEmails: EmailAddress[] = [{ id: 'e1', email: 'test@test.com' }];
    
    service.getContactEmails('1').subscribe(emails => {
      expect(emails.length).toBe(1);
      expect(emails).toEqual(mockEmails);
    });

    const req = httpMock.expectOne('http://localhost:3000/contacts/1/email_addresses');
    expect(req.request.method).toBe('GET');
    req.flush(mockEmails);
  });
});
