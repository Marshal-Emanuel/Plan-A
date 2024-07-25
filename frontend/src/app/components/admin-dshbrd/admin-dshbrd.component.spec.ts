import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDshbrdComponent } from './admin-dshbrd.component';
import { UserService } from '../../Services/user.service';
import { ReservationsService } from '../../Services/reservations.service';
import { EventsService } from '../../Services/events.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('AdminDshbrdComponent', () => {
  let component: AdminDshbrdComponent;
  let fixture: ComponentFixture<AdminDshbrdComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let reservationsServiceSpy: jasmine.SpyObj<ReservationsService>;
  let eventsServiceSpy: jasmine.SpyObj<EventsService>;

  beforeEach(async () => {
    const userServiceSpyObj = jasmine.createSpyObj('UserService', ['getAllUsers', 'getEvents', 'getUserCountByRole', 'getUserDetails']);
    const reservationsServiceSpyObj = jasmine.createSpyObj('ReservationsService', ['getAllReservations', 'getTotalPaidAmountForAllEvents']);
    const eventsServiceSpyObj = jasmine.createSpyObj('EventsService', ['getActiveEvents', 'getPendingEvents', 'getPendingVerification']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AdminDshbrdComponent], // Import the component instead of declaring it
      providers: [
        { provide: UserService, useValue: userServiceSpyObj },
        { provide: ReservationsService, useValue: reservationsServiceSpyObj },
        { provide: EventsService, useValue: eventsServiceSpyObj }
      ]
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    reservationsServiceSpy = TestBed.inject(ReservationsService) as jasmine.SpyObj<ReservationsService>;
    eventsServiceSpy = TestBed.inject(EventsService) as jasmine.SpyObj<EventsService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDshbrdComponent);
    component = fixture.componentInstance;
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('userId', 'fake-user-id');
  });

  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users', () => {
    userServiceSpy.getAllUsers.and.returnValue(of([{}, {}, {}]));
    component.loadUsers();
    expect(component.totalUsers).toBe(3);
  });

  it('should get events count', () => {
    userServiceSpy.getEvents.and.returnValue(of({ data: [{}, {}] }));
    component.getEventsCount();
    expect(component.totalEvents).toBe(2);
  });

  it('should get all reservations', () => {
    reservationsServiceSpy.getAllReservations.and.returnValue(of([{}, {}, {}, {}]));
    component.getAllReservations();
    expect(component.totalTicketsSold).toBe(4);
  });

  it('should load user counts', () => {
    userServiceSpy.getUserCountByRole.and.returnValue(of({ adminCount: 2, managerCount: 5 }));
    component.loadUserCounts();
    expect(component.numberOfAdmins).toBe(2);
    expect(component.numberOfEventManagers).toBe(5);
  });

  it('should load active events count', () => {
    eventsServiceSpy.getActiveEvents.and.returnValue(of({ data: [{}, {}, {}] }));
    component.loadActiveEventsCount();
    expect(component.approvedEvents).toBe(3);
  });

  it('should load pending events count', () => {
    eventsServiceSpy.getPendingEvents.and.returnValue(of({ data: [{}, {}] }));
    component.loadPendingEventsCount();
    expect(component.pendingApproval).toBe(2);
  });

  it('should load pending verification count', () => {
    eventsServiceSpy.getPendingVerification.and.returnValue(of({ users: [{}, {}, {}, {}] }));
    component.loadPendingVerificationCount();
    expect(component.pendingEventManagerRequests).toBe(4);
  });

  it('should load total paid amount for all events', () => {
    reservationsServiceSpy.getTotalPaidAmountForAllEvents.and.returnValue(of({ totalPaidAmount: 1000 }));
    component.loadTotalPaidAmountForAllEvents();
    expect(component.totalRevenue).toBe(1000);
  });

  it('should load user name', () => {
    userServiceSpy.getUserDetails.and.returnValue(of({ name: 'John Doe' }));
    component.loadUserName();
    expect(component.userName).toBe('John Doe');
  });
});