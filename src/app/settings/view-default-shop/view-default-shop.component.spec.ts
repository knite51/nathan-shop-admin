import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDefaultShopComponent } from './view-default-shop.component';

describe('ViewDefaultShopComponent', () => {
  let component: ViewDefaultShopComponent;
  let fixture: ComponentFixture<ViewDefaultShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDefaultShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDefaultShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
