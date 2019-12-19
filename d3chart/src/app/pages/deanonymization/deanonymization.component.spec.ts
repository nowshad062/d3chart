import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeanonymizationComponent } from './deanonymization.component';

describe('DeanonymizationComponent', () => {
  let component: DeanonymizationComponent;
  let fixture: ComponentFixture<DeanonymizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeanonymizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeanonymizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
