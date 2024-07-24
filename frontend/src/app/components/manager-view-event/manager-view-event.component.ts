import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { EventsService } from '../../Services/events.service';
import { DatePipe } from '@angular/common';
import { SuccessMessageComponent } from '../success-message/success-message.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { UpdateEventComponent } from '../update-event/update-event.component';

interface UserProfile {
  image: string;
  name: string;
  registrationTime: string;
}

@Component({
  selector: 'app-manager-view-event',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, SuccessMessageComponent, ErrorMessageComponent, UpdateEventComponent],
  templateUrl: './manager-view-event.component.html',
  styleUrls: ['./manager-view-event.component.css']
})
export class ManagerViewEventComponent implements OnInit {
  @Input() eventId: string | undefined;

  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  responseMessage: string = '';
  isUpdatePopupVisible: boolean = false;

  eventImage: string | undefined;
  eventHeading: string = '';
  eventDescription: string = '';
  eventPrice: number = 0;
  attendees: number = 0;
  eventDate: string = '';
  eventTime: string = '';
  eventLocation: string = '';
  userProfiles: UserProfile[] = [];

  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    if (this.eventId) {
      this.getEventDetails();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventId'] && this.eventId) {
      this.getEventDetails();
    }
  }

  getEventDetails(): void {
    if (!this.eventId) return;

    this.eventsService.getEventById(this.eventId).pipe(
      catchError(error => {
        console.error('Error fetching event details:', error);
        return throwError(error);
      })
    ).subscribe(response => {
      if (response.responseCode === 200) {
        const eventData = response.data;
        this.eventImage = eventData.image;
        this.eventHeading = eventData.name;
        this.eventDescription = eventData.description;
        this.eventPrice = eventData.regularPrice;
        this.attendees = eventData.numberOfTickets - eventData.remainingTickets;
        this.eventLocation = eventData.location;
        this.eventDate = this.formatDateTime(eventData.date);
        this.eventTime = this.formatDateTime(eventData.time);
        if (this.eventId) {
          this.getPeopleAttending(this.eventId);
        }
      } else {
        console.error('Failed to retrieve event details:', response.message);
      }
    });
  }
  

  

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  getPeopleAttending(eventId: string): void {
    this.eventsService.getPeopleAttending(eventId).subscribe(response => {
      if (response.responseCode === 200) {
        this.userProfiles = response.data.map((attendee: any) => ({
          image: attendee.user.profilePicture,
          name: attendee.user.name,
          registrationTime: this.formatDateTime(attendee.createdAt)
        }));
        console.log('People attending:', this.userProfiles);
      } else {
        console.error('Failed to retrieve people attending:', response.message);
      }
    });
  }

  cancelEventById(): void {
    if (!this.eventId) {
      console.error('Event ID is not defined');
      return;
    }
  
    console.log('Attempting to cancel event with ID:', this.eventId);
  
    this.eventsService.cancelEvent(this.eventId).pipe(
      catchError(error => {
        console.error('Error canceling event:', error);
        return throwError(error);
      })
    ).subscribe(response => {
      this.responseMessage = response.message;
      if (response.responseCode === 200) {
        this.resetAndShowMessage(true);
        console.log('Event canceled successfully');
      } else {
        console.error('Failed to cancel event:', response.message);
        this.resetAndShowMessage(false);
      }
    });
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

  showUpdatePopup(): void {
    this.isUpdatePopupVisible = true;
    console.log('Event ID passed to update form:', this.eventId);
  }

  closeUpdatePopup(): void {
    this.isUpdatePopupVisible = false;
    this.getEventDetails(); // Refresh event details after update
  }
}