import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ManagerViewEventComponent } from './manager-view-event.component';
import { EventsService } from '../../Services/events.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ManagerViewEventComponent', () => {
  let component: ManagerViewEventComponent;
  let fixture: ComponentFixture<ManagerViewEventComponent>;
  let eventsService: EventsService;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ManagerViewEventComponent
      ],
      providers: [
        EventsService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerViewEventComponent);
    component = fixture.componentInstance;
    eventsService = TestBed.inject(EventsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should get people attending the event', waitForAsync(() => {
    const mockAttendees = {
      responseCode: 200,
      data: [
        {
          user: {
            profilePicture: 'user1.jpg',
            name: 'User One'
          },
          createdAt: '2024-07-25T14:00:00Z'
        },
        {
          user: {
            profilePicture: 'user2.jpg',
            name: 'User Two'
          },
          createdAt: '2024-07-26T14:00:00Z'
        }
      ]
    };

    component.eventId = '123';
    spyOn(eventsService, 'getPeopleAttending').and.returnValue(of(mockAttendees));
    component.getPeopleAttending('123');

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.userProfiles.length).toBe(2);
      expect(component.userProfiles[0].name).toBe('User One');
      expect(component.userProfiles[1].name).toBe('User Two');
    });
  }));
});
