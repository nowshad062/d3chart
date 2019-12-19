import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataprocessingComponent } from './dataprocessing.component';

describe('DataprocessingComponent', () => {
  let component: DataprocessingComponent;
  let fixture: ComponentFixture<DataprocessingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataprocessingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataprocessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
