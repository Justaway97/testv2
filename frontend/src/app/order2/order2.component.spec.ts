import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Order2Component } from './order2.component';

describe('Order2Component', () => {
  let component: Order2Component;
  let fixture: ComponentFixture<Order2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Order2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Order2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
