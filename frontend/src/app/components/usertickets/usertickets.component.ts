import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReservationsService } from '../../Services/reservations.service';
import { SuccessMessageComponent } from '../success-message/success-message.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-usertickets',
  standalone: true,
  imports: [RouterLink, CommonModule, SuccessMessageComponent, ErrorMessageComponent, NavbarComponent],
  templateUrl: './usertickets.component.html',
  styleUrls: ['./usertickets.component.css']
})
export class UserticketsComponent implements OnInit {
  userId(userId: any) {
    throw new Error('Method not implemented.');
  }
  tickets: any[] = []; // Adjust the type according to your data structure
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  responseMessage: string = '';

  constructor(private reservationService: ReservationsService) {}

  ngOnInit(): void {
    this.fetchReservations();
  }

  fetchReservations(): void {
    console.log('Attempting to fetch reservations...');
    const userId = localStorage.getItem('userId');
    if (userId === null) {
      console.error('No userId found in localStorage. Make sure you are logged in.');
      return; // Exit the function if userId is null
    }
    console.log(`Fetched userId from localStorage: ${userId}`);
  
    const token = localStorage.getItem('token');
    if (token === null) {
      console.error('Token is null. Make sure you are logged in and the token is set.');
      return; // Exit the function if token is null
    }
  
    console.log(`Making API call to get reservations for userId: ${userId}`);
    this.reservationService.getReservationsForUser(userId, token).subscribe({
      next: (data) => {
        console.log(`Successfully fetched reservations for userId: ${userId}`);
        // Log the entire response data for detailed inspection
        console.log('Response data:', JSON.stringify(data, null, 2));
        this.tickets = data;
      },
      error: (error) => {
        console.error('Error fetching reservations:', error);
      }
    });
  }

  cancelReservation(reservationId: string): void {
    const token = localStorage.getItem('token');
    if (token === null) {
      console.error('Token is null. Cannot proceed with cancellation.');
      return;
    }
    
    console.log(`Attempting to cancel reservation with ID: ${reservationId}`);
    this.reservationService.cancelReservation(reservationId, token).subscribe({
      next: (response: any) => {
        console.log('Success:', response);
        this.responseMessage = 'Reservation canceled successfully!';
        this.resetAndShowMessage(true);
        this.fetchReservations(); // Refresh the list of tickets
      },
      error: (error: any) => {
        console.error('Error:', error);
        this.responseMessage = 'Failed to cancel reservation. Please try again.';
        this.resetAndShowMessage(false);
      }
    });
  }

  resetAndShowMessage(isSuccess: boolean): void {
    // Reset both message flags
    this.showSuccessMessage = false;
    this.showErrorMessage = false;
  
    // Set a small timeout to ensure the DOM updates
    setTimeout(() => {
      if (isSuccess) {
        this.showSuccessMessage = true;
      } else {
        this.showErrorMessage = true;
      }
    }, 10);
  }
}
