import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactListComponent } from './contact-list.component';
import { ContactService } from '../../../core/services/contact.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Contact } from '../../../core/models/contact.model';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

describe('ContactListComponent', () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;
  let mockContactService: jasmine.SpyObj<ContactService>;
  let router: Router;

  const mockContacts: Contact[] = [
    {
      id: '1',
      firstName: 'Alice',
      lastName: 'Smith',
      avatar: 'avatar.jpg',
      address: '123 Lane',
      company: 'TechCorp',
      jobTitle: 'Developer',
      phoneNumber: '555-1234',
      status: 'Active'
    }
  ];

  beforeEach(async () => {
    mockContactService = jasmine.createSpyObj('ContactService', ['getContacts']);
    mockContactService.getContacts.and.returnValue(of(mockContacts));

    await TestBed.configureTestingModule({
      imports: [ContactListComponent, RouterTestingModule],
      providers: [
        { provide: ContactService, useValue: mockContactService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display contacts on init', () => {
    expect(mockContactService.getContacts).toHaveBeenCalled();
    expect(component.contacts.length).toBe(1);
    expect(component.loading).toBeFalse();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(1);
    
    const nameCell = rows[0].query(By.css('.name')).nativeElement;
    expect(nameCell.textContent).toContain('Alice Smith');
  });

  it('should navigate to details when a row is clicked', () => {
    const row = fixture.debugElement.query(By.css('tbody tr'));
    row.triggerEventHandler('click', null);
    
    expect(router.navigate).toHaveBeenCalledWith(['/contacts', '1']);
  });
});
