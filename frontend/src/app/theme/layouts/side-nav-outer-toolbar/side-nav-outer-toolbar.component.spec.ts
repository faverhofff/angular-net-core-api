import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavOuterToolbarComponent } from './side-nav-outer-toolbar.component';

describe('SideNavOuterToolbarComponent', () => {
  let component: SideNavOuterToolbarComponent;
  let fixture: ComponentFixture<SideNavOuterToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideNavOuterToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavOuterToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
