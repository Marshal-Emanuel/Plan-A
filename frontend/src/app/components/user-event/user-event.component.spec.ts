import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { UserEventComponent } from './user-event.component';
import { EventsService } from '../../Services/events.service';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';

@Component({selector: 'app-navbar', template: ''})
class NavbarStubComponent {}

describe('UserEventComponent', () => {
  let component: UserEventComponent;
  let fixture: ComponentFixture<UserEventComponent>;
  let eventsService: jasmine.SpyObj<EventsService>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    const eventsServiceSpy = jasmine.createSpyObj('EventsService', ['getEventById', 'getActiveEvents']);
    const activatedRouteSpy = { paramMap: of({ get: (key: string) => 'mockEventId' }) };

    await TestBed.configureTestingModule({
      imports: [UserEventComponent, RouterTestingModule],
      declarations: [NavbarStubComponent],
      providers: [
        { provide: EventsService, useValue: eventsServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserEventComponent);
    component = fixture.componentInstance;
    eventsService = TestBed.inject(EventsService) as jasmine.SpyObj<EventsService>;
    route = TestBed.inject(ActivatedRoute);

    // Mock data for the tests
    const eventData = {
      eventId: 'mockEventId',
      image: 'mockImage.jpg',
      name: 'Mock Event',
      description: 'Mock event description',
      regularPrice: 50,
      numberOfTickets: 100,
      remainingTickets: 50,
      location: 'Mock Location',
      date: new Date().toISOString(),
      manager: {
        name: 'Mock Host',
        email: 'host@example.com',
        phoneNumber: '1234567890'
      }
    };

    const upcomingEventsData = [{
      name: 'Upcoming Event 1',
      image: 'event1.jpg',
      description: 'Description 1',
      location: 'Location 1',
      date: new Date().toISOString(),
      time: new Date().toISOString(),
      numberOfTickets: 50,
      remainingTickets: 25,
      manager: {
        phoneNumber: '0987654321'
      }
    }];

    eventsService.getEventById.and.returnValue(of({ data: eventData }));
    eventsService.getActiveEvents.and.returnValue(of({ data: upcomingEventsData }));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch event details on initialization', () => {
    fixture.detectChanges();
    expect(component.eventId).toBe('mockEventId');
    expect(component.eventImage).toBe('mockImage.jpg');
    expect(component.eventHeading).toBe('Mock Event');
    expect(component.eventDescription).toBe('Mock event description');
    expect(component.eventPrice).toBe('50');
    expect(component.attendees).toBe('50 are going');
    expect(component.eventLocation).toBe('Mock Location');
    expect(component.eventDate).toBe(new Date().toDateString());
    expect(component.hostName).toBe('Mock Host');
    expect(component.hostEmail).toBe('host@example.com');
  });

  it('should fetch upcoming events and populate the list', () => {
    fixture.detectChanges();
    expect(component.upcomingEvents.length).toBe(1);
    expect(component.upcomingEvents[0].eventName).toBe('Upcoming Event 1');
    expect(component.upcomingEvents[0].eventImg).toBe('event1.jpg');
    expect(component.upcomingEvents[0].description).toBe('Description 1');
    expect(component.upcomingEvents[0].location).toBe('Location 1');
    expect(component.upcomingEvents[0].attendees).toBe('25 are going');
    expect(component.upcomingEvents[0].phoneNumber).toBe('0987654321');
  });

  it('should handle error when fetching event details', () => {
    eventsService.getEventById.and.returnValue(throwError(() => new Error('Error fetching event')));
    fixture.detectChanges();
    // Assertions based on error handling can be added here if any UI change happens on error
  });

  it('should handle error when fetching upcoming events', () => {
    eventsService.getActiveEvents.and.returnValue(throwError(() => new Error('Error fetching events')));
    fixture.detectChanges();
    // Assertions based on error handling can be added here if any UI change happens on error
  });
});
