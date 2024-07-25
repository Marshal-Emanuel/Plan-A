import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLink, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { of } from 'rxjs';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule, 
        RouterModule, 
        RouterLink, 
        NavbarComponent, 
        LandingPageComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

