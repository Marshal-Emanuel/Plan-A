import { Component } from '@angular/core';
import { AdminDshbrdComponent } from "../admin-dshbrd/admin-dshbrd.component";
import { AdminEventsComponent } from "../admin-events/admin-events.component";
import { AdminUsersComponent } from "../admin-users/admin-users.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AdminDshbrdComponent, AdminEventsComponent, AdminUsersComponent, CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  selectedOption: string = 'dashboard';

  selectOption(option: string) {
    this.selectedOption = option;
  }

}
