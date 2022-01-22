import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpanBoxComponent } from './span-box.component';

describe('SpanBoxComponent', () => {
  let component: SpanBoxComponent;
  let fixture: ComponentFixture<SpanBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpanBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpanBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
