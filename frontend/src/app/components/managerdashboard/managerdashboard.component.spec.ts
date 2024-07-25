import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ManagerdashboardComponent } from './managerdashboard.component';
import { EventsService } from '../../Services/events.service';
import { of, throwError } from 'rxjs';

describe('ManagerdashboardComponent', () => {
  let component: ManagerdashboardComponent;
  let fixture: ComponentFixture<ManagerdashboardComponent>;
  let eventsService: EventsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ManagerdashboardComponent],
      providers: [EventsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerdashboardComponent);
    component = fixture.componentInstance;
    eventsService = TestBed.inject(EventsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch data on ngOnInit', () => {
    const userId = 'testUserId';
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(userId));
    
    const totalRSVPsResponse = { totalRSVPs: 100 };
    const eventCountResponse = { eventCount: { eventCount: 5 } };
    const sumOfPaidAmountResponse = { totalPaidAmount: 1000 };
    const eventsResponse = { data: [{ id: '1', name: 'Event 1', date: '2024-07-25', location: 'Location 1' }] };

    spyOn(eventsService, 'totalRSVPsManager').and.returnValue(of(totalRSVPsResponse));
    spyOn(eventsService, 'getManagerEventCount').and.returnValue(of(eventCountResponse));
    spyOn(eventsService, 'getSumOfPaidAmmountManager').and.returnValue(of(sumOfPaidAmountResponse));
    spyOn(eventsService, 'getEventsByManagerId').and.returnValue(of(eventsResponse));
    
    component.ngOnInit();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.totalRsvps).toBe(totalRSVPsResponse.totalRSVPs);
      expect(component.eventCount).toBe(eventCountResponse.eventCount.eventCount);
      expect(component.sumOfPaidAmmounts).toBe(sumOfPaidAmountResponse.totalPaidAmount);
      expect(component.events).toEqual(eventsResponse.data);
    });
  });

  it('should handle error in totalRSVPsManager', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify('testUserId'));
    spyOn(eventsService, 'totalRSVPsManager').and.returnValue(throwError('Error fetching RSVPs'));

    spyOn(console, 'error');
    
    component.ngOnInit();

    fixture.whenStable().then(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching total RSVPs:', 'Error fetching RSVPs');
    });
  });

  it('should handle error in getManagerEventCount', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify('testUserId'));
    spyOn(eventsService, 'getManagerEventCount').and.returnValue(throwError('Error fetching event count'));

    spyOn(console, 'error');
    
    component.ngOnInit();

    fixture.whenStable().then(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching event count:', 'Error fetching event count');
    });
  });

  it('should handle error in getSumOfPaidAmmountManager', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify('testUserId'));
    spyOn(eventsService, 'getSumOfPaidAmmountManager').and.returnValue(throwError('Error fetching paid amount'));

    spyOn(console, 'error');
    
    component.ngOnInit();

    fixture.whenStable().then(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching sum of paid amounts:', 'Error fetching paid amount');
    });
  });

  it('should handle error in getEventsByManagerId', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify('testUserId'));
    spyOn(eventsService, 'getEventsByManagerId').and.returnValue(throwError('Error fetching events'));

    spyOn(console, 'error');
    
    component.ngOnInit();

    fixture.whenStable().then(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching events:', 'Error fetching events');
    });
  });

  it('should calculate percentage correctly', () => {
    expect(component.getPercentage(50, 100)).toBe(50);
    expect(component.getPercentage(0, 100)).toBe(0);
    expect(component.getPercentage(50, 0)).toBe(0);
  });

  it('should select component correctly', () => {
    component.selectComponent('newEvent');
    expect(component.selectedComponent).toBe('newEvent');
  });

  it('should emit createNewEvent', () => {
    spyOn(component.componentChange, 'emit');
    component.createNewEvent();
    expect(component.componentChange.emit).toHaveBeenCalledWith('newEvent');
  });
});
