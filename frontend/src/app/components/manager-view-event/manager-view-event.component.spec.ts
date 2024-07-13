import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerViewEventComponent } from './manager-view-event.component';

describe('ManagerViewEventComponent', () => {
  let component: ManagerViewEventComponent;
  let fixture: ComponentFixture<ManagerViewEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerViewEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerViewEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
