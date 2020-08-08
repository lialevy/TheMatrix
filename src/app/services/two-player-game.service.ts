import { Injectable } from '@angular/core';
import { uniqueNamesGenerator } from 'unique-names-generator';
import { Matrix, TwoPlayerGame, TwoPlayerMatrix } from '../classes';

export interface PlayerGameService {
  createPlayers(): void;
  setNumberOfRounds(numberOfRounds: number): void;
  createGameMatrix(rows: number, columns: number, depth: number): Matrix;
  generateRandomMatrixValues(minValue?: number, maxValue?: number): Matrix;
  finalizeGameSetup(): void;
  validateGame(): [boolean, string[]];
  getGameMatrix(): Matrix;
}

@Injectable({
  providedIn: 'root'
})
export class TwoPlayerGameService implements PlayerGameService {
  player1PossibleStrategies = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  player2PossibleStrategies = 'abcdefghijklmnopqrstuvwxyz'.split('');

  constructor() {
    this.gameSubject = new TwoPlayerGame();
  }

  private gameSubject: TwoPlayerGame;

  /**
   * Creates players players
   */
  createPlayers(): void {
    this.gameSubject.createPlayers();
  }
  setNumberOfRounds(numberOfRounds: number): void {
    this.gameSubject.numberOfRounds = numberOfRounds;
  }

  createGameMatrix(rows: number, columns: number, _: number): TwoPlayerMatrix {
    const firstPlayerStrategies: string[] = [];
    const secondPlayerStrategies: string[] = [];
    const paymentsMatrix = {};

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      const strategyName = this.player1PossibleStrategies[rowIndex];
      firstPlayerStrategies.push(strategyName);
      paymentsMatrix[strategyName] = {};
    }

    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
      const strategyName = this.player2PossibleStrategies[columnIndex];
      secondPlayerStrategies.push(strategyName);

      for (const firstPlayerStrategy in paymentsMatrix) {
        if (Object.prototype.hasOwnProperty.call(paymentsMatrix, firstPlayerStrategy)) {
          paymentsMatrix[firstPlayerStrategy][strategyName] = [];
        }
      }
    }

    this.gameSubject.matrix = {
      playersStrategies: [firstPlayerStrategies, secondPlayerStrategies],
      paymentsMatrix
    };

    return this.gameSubject.matrix;
  }

  generateRandomMatrixValues(minValue: number = 0, maxValue: number = 10): TwoPlayerMatrix {
    for (const firstPlayerStrategy of this.gameSubject.matrix.playersStrategies[0]) {
      for (const secondPlayerStrategy of this.gameSubject.matrix.playersStrategies[1]) {
        const firstPlayerPayoff = Math.ceil(Math.random() * (maxValue - minValue) + minValue);
        const secondPlayerPayoff = Math.ceil(Math.random() * (maxValue - minValue) + minValue);
        this.gameSubject.matrix.paymentsMatrix[firstPlayerStrategy][secondPlayerStrategy] = [firstPlayerPayoff, secondPlayerPayoff];
      }
    }

    return this.gameSubject.matrix;
  }

  finalizeGameSetup(): void {
    if (this.gameSubject.players.length === 0) {
      this.createPlayers();
    }
  }

  validateGame(): [boolean, string[]] {
    const errors: string[] = [];

    if (this.gameSubject.players.length !== 2) {
      errors.push('No players in game');
    }

    if (!this.gameSubject.numberOfRounds) {
      errors.push('No rounds were set');
    }

    if (!this.gameSubject.matrix) {
      errors.push('No game matrix was set');
    } else {
      if (!this.gameSubject.matrix.playersStrategies ||
          !(this.gameSubject.matrix.playersStrategies.length !== this.gameSubject.players.length)) {
        errors.push('Number of player strategies do not match number of players in game');
      }

      if (!this.gameSubject.matrix.paymentsMatrix) {
        errors.push('Payments matrix is not defined');
      }
    }

    return [(errors.length > 0), errors];
  }

  getGameMatrix(): TwoPlayerMatrix {
    return this.gameSubject.matrix;
  }
}
