import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminEventsComponent } from './admin-events.component';
import { EventsService } from '../../Services/events.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SuccessMessageComponent } from '../success-message/success-message.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { Event as CustomEvent, Manager } from './admin-events.component'; // Adjust the path as needed

// Define a partial CustomEvent type for testing
type PartialCustomEvent = Partial<CustomEvent>;

describe('AdminEventsComponent', () => {
  let component: AdminEventsComponent;
  let fixture: ComponentFixture<AdminEventsComponent>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('EventsService', ['getAllEvents']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AdminEventsComponent,
        SuccessMessageComponent,
        ErrorMessageComponent
      ],
      providers: [
        { provide: EventsService, useValue: spy }
      ]
    }).compileComponents();

    eventsServiceSpy = TestBed.inject(EventsService) as jasmine.SpyObj<EventsService>;
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEventsComponent);
    component = fixture.componentInstance;
    localStorage.setItem('token', 'fake-token');
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch events on init', () => {
    const mockEvents: { data: PartialCustomEvent[] } = {
      data: [{
        eventId: '1',
        name: 'Test Event',
        managerId: '1',
        description: 'Test description',
        moreInfo: 'More info',
        location: 'Test location',
        date: '2023-07-01',
        time: '14:00',
        numberOfTickets: 100,
        remainingTickets: 50,
        createdAt: '2023-06-01',
        updatedAt: '2023-06-01',
        image: 'test.jpg',
        hasRegular: true,
        regularPrice: 50,
        hasVIP: false,
        vipPrice: 0,
        hasChildren: false,
        childrenPrice: 0,
        isPromoted: false,
        promoDetails: null,
        status: 'active',
        nature: 'public',
        discount: 0,
        manager: {} as Manager
      }]
    };
    eventsServiceSpy.getAllEvents.and.returnValue(of(mockEvents));

    fixture.detectChanges();

    expect(eventsServiceSpy.getAllEvents).toHaveBeenCalled();
    expect(component.events).toEqual(mockEvents.data as CustomEvent[]);
  });

  it('should calculate ticket sales rate correctly', () => {
    const event: PartialCustomEvent = {
      numberOfTickets: 100,
      remainingTickets: 60
    };

    const rate = component.calculateTicketSalesRate(event as CustomEvent);
    expect(rate).toBe(40);
  });

  it('should calculate total earnings correctly', () => {
    const event: PartialCustomEvent = {
      numberOfTickets: 100,
      remainingTickets: 60,
      regularPrice: 50
    };

    const earnings = component.calculateTotalEarnings(event as CustomEvent);
    expect(earnings).toBe(2000);
  });

  // ... rest of the test cases remain the same
});