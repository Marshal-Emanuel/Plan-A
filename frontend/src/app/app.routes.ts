import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { EventsComponent } from './components/events/events.component';
import { UserEventComponent } from './components/user-event/user-event.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'events', component: EventsComponent},
  // Viewing one event add /event/:id
  {path: 'event', component: UserEventComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'login', component: LoginComponent}
];
