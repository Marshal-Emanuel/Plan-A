import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../Services/events.service';
import { ReservationsService } from '../../Services/reservations.service';
import { UserService } from '../../Services/user.service';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { SuccessMessageComponent } from '../success-message/success-message.component';

@Component({
  selector: 'app-ticket-purchase',
  standalone: true,
  imports: [CommonModule, FormsModule, ErrorMessageComponent, SuccessMessageComponent],
  templateUrl: './ticket-purchase.component.html',
  styleUrls: ['./ticket-purchase.component.css']
})
export class TicketPurchaseComponent implements OnInit {
  eventId: string = "";
  event: any;
  selectedTicketType: string = '';
  numberOfPeople: number = 1;
  proxyName: string = '';
  totalPrice: number = 0;
  userId: string = '';
  token: string = '';
  userBalance: number = 0;
  topUpAmount: number = 0;
  showTopUpForm: boolean = false;
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  responseMessage: string = '';
  showFundWalletPopup: boolean = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private reservationService: ReservationsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    this.userId = localStorage.getItem('userId') || '';

    if (!this.token || !this.userId) {
      console.error('User is not logged in or token/userId is missing');
      return;
    }

    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('id')!;
      if (this.eventId) {
        this.fetchEvent(this.eventId);
      }
    });

    if (this.userId) {
      this.fetchUserBalance(this.userId);
    }
  }

  fetchEvent(eventId: string): void {
    this.eventsService.getEventById(eventId).subscribe({
      next: (response: any) => {
        this.event = response.data;
        this.updatePricing();
      },
      error: (error) => console.error('Error fetching event:', error)
    });
  }

  updatePricing(): void {
    if (this.selectedTicketType === 'regular' && this.event.hasRegular) {
      this.totalPrice = this.numberOfPeople * this.event.regularPrice;
    } else if (this.selectedTicketType === 'vip' && this.event.hasVIP) {
      this.totalPrice = this.numberOfPeople * this.event.vipPrice;
    } else if (this.selectedTicketType === 'children' && this.event.hasChildren) {
      this.totalPrice = this.numberOfPeople * this.event.childrenPrice;
    } else {
      this.totalPrice = 0;
    }
  }

  purchaseTicket(): void {
    if (this.numberOfPeople > this.event.remainingTickets) {
      this.showErrorMessage = true;
      this.errorMessage = 'Not enough tickets available.';
      return;
    }

    if (!this.selectedTicketType) {
      this.showErrorMessage = true;
      this.errorMessage = 'Please select a ticket type.';
      return;
    }

    const reservation = {
      eventId: this.event.eventId,
      userId: this.userId,
      isRegular: this.selectedTicketType === 'regular',
      isVIP: this.selectedTicketType === 'vip',
      isChildren: this.selectedTicketType === 'children',
      proxyName: this.proxyName || 'N/A',
      numberOfPeople: this.numberOfPeople,
    };

    if (!this.token) {
      this.showErrorMessage = true;
      this.errorMessage = 'Token not found. Please log in.';
      return;
    }

    this.reservationService.createReservation(reservation, this.token).subscribe({
      next: (response) => {
        this.responseMessage = response.message;
        if (response.responseCode === 201) {
          this.showSuccessMessage = true;
          this.successMessage = 'Reservation created successfully!';
          this.resetForm();
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 4000);
        } else {
          this.showErrorMessage = true;
          this.errorMessage = response.message || 'Error making reservation. Please try again.';
          setTimeout(() => {
            this.showErrorMessage = false;
          }, 4000);
        }
      },
      error: (error) => {
        console.error('Error making reservation:', error);
        this.showErrorMessage = true;
        this.errorMessage = 'Error making reservation. Please try again.';
        setTimeout(() => {
          this.showErrorMessage = false;
        }, 4000);
      }
    });
  }

  resetForm(): void {
    this.numberOfPeople = 1;
    this.proxyName = '';
    this.totalPrice = 0;
    this.selectedTicketType = '';
  }

  fetchUserBalance(userId: string): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.userService.getUserBalance(userId, headers).subscribe({
      next: (response: any) => {
        this.userBalance = response.balance;
      },
      error: (error) => console.error('Error fetching user balance:', error)
    });
  }

  topUpWallet(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.userService.topUpUserWallet(this.userId, this.topUpAmount, headers).subscribe({
      next: (response) => {
        console.log('Wallet top-up successful:', response);
        this.fetchUserBalance(this.userId);
        this.showTopUpForm = false;
        this.showSuccessMessage = true;
        this.successMessage = 'Wallet top-up successful!';
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 4000);
      },
      error: (error) => {
        console.error('Error topping up wallet:', error);
        this.showErrorMessage = true;
        this.errorMessage = 'Error topping up wallet. Please try again.';
        setTimeout(() => {
          this.showErrorMessage = false;
        }, 4000);
      }
    });
  }


  openFundWalletPopup(): void {
    this.showFundWalletPopup = true;
  }
  
  closeFundWalletPopup(): void {
    this.showFundWalletPopup = false;
  }
}
