import { Component } from '@angular/core';
import { ManagerdashboardComponent } from '../managerdashboard/managerdashboard.component';
import { EventFormComponent } from '../event-form/event-form.component';
import { ManagerEventsComponent } from '../manager-events/manager-events.component';
import { ManagerViewEventComponent } from "../manager-view-event/manager-view-event.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-managerframe',
  standalone: true,
  imports: [
    ManagerdashboardComponent,
    EventFormComponent,
    ManagerEventsComponent,
    ManagerViewEventComponent, CommonModule, RouterLink
  ],
  templateUrl: './managerframe.component.html',
  styleUrls: ['./managerframe.component.css']
})
export class ManagerframeComponent {
  selectedComponent: string = 'dashboard';

  selectComponent(component: string) {
    this.selectedComponent = component;
  }
}
