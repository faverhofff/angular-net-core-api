import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OuterToolbarComponent } from './outer-toolbar.component';

describe('OuterToolbarComponent', () => {
  let component: OuterToolbarComponent;
  let fixture: ComponentFixture<OuterToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OuterToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OuterToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
