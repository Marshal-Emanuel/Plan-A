import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventsService } from '../../Services/events.service';
import { NavbarComponent } from '../navbar/navbar.component';

interface UpcomingEvent {
  eventId: string;
  eventName: string;
  eventImg: string;
  description: string;
  location: string;
  date: string;
  time: string;
  attendees: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-user-event',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './user-event.component.html',
  styleUrls: ['./user-event.component.css']
})
export class UserEventComponent implements OnInit {
  eventId: string;
  eventImage: string;
  eventHeading: string;
  eventDescription: string;
  eventPrice: string;
  attendees: string;
  eventLocation: string;
  eventDate: string;
  hostImage: string = '/assets/images/profile.png';
  hostName: string;
  hostEmail: string;
  hostProfession: string = 'Organizer';
  upcomingEvents: UpcomingEvent[] = [];

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService
  ) {
    this.eventImage = '';
    this.eventHeading = '';
    this.eventDescription = '';
    this.eventPrice = '';
    this.attendees = '';
    this.eventLocation = '';
    this.eventDate = '';
    this.hostName = '';
    this.hostEmail = '';
    this.eventId = '';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const eventId = params.get('id');
      if (eventId) {
        this.fetchEvent(eventId);
        this.fetchUpcomingEvents();
      }
    });
  }

  fetchEvent(eventId: string): void {
    this.eventsService.getEventById(eventId).subscribe({
      next: (response) => {
        const event = response.data;
        console.log('Event data:', event);
        this.eventId = event.eventId;
        this.eventImage = event.image;
        this.eventHeading = event.name;
        this.eventDescription = event.description;
        this.eventPrice = event.regularPrice.toString();
        this.attendees = `${event.numberOfTickets - event.remainingTickets} are going`;
        this.eventLocation = event.location;
        this.eventDate = new Date(event.date).toDateString();
        this.hostName = event.manager.name;
        this.hostEmail = event.manager.email;
      },
      error: (error) => console.error('Error fetching event:', error)
    });
  }

  fetchUpcomingEvents(): void {
    this.eventsService.getActiveEvents().subscribe({
      next: (response) => {
        this.upcomingEvents = response.data.map((event: { name: any; image: any; description: any; location: any; date: string | number | Date; time: string | number | Date; numberOfTickets: number; remainingTickets: number; manager: { phoneNumber: any; }; }) => ({
          eventName: event.name,
          eventImg: event.image,
          description: event.description,
          location: event.location,
          date: new Date(event.date).toDateString(),
          time: new Date(event.time).toLocaleTimeString(),
          attendees: `${event.numberOfTickets - event.remainingTickets} are going`,
          phoneNumber: event.manager.phoneNumber
        }));
        console.log('Upcoming events:', this.upcomingEvents);
      },
      error: (error) => console.error('Error fetching upcoming events:', error)
    });
  }
}
