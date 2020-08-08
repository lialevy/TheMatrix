import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Matrix } from '../classes';
import GameServiceInterface, { Results } from './game-service.interface';
import { ThreePlayerGameService } from './three-player-game.service';
import { PlayerGameService, TwoPlayerGameService } from './two-player-game.service';

@Injectable({
  providedIn: 'root'
})
export class GameService implements GameServiceInterface {
  private gameService: PlayerGameService;
  private numberOfPlayers: number;

  constructor(
    private twoPlayerGameService: TwoPlayerGameService,
    private threePlayerGameService: ThreePlayerGameService
  ) { }

  setNumberOfPlayers(numberOfPlayers: number): void {
    this.numberOfPlayers = numberOfPlayers;

    if (this.numberOfPlayers === 2) {
      this.gameService = this.twoPlayerGameService;
    } else if (this.numberOfPlayers === 3) {
      throw new Error('numberOfPlayers=3 not supported');
      // this.gameService = this.threePlayerGameService;
    } else {
      throw new Error('numberOfPlayers must be 2 or 3');
    }
  }

  setNumberOfRounds(numberOfRounds: number): void {
    this.gameService.setNumberOfRounds(numberOfRounds);
  }

  createGameMatrixByDimensions(rows: number, columns: number, depth?: number): Matrix {
    return this.gameService.createGameMatrix(rows, columns, depth);
  }

  generateRandomMatrixValues(): Matrix {
    return this.gameService.generateRandomMatrixValues();
  }

  setMatrixValues(matrix: Matrix): void {
    throw new Error('Not supporting manual matrix input');
  }

  /**
   * Validate game is ready and finalize game creation if required
   */
  finalizeGameSetup(): [boolean, string[]] {
    this.gameService.finalizeGameSetup();
    return this.gameService.validateGame();
  }

  getGameMatrix(): Matrix {
    return this.gameService.getGameMatrix();
  }

  getPlayerScoresObservable(): Observable<number[]> {
    throw new Error('Not Implemented');
  }

  getRoundNumberObservable(): Observable<number> {
    throw new Error('Not Implemented');
  }

  getPlayerStrategies(): string[][] {
    throw new Error('Not Implemented');
  }

  submitPlayerStrategy(player: string, strategy: number): void {
    throw new Error('Not Implemented');
  }

  getGameResults(): Results {
    throw new Error('Not Implemented');
  }
}
