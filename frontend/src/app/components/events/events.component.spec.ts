import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EventsComponent } from './events.component';
import { EventsService } from '../../Services/events.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let mockEventsService: jasmine.SpyObj<EventsService>;

  beforeEach(async () => {
    mockEventsService = jasmine.createSpyObj('EventsService', ['getActiveEvents']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatSliderModule,
        FormsModule,
        RouterLink,
        NavbarComponent
      ],
      declarations: [EventsComponent],
      providers: [
        provideHttpClientTesting(),
        { provide: EventsService, useValue: mockEventsService },
        DatePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch active events on init', () => {
    const mockEvents = {
      data: [
        {
          eventId: '1',
          name: 'Event 1',
          image: 'image1.jpg',
          description: 'Description 1',
          location: 'Location 1',
          date: '2023-01-01',
          time: '10:00 AM',
          attendees: 100,
          phoneNumber: '1234567890',
          numberOfTickets: 200,
          remainingTickets: 100,
          manager: {
            name: 'Manager 1',
            phoneNumber: '0987654321',
            email: 'manager1@example.com'
          }
        }
      ]
    };

    mockEventsService.getActiveEvents.and.returnValue(of(mockEvents));

    component.ngOnInit();

    expect(mockEventsService.getActiveEvents).toHaveBeenCalled();
    expect(component.upcomingEvents).toEqual(mockEvents.data);
  });
}); 