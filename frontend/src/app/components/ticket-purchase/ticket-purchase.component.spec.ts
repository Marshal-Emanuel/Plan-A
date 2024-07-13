import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPurchaseComponent } from './ticket-purchase.component';

describe('TicketPurchaseComponent', () => {
  let component: TicketPurchaseComponent;
  let fixture: ComponentFixture<TicketPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketPurchaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
