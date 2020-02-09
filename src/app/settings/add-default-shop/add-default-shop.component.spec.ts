import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDefaultShopComponent } from './add-default-shop.component';

describe('AddDefaultShopComponent', () => {
  let component: AddDefaultShopComponent;
  let fixture: ComponentFixture<AddDefaultShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDefaultShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDefaultShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
