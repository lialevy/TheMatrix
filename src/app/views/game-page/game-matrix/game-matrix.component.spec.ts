import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameMatrixComponent } from './game-matrix.component';

describe('GameMatrixComponent', () => {
  let component: GameMatrixComponent;
  let fixture: ComponentFixture<GameMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
