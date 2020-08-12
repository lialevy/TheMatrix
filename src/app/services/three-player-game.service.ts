import { Injectable } from '@angular/core';
import { Matrix, TwoPlayerMatrix } from '../classes';
import { PlayerGameService } from './two-player-game.service';

@Injectable({
  providedIn: 'root'
})
export class ThreePlayerGameService { //implements PlayerGameService {

  constructor() { }
  createGameMatrix(rows: number, columns: number, depth: number): Matrix {
    throw new Error('Method not implemented.');
  }

  createPlayers(): void {
    throw new Error('Method not implemented.');
  }

  setNumberOfRounds(numberOfRounds: number): void {
    throw new Error('Method not implemented.');
  }

  generateRandomMatrixValues(minValue: number = 0, maxValue: number = 10): Matrix {
    throw new Error('Method not implemented.');
  }

  validateGame(): [boolean, string[]] {
    throw new Error('Method not implemented.');
  }

  getGameMatrix(): TwoPlayerMatrix {
    throw new Error('Method not implemented');
  }
}
