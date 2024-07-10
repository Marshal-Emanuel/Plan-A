import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usertickets',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './usertickets.component.html',
  styleUrls: ['./usertickets.component.css']
})
export class UserticketsComponent {
  tickets = [
    {
      eventTitle: 'Teach2Give Talks',
      eventLocation: 'Mt Kenya Region',
      eventDate: 'Monday July-10 10:30pm',
      hostName: 'John Doe',
      hostImage: '/assets/images/profile.png',
      ticketPrice: 'Ksh. 2000',
      contactNumber: '0712345678',
      invitationMessage: 'We would like to invite you to participate in our event. Your ticket will be emailed to you shortly.'
    },
    {
      eventTitle: 'Tech Innovators',
      eventLocation: 'Nairobi',
      eventDate: 'Wednesday July-12 2:00pm',
      hostName: 'Jane Smith',
      hostImage: '/assets/images/profile.png',
      ticketPrice: 'Ksh.1500',
      contactNumber: '0712345679',
      invitationMessage: 'Join us for an inspiring event where top tech innovators will share their insights. Your ticket will be emailed to you shortly.'
    },
    {
      eventTitle: 'Startup Expo',
      eventLocation: 'Mombasa',
      eventDate: 'Friday July-14 9:00am',
      hostName: 'Michael Johnson',
      hostImage: '/assets/images/profile.png',
      ticketPrice: 'Ksh. 2500',
      contactNumber: '0712345680',
      invitationMessage: 'Be part of our startup expo and discover groundbreaking innovations. Your ticket will be emailed to you shortly.'
    },
    {
      eventTitle: 'Health and Wellness Fair',
      eventLocation: 'Kisumu',
      eventDate: 'Sunday July-16 4:00pm',
      hostName: 'Emily Davis',
      hostImage: '/assets/images/profile.png',
      ticketPrice: 'Ksh. 1000',
      contactNumber: '0712345681',
      invitationMessage: 'Explore health and wellness products and services at our fair. Your ticket will be emailed to you shortly.'
    }
  ];
}
