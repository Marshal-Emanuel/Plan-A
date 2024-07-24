import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { EventsService } from '../../Services/events.service';

interface Event {
  name: string;
  date: string;
  time: string;
  location: string;
  numberOfTickets: number;
  remainingTickets: number;
  nature: string;
  image: string;
  childrenPrice: number;
  createdAt: string;
  description: string;
  discount: number;
  eventId: string;
  hasChildren: boolean;
  hasRegular: boolean;
  hasVIP: boolean;
  isPromoted: boolean;
  promoDetails: string | null;
  regularPrice: number;
  status: string;
  updatedAt: string;
  vipPrice: number;
}

@Component({
  selector: 'app-manager-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-events.component.html',
  styleUrls: ['./manager-events.component.css']
})
export class ManagerEventsComponent implements OnInit {
  @Output() eventSelect = new EventEmitter<string>();

  managerId: string;
  events: Event[] = [];

  constructor(private eventService: EventsService) { 
    const userId = localStorage.getItem('userId');
    const cleanedUserId = userId ? userId.replace(/"/g, '') : '';
    this.managerId = cleanedUserId;
  }

  ngOnInit() {
    this.eventService.getEventsByManagerId(this.managerId).subscribe({
      next: (response) => {
        console.log('Manager events response', response);
        this.events = response.data;
      },
      error: (error) => {
        console.error('Error loading events', error);
      }
    });
  }
  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

  onEventClick(eventId: string) {
    this.eventSelect.emit(eventId);
    console.log('Event clicked:', eventId);
  }
}
