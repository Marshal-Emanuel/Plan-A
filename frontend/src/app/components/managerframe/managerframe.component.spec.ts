import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ManagerframeComponent } from './managerframe.component';
import { AuthServiceTsService } from '../../Services/auth.service.ts.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

@Component({ selector: 'app-managerdashboard', template: '' })
class ManagerdashboardStubComponent {}

@Component({ selector: 'app-event-form', template: '' })
class EventFormStubComponent {}

@Component({ selector: 'app-manager-events', template: '' })
class ManagerEventsStubComponent {}

@Component({ selector: 'app-manager-view-event', template: '' })
class ManagerViewEventStubComponent {}

describe('ManagerframeComponent', () => {
  let component: ManagerframeComponent;
  let fixture: ComponentFixture<ManagerframeComponent>;
  let authService: jasmine.SpyObj<AuthServiceTsService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthServiceTsService', ['getCheckDetails']);

    await TestBed.configureTestingModule({
      imports: [ManagerframeComponent, RouterTestingModule],
      declarations: [
        ManagerdashboardStubComponent,
        EventFormStubComponent,
        ManagerEventsStubComponent,
        ManagerViewEventStubComponent
      ],
      providers: [{ provide: AuthServiceTsService, useValue: authServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerframeComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthServiceTsService) as jasmine.SpyObj<AuthServiceTsService>;

    // Mock data for the tests
    const authResponse = {
      info: { userId: 'mockUserId' }
    };

    authService.getCheckDetails.and.returnValue(of(authResponse));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });




  it('should select a component and set eventId correctly', () => {
    component.selectComponent('eventForm', 'mockEventId');
    expect(component.selectedComponent).toBe('eventForm');
    expect(component.selectedEventId).toBe('mockEventId');
  });

  it('should select a component without setting eventId', () => {
    component.selectComponent('dashboard');
    expect(component.selectedComponent).toBe('dashboard');
    expect(component.selectedEventId).toBeUndefined();
  });

  it('should handle component change', () => {
    component.onComponentChange('managerEvents');
    expect(component.selectedComponent).toBe('managerEvents');
  });

  it('should handle event click and set selectedComponent and eventId', () => {
    component.onEventClick('mockEventId');
    expect(component.selectedComponent).toBe('viewEvent');
    expect(component.selectedEventId).toBe('mockEventId');
  });

  it('should handle event select and set selectedComponent and eventId', () => {
    component.onEventSelect('mockEventId');
    expect(component.selectedEventId).toBe('mockEventId');
    expect(component.selectedComponent).toBe('viewEvent');
  });

 
});
