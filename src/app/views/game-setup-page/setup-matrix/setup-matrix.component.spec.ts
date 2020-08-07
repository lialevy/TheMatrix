import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupMatrixComponent } from './setup-matrix.component';

describe('SetupMatrixComponent', () => {
  let component: SetupMatrixComponent;
  let fixture: ComponentFixture<SetupMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
