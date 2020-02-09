import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignViewAdminComponent } from './assign-view-admin.component';

describe('AssignViewAdminComponent', () => {
  let component: AssignViewAdminComponent;
  let fixture: ComponentFixture<AssignViewAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignViewAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignViewAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
