import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ManagerEventsComponent } from './manager-events.component';
import { EventsService } from '../../Services/events.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ManagerEventsComponent', () => {
  let component: ManagerEventsComponent;
  let fixture: ComponentFixture<ManagerEventsComponent>;
  let eventsService: EventsService;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ManagerEventsComponent
      ],
      providers: [
        EventsService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerEventsComponent);
    component = fixture.componentInstance;
    eventsService = TestBed.inject(EventsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load events on init', waitForAsync(() => {
    const mockEvents = [
      {
        name: 'Event 1',
        date: '2024-08-01',
        time: '10:00 AM',
        location: 'Location 1',
        numberOfTickets: 100,
        remainingTickets: 50,
        nature: 'Nature 1',
        image: 'image1.jpg',
        childrenPrice: 10,
        createdAt: '2024-07-01T00:00:00Z',
        description: 'Description 1',
        discount: 0,
        eventId: '1',
        hasChildren: true,
        hasRegular: true,
        hasVIP: true,
        isPromoted: false,
        promoDetails: null,
        regularPrice: 20,
        status: 'active',
        updatedAt: '2024-07-10T00:00:00Z',
        vipPrice: 30
      },
      {
        name: 'Event 2',
        date: '2024-09-01',
        time: '12:00 PM',
        location: 'Location 2',
        numberOfTickets: 200,
        remainingTickets: 150,
        nature: 'Nature 2',
        image: 'image2.jpg',
        childrenPrice: 15,
        createdAt: '2024-07-02T00:00:00Z',
        description: 'Description 2',
        discount: 0,
        eventId: '2',
        hasChildren: true,
        hasRegular: true,
        hasVIP: true,
        isPromoted: false,
        promoDetails: null,
        regularPrice: 25,
        status: 'active',
        updatedAt: '2024-07-11T00:00:00Z',
        vipPrice: 35
      }
    ];

    spyOn(eventsService, 'getEventsByManagerId').and.returnValue(of({ data: mockEvents }));
    component.ngOnInit();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.events.length).toBe(2);
      expect(component.events).toEqual(mockEvents);
    });
  }));

 

  it('should emit eventSelect on event click', () => {
    spyOn(component.eventSelect, 'emit');

    const eventId = '1';
    component.onEventClick(eventId);

    expect(component.eventSelect.emit).toHaveBeenCalledWith(eventId);
    expect(component.eventSelect.emit).toHaveBeenCalledTimes(1);
  });


});
