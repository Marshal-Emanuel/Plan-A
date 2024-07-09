import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  imports: [CommonModule, RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

}
