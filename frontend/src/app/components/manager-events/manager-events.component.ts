import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
interface Event {
  name: string;
  date: string;
  time: string;
  location: string;
  soldTickets: number;
  totalTickets: number;
  status: string;
  imageUrl: string;
}
@Component({
  selector: 'app-manager-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-events.component.html',
  styleUrl: './manager-events.component.css'
})
export class ManagerEventsComponent {
  events: Event[] = [
    {
      name: 'Attlasian tech talk',
      date: '06/04/2024',
      time: '10:00 AM',
      location: 'Chuka University Lab 4',
      soldTickets: 5,
      totalTickets: 25,
      status: 'Past Event',
      imageUrl: 'assets/images/techevent.jfif'
    },
    {
      name: 'Attlasian tech talk',
      date: '06/04/2024',
      time: '10:00 AM',
      location: 'Chuka University Lab 4',
      soldTickets: 5,
      totalTickets: 25,
      status: 'Pending approval',
      imageUrl: 'assets/images/dj.avif'
    },
    {
      name: 'Attlasian tech talk',
      date: '06/04/2024',
      time: '10:00 AM',
      location: 'Chuka University Lab 4',
      soldTickets: 0,
      totalTickets: 25,
      status: 'Pending approval',
      imageUrl: 'assets/images/techevent.jfif'
    },
    {
      name: 'Attlasian tech talk',
      date: '06/04/2024',
      time: '10:00 AM',
      location: 'Chuka University Lab 4',
      soldTickets: 5,
      totalTickets: 25,
      status: 'Pending approval',
      imageUrl: 'assets/images/dj.avif'
    },
    {
      name: 'Attlasian tech talk',
      date: '06/04/2024',
      time: '10:00 AM',
      location: 'Chuka University Lab 4',
      soldTickets: 5,
      totalTickets: 25,
      status: 'Pending approval',
      imageUrl: 'assets/images/dj.avif'
    },
    {
      name: 'Attlasian tech talk',
      date: '06/04/2024',
      time: '10:00 AM',
      location: 'Chuka University Lab 4',
      soldTickets: 10,
      totalTickets: 25,
      status: 'Approved',
      imageUrl: 'assets/images/dj.avif'
    },
    {
      name: 'Attlasian tech talk',
      date: '06/04/2024',
      time: '10:00 AM',
      location: 'Chuka University Lab 4',
      soldTickets: 5,
      totalTickets: 25,
      status: 'Pending approval',
      imageUrl: 'assets/images/dj.avif'
    },
    {
      name: 'Attlasian tech talk',
      date: '06/04/2024',
      time: '10:00 AM',
      location: 'Chuka University Lab 4',
      soldTickets: 5,
      totalTickets: 40,
      status: 'Approved',
      imageUrl: 'assets/images/dj.avif'
    }
  ];

}
