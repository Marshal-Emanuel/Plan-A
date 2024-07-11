import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-managerdashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './managerdashboard.component.html',
  styleUrls: ['./managerdashboard.component.css']
})
export class ManagerdashboardComponent {
  events = [
    { name: 'Event 1', ticketsSold: 50, totalTickets: 100 },
    { name: 'Event 2', ticketsSold: 75, totalTickets: 100 },
    { name: 'Event 3', ticketsSold: 20, totalTickets: 100 }
  ];

  getPercentage(ticketsSold: number, totalTickets: number): number {
    return (ticketsSold / totalTickets) * 100;
  }
}
