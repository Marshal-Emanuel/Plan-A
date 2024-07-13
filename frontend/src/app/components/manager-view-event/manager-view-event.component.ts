import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface UserProfile {
  image: string;
  name: string;
  registrationTime: string;
}


@Component({
  selector: 'app-manager-view-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-view-event.component.html',
  styleUrl: './manager-view-event.component.css'
})
export class ManagerViewEventComponent {
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

  userProfiles: UserProfile[] = [
    {
      image: 'assets/images/profile.png',
      name: 'John Doe',
      registrationTime: '2024-07-11 08:30:00'
    },
    {
      image: 'assets/images/profile.png',
      name: 'Jane Smith',
      registrationTime: '2024-07-11 09:15:00'
    },
    {
      image: 'assets/images/profile.png',
      name: 'Robert Brown',
      registrationTime: '2024-07-11 10:45:00'
    },
    
  ];


}
