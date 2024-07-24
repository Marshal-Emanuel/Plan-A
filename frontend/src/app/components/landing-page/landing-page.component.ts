import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

interface Review {
  reviewerName: string;
  reviewerImg: string;
  reviewText: string;
  starRating: number;
}

interface EventOrganizer {
  name: string;
  profileImg: string;
}

interface UpcomingEvent {
  eventName: string;
  eventImg: string;
  description: string;
  location: string;
  date: string;
  attendees: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  reviews: Review[] = [
    {
      reviewerName: 'John Doe',
      reviewerImg: 'https://picsum.photos/200/300?1',
      reviewText: 'The platform is very user friendly and the events are really nice',
      starRating: 5
    },
    {
      reviewerName: 'Jane Smith',
      reviewerImg: 'https://picsum.photos/200/300?2',
      reviewText: 'Great experience! Will definitely come back.',
      starRating: 4
    }
  ];

  eventOrganizers: EventOrganizer[] = [
    {
      name: 'Eliud Kipchoge',
      profileImg: 'https://picsum.photos/200/300?3'
    },
    {
      name: 'Lupita Nyong\'o',
      profileImg: 'https://picsum.photos/200/300?4'
    },
    {
      name: 'Wangari Maathai',
      profileImg: 'https://picsum.photos/200/300?5'
    }
  ];

  upcomingEvents: UpcomingEvent[] = [
    {
      eventName: 'Music Festival',
      eventImg: 'https://picsum.photos/200/300?6',
      description: 'An amazing music festival featuring top artists.',
      location: 'Nairobi',
      date: '2024-12-25',
      attendees: '50 are going',
      phoneNumber: '0700123456'
    },
    {
      eventName: 'Tech Conference',
      eventImg: 'https://picsum.photos/200/300?7',
      description: 'Join the biggest tech conference in Africa.',
      location: 'Mombasa',
      date: '2024-11-15',
      attendees: '100 are going',
      phoneNumber: '0700654321'
    }
  ];
}
