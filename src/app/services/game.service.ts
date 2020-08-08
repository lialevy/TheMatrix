import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import GameServiceInterface, { Matrix, Results } from './game-service.interface';

@Injectable({
  providedIn: 'root'
})
export class GameService implements GameServiceInterface {

  constructor() { }

  setNumberOfPlayers(numberOfPlayers: number): void {
    throw new Error('Not Implemented');
  }

  // TODO
  setNumberOfRounds(numberOfRounds: number): void {
    throw new Error('Not Implemented');
  }

  // TODO
  createGameMatrixByDimensions(rows: number, columns: number, depth?: number): Matrix {
    throw new Error('Not Implemented');
  }

  // TODO
  generateRandomMatrixValues(): Matrix {
    throw new Error('Not Implemented');
  }

  setMatrixValues(matrix: Matrix): void {
    throw new Error('Not Implemented');
  }

  finalizeGameSetup(): [boolean, string] {
    throw new Error('Not Implemented');
  }

  getGameMatrix(): Matrix {
    throw new Error('Not Implemented');
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
