import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CytoscapejsComponent } from './cytoscapejs.component';

describe('CytoscapejsComponent', () => {
  let component: CytoscapejsComponent;
  let fixture: ComponentFixture<CytoscapejsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CytoscapejsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CytoscapejsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
