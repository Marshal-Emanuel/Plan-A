import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerframeComponent } from './managerframe.component';

describe('ManagerframeComponent', () => {
  let component: ManagerframeComponent;
  let fixture: ComponentFixture<ManagerframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerframeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
