import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { EventFormComponent } from './event-form.component';
import { EventsService } from '../../Services/events.service';

describe('EventFormComponent', () => {
  let component: EventFormComponent;
  let fixture: ComponentFixture<EventFormComponent>;
  let eventsService: jasmine.SpyObj<EventsService>;

  beforeEach(async () => {
    const eventsServiceSpy = jasmine.createSpyObj('EventsService', ['getEventById', 'createEvent', 'updateEvent']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, EventFormComponent], // Import the standalone component here
      providers: [
        { provide: EventsService, useValue: eventsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventFormComponent);
    component = fixture.componentInstance;
    eventsService = TestBed.inject(EventsService) as jasmine.SpyObj<EventsService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load event data when eventId is provided', () => {
    const mockEvent = {
      name: 'Test Event',
      eventType: 'Conference',
      location: 'Test Location',
      date: '2024-07-25',
      time: '10:00',
      numberOfTickets: 100,
      hasRegular: true,
      regularPrice: 20,
      hasVIP: true,
      vipPrice: 50,
      hasChildren: true,
      childrenPrice: 10,
      isPromoted: true,
      promoDetails: 'Promo details',
      description: 'Event description',
      moreInfo: 'More information',
      image: 'test-image.jpg'
    };

    component.eventId = '123';
    eventsService.getEventById.and.returnValue(of(mockEvent));

    component.loadEventData();

    expect(component.eventName).toEqual(mockEvent.name);
    expect(component.eventType).toEqual(mockEvent.eventType);
    expect(component.location).toEqual(mockEvent.location);
    expect(component.eventDate).toEqual('2024-07-25');
    expect(component.eventTime).toEqual(mockEvent.time);
    expect(component.numberOfTickets).toEqual(mockEvent.numberOfTickets);
    expect(component.hasRegular).toEqual(mockEvent.hasRegular);
    expect(component.regularPrice).toEqual(mockEvent.regularPrice);
    expect(component.hasVIP).toEqual(mockEvent.hasVIP);
    expect(component.vipPrice).toEqual(mockEvent.vipPrice);
    expect(component.hasChildren).toEqual(mockEvent.hasChildren);
    expect(component.childrenPrice).toEqual(mockEvent.childrenPrice);
    expect(component.isPromoted).toEqual(mockEvent.isPromoted);
    expect(component.promoDetails).toEqual(mockEvent.promoDetails);
    expect(component.description).toEqual(mockEvent.description);
    expect(component.moreInfo).toEqual(mockEvent.moreInfo);
    expect(component.image).toEqual(mockEvent.image);
  });

  it('should call createEvent when submitting a new event', async () => {
    spyOn(component, 'uploadFile').and.returnValue(Promise.resolve('uploaded-image-url'));

    component.eventName = 'Test Event';
    component.eventType = 'Conference';
    component.location = 'Test Location';
    component.eventDate = '2024-07-25';
    component.eventTime = '10:00';
    component.numberOfTickets = 100;
    component.hasRegular = true;
    component.regularPrice = 20;
    component.hasVIP = true;
    component.vipPrice = 50;
    component.hasChildren = true;
    component.childrenPrice = 10;
    component.isPromoted = true;
    component.promoDetails = 'Promo details';
    component.description = 'Event description';
    component.moreInfo = 'More information';
    component.files = [new File([], 'test-image.jpg')];

    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    form.dispatchEvent(new Event('submit'));

    await fixture.whenStable();

    expect(eventsService.createEvent).toHaveBeenCalled();
  });

  it('should call updateEvent when submitting an existing event', async () => {
    spyOn(component, 'uploadFile').and.returnValue(Promise.resolve('uploaded-image-url'));

    component.eventId = '123';
    component.eventName = 'Test Event';
    component.eventType = 'Conference';
    component.location = 'Test Location';
    component.eventDate = '2024-07-25';
    component.eventTime = '10:00';
    component.numberOfTickets = 100;
    component.hasRegular = true;
    component.regularPrice = 20;
    component.hasVIP = true;
    component.vipPrice = 50;
    component.hasChildren = true;
    component.childrenPrice = 10;
    component.isPromoted = true;
    component.promoDetails = 'Promo details';
    component.description = 'Event description';
    component.moreInfo = 'More information';
    component.files = [new File([], 'test-image.jpg')];

    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    form.dispatchEvent(new Event('submit'));

    await fixture.whenStable();

    expect(eventsService.updateEvent).toHaveBeenCalledWith('123', jasmine.any(Object));
  });





});
