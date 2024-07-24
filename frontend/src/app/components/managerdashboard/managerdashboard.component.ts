import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EventsService } from '../../Services/events.service'; // Adjust the import path if needed

@Component({
  selector: 'app-managerdashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './managerdashboard.component.html',
  styleUrls: ['./managerdashboard.component.css']
})
export class ManagerdashboardComponent implements OnInit {
  @Output() componentChange = new EventEmitter<string>();
  selectedComponent: string = 'dashboard';
  totalRsvps: number | undefined;
  eventCount: number | undefined;
  sumOfPaidAmmounts: number | undefined;
  events: any[] = [];

  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    const userId = JSON.parse(localStorage.getItem('userId') || 'null');
    console.log('userId:', userId);;
    if (userId) {
      this.getTotalRSVPs(userId);
      this.getManagerEventCount(userId);
      this.getSumOfPaidAmountManager(userId);
      this.loadEvents(userId)
    } else {
      console.error('No userId found in localStorage');
    }
  }

  getTotalRSVPs(userId: string): void {
    this.eventsService.totalRSVPsManager(userId).subscribe(
      (response: any) => {
        this.totalRsvps = response.totalRSVPs;
        console.log('Total RSVPs:', response);
        this.totalRsvps = response;
      },
      (error: any) => {
        console.error('Error fetching total RSVPs:', error);
      }
    );
  }
  getManagerEventCount(managerId: string): void {
    this.eventsService.getManagerEventCount(managerId).subscribe(
      (response: any) => {
        this.eventCount = response.eventCount.eventCount;
        console.log('Event Count:', response.eventCount);
      },
      (error: any) => {
        console.error('Error fetching event count:', error);
      }
    );
  }

  getSumOfPaidAmountManager(managerId: string): void {
    this.eventsService.getSumOfPaidAmmountManager(managerId).subscribe(
      (response: any) => {
        this.sumOfPaidAmmounts = response.totalPaidAmount;
        console.log('Sum of Paid Amounts:', response.totalPaidAmount);
      },
      (error: any) => {
        console.error('Error fetching sum of paid amounts:', error);
      }
    );
  }


  loadEvents(managerId: string): void {
    this.eventsService.getEventsByManagerId(managerId).subscribe(
      (response: any) => {
        if (response && Array.isArray(response.data)) {
          this.events = response.data;
          console.log('Events:', response.data);
        } else {
          console.error('Expected an array in response.data but got:', response);
          this.events = []; // Fallback to an empty array
        }
      },
      (error: any) => {
        console.error('Error fetching events:', error);
        this.events = []; // Fallback to an empty array
      }
    );
  }


  getPercentage(ticketsSold: number, totalTickets: number): number {
    return (ticketsSold / totalTickets) * 100;
  }
  selectComponent(component: string) {
    this.selectedComponent = component;
  }

  createNewEvent() {
    this.componentChange.emit('newEvent');
  }
}
