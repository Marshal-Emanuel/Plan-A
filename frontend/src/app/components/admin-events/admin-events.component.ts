import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../Services/events.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SuccessMessageComponent } from '../success-message/success-message.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';

export interface Manager {
  name: string;
  phoneNumber: string;
  email: string;
  profilePicture: string;
}

export interface Event {
  eventId: string;
  managerId: string;
  name: string;
  description: string;
  moreInfo: string;
  location: string;
  date: string;
  time: string;
  numberOfTickets: number;
  remainingTickets: number;
  createdAt: string;
  updatedAt: string;
  image: string;
  hasRegular: boolean;
  regularPrice: number;
  hasVIP: boolean;
  vipPrice: number;
  hasChildren: boolean;
  childrenPrice: number;
  isPromoted: boolean;
  promoDetails: any;
  status: string;
  nature: string;
  discount: number;
  manager: Manager;
}

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [CommonModule, SuccessMessageComponent, ErrorMessageComponent],
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.css']
})
export class AdminEventsComponent implements OnInit {
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  responseMessage: string = '';
  events: Event[] = [];

  constructor(private eventsService: EventsService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    console.log("Getting events");
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.eventsService.getAllEvents(headers).subscribe(
      (response) => {
        this.events = response.data;
        console.log("Total events:", this.events.length);
      },
      (error) => {
        console.error("Error fetching events:", error);
      }
    );
  }

  calculateTicketSalesRate(event: Event): number {
    const soldTickets = event.numberOfTickets - event.remainingTickets;
    return (soldTickets / event.numberOfTickets) * 100;
  }

  calculateTotalEarnings(event: Event): number {
    const soldTickets = event.numberOfTickets - event.remainingTickets;
    return soldTickets * event.regularPrice;
  }

  approveEvent(eventId: string): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.put(`http://localhost:4400/event/approveEvent/${eventId}`, {}, { headers }).subscribe(
      (response) => {
        console.log('Event approved successfully');
        this.responseMessage = 'Event approved successfully';
        this.resetAndShowMessage(true)
        this.getEvents(); // Refresh the events list
      },
      (error) => {
        console.error('Error approving event:', error);
      }
    );
  }

  rejectEvent(eventId: string): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.put(`http://localhost:4400/event/rejectEvent/${eventId}`, {}, { headers }).subscribe(
      (response) => {
        console.log('Event rejected successfully');
        this.responseMessage = 'Event Rejected';
        this.resetAndShowMessage(true)
        this.getEvents(); // Refresh the events list
      },
      (error) => {
        console.error('Error rejecting event:', error);
      }
    );
  }
  resetAndShowMessage(isSuccess: boolean) {
    this.showSuccessMessage = false;
    this.showErrorMessage = false;

    setTimeout(() => {
      if (isSuccess) {
        this.showSuccessMessage = true;
      } else {
        this.showErrorMessage = true;
      }
    }, 10);

    setTimeout(() => {
      this.showSuccessMessage = false;
      this.showErrorMessage = false;
    }, 4000);
  }
}