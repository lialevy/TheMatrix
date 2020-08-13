import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Matrix, Player } from '../classes';
import GameServiceInterface, { Results } from './game-service.interface';
import { ThreePlayerGameService } from './three-player-game.service';
import { PlayerGameService, TwoPlayerGameService } from './two-player-game.service';

@Injectable({
  providedIn: 'root'
})
export class GameService implements GameServiceInterface {
  private gameService: PlayerGameService;
  private numberOfPlayers: number;

  public gameFinished$: Observable<boolean>;

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

    this.gameFinished$ = this.gameService.gameFinished$;
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

  getPlayers(): Player[] {
    return this.gameService.getPlayers();
  }

  getGameMatrix(): Matrix {
    return this.gameService.getGameMatrix();
  }

  getPlayerScoresObservable(): Observable<number[]> {
    return this.gameService.playerScores$;
  }

  getRoundNumberObservable(): Observable<number> {
    return this.gameService.currentRound$;
  }

  getPlayerStrategies(): string[][] {
    return this.gameService.getPlayerStrategies();
  }

  submitPlayerStrategy(player: number, strategy: string): void {
    this.gameService.submitPlayerStrategy(player, strategy);
  }

  getGameResults(): Results {
    return this.gameService.getGameResults();
  }
}
