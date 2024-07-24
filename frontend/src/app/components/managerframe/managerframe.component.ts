import { Component, OnInit } from '@angular/core';
import { ManagerdashboardComponent } from '../managerdashboard/managerdashboard.component';
import { EventFormComponent } from '../event-form/event-form.component';
import { ManagerEventsComponent } from '../manager-events/manager-events.component';
import { ManagerViewEventComponent } from '../manager-view-event/manager-view-event.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthServiceTsService } from '../../Services/auth.service.ts.service';

@Component({
  selector: 'app-managerframe',
  standalone: true,
  imports: [
    ManagerdashboardComponent,
    EventFormComponent,
    ManagerEventsComponent,
    ManagerViewEventComponent, 
    CommonModule, 
    RouterLink
  ],
  templateUrl: './managerframe.component.html',
  styleUrls: ['./managerframe.component.css']
})
export class ManagerframeComponent implements OnInit {
  selectedComponent: string = 'dashboard';
  selectedEventId: string | undefined;

  constructor(private authService: AuthServiceTsService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.getCheckDetails(token).subscribe((response: any) => {
        console.log(response);
        localStorage.setItem('userId', JSON.stringify(response.info.userId));
      });
    }
  }

  selectComponent(component: string, eventId?: string) {
    this.selectedComponent = component;
    if (eventId) {
      this.selectedEventId = eventId;
    }
  }

  onComponentChange(component: string) {
    this.selectedComponent = component;
  }

  onEventClick(eventId: string) {
    this.selectComponent('viewEvent', eventId);
  }

  onEventSelect(eventId: string): void {
    this.selectedEventId = eventId;
    this.selectedComponent = 'viewEvent';
  }
}