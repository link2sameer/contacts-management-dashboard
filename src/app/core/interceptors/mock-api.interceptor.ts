import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, delay, of } from 'rxjs';
import { Contact, EmailAddress } from '../models/contact.model';

const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    firstName: 'Bob',
    lastName: 'Johnson',
    avatar: 'https://i.pravatar.cc/150?u=bob',
    address: '456 Innovation Blvd, Austin, TX',
    company: 'StartupInc',
    jobTitle: 'Product Manager',
    phoneNumber: '+1-555-0200',
    status: 'Active'
  },
  {
    id: '2',
    firstName: 'Alice',
    lastName: 'Smith',
    avatar: 'https://i.pravatar.cc/150?u=alice',
    address: '123 Tech Lane, San Francisco, CA',
    company: 'TechCorp',
    jobTitle: 'Software Engineer',
    phoneNumber: '+1-555-0100',
    status: 'Active'
  },
  {
    id: '3',
    firstName: 'Carol',
    lastName: 'Williams',
    avatar: 'https://i.pravatar.cc/150?u=carol',
    address: '789 Design Way, New York, NY',
    company: 'CreativeStudio',
    jobTitle: 'UX Designer',
    phoneNumber: '+1-555-0300',
    status: 'Inactive'
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Brown',
    avatar: 'https://i.pravatar.cc/150?u=david',
    address: '321 Enterprise Rd, Seattle, WA',
    company: 'Enterprise Solutions',
    jobTitle: 'Sales Director',
    phoneNumber: '+1-555-0400',
    status: 'Active'
  },
  {
    id: '5',
    firstName: 'Eve',
    lastName: 'Davis',
    avatar: 'https://i.pravatar.cc/150?u=eve',
    address: '654 Finance St, Chicago, IL',
    company: 'Global Bank',
    jobTitle: 'Financial Analyst',
    phoneNumber: '+1-555-0500',
    status: 'Active'
  }
];

const MOCK_EMAILS: Record<string, EmailAddress[]> = {
  '1': [
    { id: 'e1', email: 'alice.smith@techcorp.com', type: 'Work' },
    { id: 'e2', email: 'alice.smith@personal.com', type: 'Personal' }
  ],
  '2': [
    { id: 'e3', email: 'bob.j@startupinc.com', type: 'Work' }
  ],
  '3': [
    { id: 'e4', email: 'carol.w@creativestudio.com', type: 'Work' },
    { id: 'e5', email: 'carol.design@gmail.com', type: 'Personal' }
  ],
  '4': [
    { id: 'e6', email: 'david.b@enterprise.com', type: 'Work' }
  ],
  '5': [
    { id: 'e7', email: 'eve.d@globalbank.com', type: 'Work' }
  ]
};

export const mockApiInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const url = req.url;

  // Intercept GET /contacts
  if (req.method === 'GET' && url === 'https://mockapi.io/api/v1/contacts') {
    return of(new HttpResponse({ status: 200, body: MOCK_CONTACTS })).pipe(delay(500));
  }

  // Intercept GET /contacts/{id}/email_addresses
  const emailMatch = url.match(/https:\/\/mockapi\.io\/api\/v1\/contacts\/([^/]+)\/email_addresses/);
  if (req.method === 'GET' && emailMatch) {
    const contactId = emailMatch[1];
    const emails = MOCK_EMAILS[contactId] || [];
    return of(new HttpResponse({ status: 200, body: emails })).pipe(delay(500));
  }

  // Intercept GET /contacts/{id}
  const contactMatch = url.match(/https:\/\/mockapi\.io\/api\/v1\/contacts\/([^/]+)$/);
  if (req.method === 'GET' && contactMatch && !url.includes('email_addresses')) {
    const contactId = contactMatch[1];
    const contact = MOCK_CONTACTS.find(c => c.id === contactId);
    if (contact) {
      return of(new HttpResponse({ status: 200, body: contact })).pipe(delay(500));
    } else {
      return of(new HttpResponse({ status: 404, body: null })).pipe(delay(500));
    }
  }

  // Pass through if no match
  return next(req);
};
