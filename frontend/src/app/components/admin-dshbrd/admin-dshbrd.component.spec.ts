import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDshbrdComponent } from './admin-dshbrd.component';

describe('AdminDshbrdComponent', () => {
  let component: AdminDshbrdComponent;
  let fixture: ComponentFixture<AdminDshbrdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDshbrdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDshbrdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
