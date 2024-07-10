import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
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
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, MatSliderModule,FormsModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {
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

  priceRangeValues: number[] = [0, 100]; // Default values for price range slider

  // Function to handle price range slider change
  onPriceRangeChange(event: any) {
    this.priceRangeValues = event.value;
    // Implement filtering logic based on price range values
    this.filterEventsByPriceRange();
  }

  // Example function to filter events based on price range
  filterEventsByPriceRange() {
    // Implement logic to filter upcomingEvents based on this.priceRangeValues
    // Example:
    // this.upcomingEvents = this.upcomingEvents.filter(event => {
    //   const eventPrice = parseFloat(event.price); // Assuming event.price is a number
    //   return eventPrice >= this.priceRangeValues[0] && eventPrice <= this.priceRangeValues[1];
    // });
  }
}
