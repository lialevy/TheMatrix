import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerScoresFooterComponent } from './player-scores-footer.component';

describe('PlayerScoresFooterComponent', () => {
  let component: PlayerScoresFooterComponent;
  let fixture: ComponentFixture<PlayerScoresFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerScoresFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerScoresFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
