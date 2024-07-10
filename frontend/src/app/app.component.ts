import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventsComponent } from './components/events/events.component';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LandingPageComponent, EventsComponent, MatSliderModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
