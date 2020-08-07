import { TestBed } from '@angular/core/testing';

import { ThreePlayerGameService } from './three-player-game.service';

describe('ThreePlayerGameService', () => {
  let service: ThreePlayerGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreePlayerGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
