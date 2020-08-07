import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import GameService, { Game, Matrix, Results } from './game-service.interface';

@Injectable({
  providedIn: 'root'
})
export class TwoPlayerGameService implements GameService {

  constructor() { }
  
  game: Game;
  
  setNumberOfPlayers(numberOfPlayers: number): void {
    throw new Error('Method not implemented.');
  }
  setNumberOfRounds(numberOfRounds: number): void {
    throw new Error('Method not implemented.');
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
