import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ReservationsService } from '../../Services/reservations.service';
import { EventsService } from '../../Services/events.service';

@Component({
  selector: 'app-admin-dshbrd',
  standalone: true,
  imports: [],
  templateUrl: './admin-dshbrd.component.html',
  styleUrl: './admin-dshbrd.component.css'
})
export class AdminDshbrdComponent implements OnInit {
  totalUsers: number = 0;
  totalEvents: number = 0;
  totalTicketsSold: number = 0;
  totalRevenue: number = 0;
  userName: string = 'John Doe'; // This should be dynamically loaded
  numberOfAdmins: number = 0;
  numberOfEventManagers: number = 0;
  approvedEvents: number = 0;
  pendingApproval: number = 0;
  pendingEventManagerRequests: number = 0;
  satisfactionRate: number = 95; // This should be dynamically loaded
  ticketsSaleRate: number = 9.3; // This should be dynamically loaded

  constructor(private userService: UserService,private reservationService: ReservationsService, private eventService: EventsService ) {
  
    
  }

  ngOnInit(): void {
    this.loadUsers();
    this.getEventsCount();
    this.getAllReservations();
    this.loadUserCounts();
    this.loadActiveEventsCount();
    this.loadPendingEventsCount();
    this.loadPendingVerificationCount();
    this.loadTotalPaidAmountForAllEvents();
    this.loadUserName();
  }

  loadUsers(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.userService.getAllUsers(headers).subscribe(
      (response) => {
        const count = response.length;
        console.log("totoal users",count);
        this.totalUsers = response.length;
      },
      (error) => {
        // Handle the error here
      }
    );
  }

  
//get all events count
getEventsCount(): void {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  this.userService.getEvents(headers).subscribe(
    (response) => {
      const count = response.data.length;
      this.totalEvents = response.data.length;
      console.log("total events", count);
    },
    (error) => {
      // Handle the error here
    }
  );
}


//get all reservations count
getAllReservations(): void {
  const token : string = localStorage.getItem('token')!;
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  this.reservationService.getAllReservations(token).subscribe(
    (response) => {
      const count = response.length;
      this.totalTicketsSold = response.length;
      console.log("total reservations", count);
    },
    (error) => {
      // Handle the error here
    }
  );
}


//get ourse count 
loadUserCounts(): void {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.userService.getUserCountByRole(headers).subscribe(
    (response) => {
      console.log("User counts by role:", response);
      this.numberOfAdmins = response.adminCount;
        this.numberOfEventManagers = response.managerCount;
    },
    (error) => {
      // Handle the error here
    }
  );
}
loadActiveEventsCount(): void {
  this.eventService.getActiveEvents().subscribe(
    (response) => {
      const activeEventsCount = response.data.length;
      this.approvedEvents = response.data.length;
      console.log("Number of active events:", activeEventsCount);
    },
    (error) => {
      // Handle the error here
    }
  );
}


loadPendingEventsCount(): void {
  this.eventService.getPendingEvents().subscribe(
    (response) => {
      const pendingEventsCount = response.data.length;
      this.pendingApproval = response.data.length;
      console.log("Number of pending events:", pendingEventsCount);
    },
    (error) => {
      // Handle the error here
    }
  );
}

loadPendingVerificationCount(): void {
  this.eventService.getPendingVerification().subscribe(
    (response) => {
      const pendingVerificationCount = response.users.length;
      this.pendingEventManagerRequests = response.users.length;
      console.log("Number of pending verifications:", pendingVerificationCount);
    },
    (error) => {
      // Handle the error here
    }
  );
}

loadTotalPaidAmountForAllEvents(): void {
  const token = localStorage.getItem('token')!;
  this.reservationService.getTotalPaidAmountForAllEvents(token).subscribe(
    (response) => {
      const totalPaidAmount = response.totalPaidAmount;
      this.totalRevenue = response.totalPaidAmount;
      console.log("Total paid amount for all events:", totalPaidAmount);
    },
    (error) => {
      // Handle the error here
    }
  );
}


loadUserName(): void {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.error('User ID not found in localStorage');
    return;
  }
  this.userService.getUserDetails(userId).subscribe(
    (response) => {
      this.userName = response.name;
      console.log("User name:", this.userName);
    },
    (error) => {
      // Handle the error here
    }
  );
}





}
