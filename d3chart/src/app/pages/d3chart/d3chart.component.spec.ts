import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3chartComponent } from './d3chart.component';

describe('D3chartComponent', () => {
  let component: D3chartComponent;
  let fixture: ComponentFixture<D3chartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3chartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3chartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
