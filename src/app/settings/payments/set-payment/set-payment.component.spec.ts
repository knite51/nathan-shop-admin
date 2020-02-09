import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPaymentComponent } from './set-payment.component';

describe('SetPaymentComponent', () => {
  let component: SetPaymentComponent;
  let fixture: ComponentFixture<SetPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
