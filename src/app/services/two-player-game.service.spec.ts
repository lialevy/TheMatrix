import { TestBed } from '@angular/core/testing';

import { TwoPlayerGameService } from './two-player-game.service';

describe('TwoPlayerGameService', () => {
  let service: TwoPlayerGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TwoPlayerGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
