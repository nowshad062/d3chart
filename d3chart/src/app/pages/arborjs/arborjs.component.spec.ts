import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArborjsComponent } from './arborjs.component';

describe('ArborjsComponent', () => {
  let component: ArborjsComponent;
  let fixture: ComponentFixture<ArborjsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArborjsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArborjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
