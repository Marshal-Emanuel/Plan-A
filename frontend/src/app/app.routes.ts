import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { EventsComponent } from './components/events/events.component';
import { UserEventComponent } from './components/user-event/user-event.component';

export const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'event', component: EventsComponent},
  // Viewing one event
  {path: 'events', component: UserEventComponent},
];
