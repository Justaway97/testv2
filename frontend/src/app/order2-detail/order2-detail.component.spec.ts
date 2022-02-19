import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Order2DetailComponent } from './order2-detail.component';

describe('Order2DetailComponent', () => {
  let component: Order2DetailComponent;
  let fixture: ComponentFixture<Order2DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Order2DetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Order2DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
