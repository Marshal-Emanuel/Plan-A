import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface UpcomingEvent {
  eventName: string;
  eventImg: string;
  description: string;
  location: string;
  date: string;
  time: string;
  attendees: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  eventImage: string = '/assets/images/hackathon.jpg';
  eventHeading: string = 'Moringa Hackathon';
  eventDescription: string = `As the term indicates, event management is executing an entire event, including event planning, logistics,
    budgeting, vendor management, marketing, mapping the event agenda, inviting speakers, setting up
    registration, overseeing execution, and more.`;
  eventPrice: string = '1000';
  attendees: string = '20';
  eventLocation: string = 'Chuka Uni Lab 4';
  eventDate: string = '20 April 2024';
  hostImage: string = '/assets/images/profile.png';
  hostName: string = 'Host Name';
  hostEmail: string = 'hostemail.com';
  hostProfession: string = 'Senior Developer';

  upcomingEvents: UpcomingEvent[] = [
    {
      eventName: 'Music Festival',
      eventImg: 'https://picsum.photos/200/300?6',
      description: 'An amazing music festival featuring top artists.',
      location: 'Nairobi',
      date: '2024-12-25',
      time: '10:00 AM',
      attendees: '50 are going',
      phoneNumber: '0700123456'
    },
    {
      eventName: 'Tech Conference',
      eventImg: 'https://picsum.photos/200/300?7',
      description: 'Join the biggest tech conference in Africa.',
      location: 'Mombasa',
      date: '2024-11-15',
      time: '10:00 AM',
      attendees: '100 are going',
      phoneNumber: '0700654321'
    }
    // Add more events as needed
  ];
}
