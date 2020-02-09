import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDefaultShopComponent } from './list-default-shop.component';

describe('ListDefaultShopComponent', () => {
  let component: ListDefaultShopComponent;
  let fixture: ComponentFixture<ListDefaultShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDefaultShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDefaultShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
