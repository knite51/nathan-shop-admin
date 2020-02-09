import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsDasboardComponent } from './settings-dasboard.component';

describe('SettingsDasboardComponent', () => {
  let component: SettingsDasboardComponent;
  let fixture: ComponentFixture<SettingsDasboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsDasboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDasboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
