import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ticket-purchase',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-purchase.component.html',
  styleUrl: './ticket-purchase.component.css'
})
export class TicketPurchaseComponent {
  selectedTicketType: 'group' | 'single' = 'single'; // Default to single ticket
  groupSize: number = 1;
  personName: string = '';

  constructor() {}

  purchaseTicket() {
    if (this.selectedTicketType === 'group') {
      console.log(`Purchasing group ticket for ${this.groupSize} people.`);
      // Add logic to handle purchasing group ticket
    } else {
      console.log(`Purchasing single ticket for ${this.personName}.`);
      // Add logic to handle purchasing single ticket
    }
    // Reset form fields after purchase (if needed)
    this.resetForm();
  }

  resetForm() {
    this.groupSize = 1;
    this.personName = '';
  }
}
