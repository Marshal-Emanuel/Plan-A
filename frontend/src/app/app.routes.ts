import { ManagerdashboardComponent } from './components/managerdashboard/managerdashboard.component';
import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { EventsComponent } from './components/events/events.component';
import { UserEventComponent } from './components/user-event/user-event.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { UserticketsComponent } from './components/usertickets/usertickets.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { ManagerframeComponent } from './components/managerframe/managerframe.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { ManagerEventsComponent } from './components/manager-events/manager-events.component';

export const routes: Routes = [
  {path: '', component: LandingPageComponent},
  {path: 'events', component: EventsComponent},
  // Viewing one event add /event/:id
  {path: 'event', component: UserEventComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'tickets', component: UserticketsComponent},
  {path: 'wishlist', component: WishlistComponent},
  {path: 'manager', component: ManagerframeComponent},
  {path: 'mdashboard', component: ManagerdashboardComponent},
  {path: 'form', component: EventFormComponent},
  {path: 'mevents', component: ManagerEventsComponent},
];
