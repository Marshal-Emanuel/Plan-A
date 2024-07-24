import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReservationsService } from '../../Services/reservations.service';

@Component({
  selector: 'app-usertickets',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './usertickets.component.html',
  styleUrls: ['./usertickets.component.css']
})
export class UserticketsComponent implements OnInit {
  tickets: any[] = []; // Adjust the type according to your data structure

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
}