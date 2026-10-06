import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactDetailsComponent } from './contact-details.component';
import { ContactService } from '../../../core/services/contact.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Contact, EmailAddress } from '../../../core/models/contact.model';
import { Location } from '@angular/common';

describe('ContactDetailsComponent', () => {
  let component: ContactDetailsComponent;
  let fixture: ComponentFixture<ContactDetailsComponent>;
  let mockContactService: jasmine.SpyObj<ContactService>;
  let mockLocation: jasmine.SpyObj<Location>;

  const mockContact: Contact = {
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
  };

  beforeEach(async () => {
    mockContactService = jasmine.createSpyObj('ContactService', ['getContact']);
    mockContactService.getContact.and.returnValue(of(mockContact));
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [ContactDetailsComponent, RouterTestingModule],
      providers: [
        { provide: Location, useValue: mockLocation },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => '1' })
          }
        }
      ]
    });

    TestBed.overrideComponent(ContactDetailsComponent, {
      set: { providers: [{ provide: ContactService, useValue: mockContactService }] }
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(ContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch contact on init', () => {
    expect(mockContactService.getContact).toHaveBeenCalledWith('1');
    expect(component.contact).toEqual(mockContact);
    expect(component.loading).toBeFalse();
  });

  it('should go back when goBack is called', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });
});
