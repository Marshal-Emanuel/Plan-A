import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { RouterLink } from '@angular/router';
import { EventsService } from '../../Services/events.service';
import { NavbarComponent } from '../navbar/navbar.component';

interface UpcomingEvent {
  eventId: string
  name: string;
  image: string;
  description: string;
  location: string;
  date: string;
  time: string;
  attendees: number;
  phoneNumber: string;
  numberOfTickets: number;
  remainingTickets: number;
  manager: {
    name: string;
    phoneNumber: string;
    email: string;
  };

}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, MatSliderModule, FormsModule, RouterLink, DatePipe, NavbarComponent],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  upcomingEvents: UpcomingEvent[] = [];

  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    this.fetchActiveEvents();
  }

  fetchActiveEvents(): void {
    this.eventsService.getActiveEvents().subscribe({
      next: (response) => {
        // Assuming the response is an object with a `data` property containing the array of events
        this.upcomingEvents = response.data;
        console.log("Upcoming events:", this.upcomingEvents);
        
      },
      error: (error) => console.error('Error fetching events:', error)
    });
  }
}
