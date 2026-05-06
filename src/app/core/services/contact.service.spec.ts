import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
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
      avatar: '',
      address: '123 Lane',
      company: 'Tech',
      jobTitle: 'Dev',
      phoneNumber: '1234',
      status: 'Active'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactService]
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

    const req = httpMock.expectOne('https://mockapi.io/api/v1/contacts');
    expect(req.request.method).toBe('GET');
    req.flush(mockContacts);
  });

  it('should fetch a single contact by id', () => {
    service.getContact('1').subscribe(contact => {
      expect(contact).toEqual(mockContacts[0]);
    });

    const req = httpMock.expectOne('https://mockapi.io/api/v1/contacts/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockContacts[0]);
  });

  it('should fetch contact emails', () => {
    const mockEmails: EmailAddress[] = [{ id: 'e1', email: 'test@test.com' }];
    
    service.getContactEmails('1').subscribe(emails => {
      expect(emails.length).toBe(1);
      expect(emails).toEqual(mockEmails);
    });

    const req = httpMock.expectOne('https://mockapi.io/api/v1/contacts/1/email_addresses');
    expect(req.request.method).toBe('GET');
    req.flush(mockEmails);
  });
});
