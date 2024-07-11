import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ManagerdashboardComponent } from '../managerdashboard/managerdashboard.component';
import { EventFormComponent } from '../event-form/event-form.component';

@Component({
  selector: 'app-managerframe',
  standalone: true,
  imports: [RouterLink, ManagerdashboardComponent, EventFormComponent],
  templateUrl: './managerframe.component.html',
  styleUrl: './managerframe.component.css'
})
export class ManagerframeComponent {

}
