import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletDetailComponent } from './outlet-detail.component';

describe('OutletDetailComponent', () => {
  let component: OutletDetailComponent;
  let fixture: ComponentFixture<OutletDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutletDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
