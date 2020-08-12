import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Matrix, Round, TwoPlayerGame, TwoPlayerMatrix } from '../classes';
import { Strategy } from './game-service.interface';

export interface PlayerGameService {
  playerScores$: Observable<number[]>;
  currentRound$: Observable<number>;

  createPlayers(): void;
  setNumberOfRounds(numberOfRounds: number): void;
  createGameMatrix(rows: number, columns: number, depth: number): Matrix;
  generateRandomMatrixValues(minValue?: number, maxValue?: number): Matrix;
  finalizeGameSetup(): void;
  validateGame(): [boolean, string[]];
  getGameMatrix(): Matrix;
  getPlayerStrategies(): string[][];
  submitPlayerStrategy(player: string, strategy: string): void;
}

@Injectable({
  providedIn: 'root'
})
export class TwoPlayerGameService implements PlayerGameService {
  private player1PossibleStrategies = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  private player2PossibleStrategies = 'abcdefghijklmnopqrstuvwxyz'.split('');
  private gameSubject: TwoPlayerGame;
  private playerScoresSubject: BehaviorSubject<number[]> = new BehaviorSubject([]);
  private roundSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  private currentPlayerStrategies: [Strategy, Strategy] = [undefined, undefined];

  public playerScores$: Observable<number[]> = this.playerScoresSubject.asObservable();
  public currentRound$: Observable<number>;

  constructor() {
    this.gameSubject = new TwoPlayerGame();
  }

  /**
   * Creates players players
   */
  createPlayers(): void {
    this.gameSubject.createPlayers();

    this.playerScoresSubject.next(this.gameSubject.players.map(p => p.cookies));
  }
  setNumberOfRounds(numberOfRounds: number): void {
    this.gameSubject.numberOfRounds = numberOfRounds;
    this.roundSubject.next(1);
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

  getPlayerStrategies(): string[][] {
    return this.gameSubject.matrix.playersStrategies;
  }

  submitPlayerStrategy(player: string, strategy: string): void {
    const playerIndex = this.gameSubject.players.findIndex(p => p.id === player);

    this.currentPlayerStrategies[playerIndex] = {
      player: this.gameSubject.players[playerIndex],
      strategy
    };

    // Finish round
    if (this.currentPlayerStrategies[0] !== undefined && this.currentPlayerStrategies[1] !== undefined) {
      const [s1, s2] = this.currentPlayerStrategies;
      const roundResult = this.gameSubject.matrix.paymentsMatrix[s1.strategy][s2.strategy];

      const round = new Round(this.currentPlayerStrategies, roundResult);

      this.gameSubject.players[0].cookies += roundResult[0];
      this.gameSubject.players[1].cookies += roundResult[1];

      this.currentPlayerStrategies = [undefined, undefined];
      this.roundSubject.next(this.roundSubject.value + 1);
      this.playerScoresSubject.next([this.gameSubject.players[0].cookies, this.gameSubject.players[1].cookies]);
    }
  }
}
