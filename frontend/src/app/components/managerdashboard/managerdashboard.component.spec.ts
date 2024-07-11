import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerdashboardComponent } from './managerdashboard.component';

describe('ManagerdashboardComponent', () => {
  let component: ManagerdashboardComponent;
  let fixture: ComponentFixture<ManagerdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerdashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
