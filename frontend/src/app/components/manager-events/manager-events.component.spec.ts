import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerEventsComponent } from './manager-events.component';

describe('ManagerEventsComponent', () => {
  let component: ManagerEventsComponent;
  let fixture: ComponentFixture<ManagerEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
