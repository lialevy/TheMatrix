import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import GameServiceInterface, { Game, Matrix, Results } from './game-service.interface';
import TwoPlayerGame from '../classes/TwoPlayerGame.class';

@Injectable({
  providedIn: 'root'
})
export class TwoPlayerGameService {

  constructor() {
    this.gameSubject = new TwoPlayerGame();
  }

  private gameSubject: TwoPlayerGame;
  public game: Game;

  /**
   * Sets the game number of players
   * @param numberOfPlayers number of players the game has
   */
  createPlayers(): void {
    this.gameSubject.createPlayers();
  }
  setNumberOfRounds(numberOfRounds: number): void {
    this.gameSubject.numberOfRounds = numberOfRounds;
  }
  createGameMatrixByDimensions(rows: number, columns: number, depth?: number): Matrix {
    throw new Error('Method not implemented.');
  }
  generateRandomMatrixValues(): Matrix {
    throw new Error('Method not implemented.');
  }
  setMatrixValues(matrix: Matrix): void {
    throw new Error('Method not implemented.');
  }
  finalizeGameSetup(): [boolean, string] {
    throw new Error('Method not implemented.');
  }
  getGameMatrix(): Matrix {
    throw new Error('Method not implemented.');
  }
  getPlayerScoresObservable(): Observable<number[]> {
    throw new Error('Method not implemented.');
  }
  getRoundNumberObservable(): Observable<number> {
    throw new Error('Method not implemented.');
  }
  getPlayerStrategies(): string[][] {
    throw new Error('Method not implemented.');
  }
  submitPlayerStrategy(player: string, strategy: number): void {
    throw new Error('Method not implemented.');
  }
  getGameResults(): Results {
    throw new Error('Method not implemented.');
  }
}
