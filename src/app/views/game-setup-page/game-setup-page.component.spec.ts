import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSetupPageComponent } from './game-setup-page.component';

describe('GameSetupPageComponent', () => {
  let component: GameSetupPageComponent;
  let fixture: ComponentFixture<GameSetupPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameSetupPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSetupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
