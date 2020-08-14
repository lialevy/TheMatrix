import { BehaviorSubject, Observable } from 'rxjs';
import { Matrix } from '.';
import { Results, Strategy } from '../services/game-service.interface';
import Player from './Player.class';
import Round from './Round.class';

export default abstract class Game {
  #playerScoresSubject: BehaviorSubject<number[]> = new BehaviorSubject([]);
  #roundSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  #gameFinishedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  #currentPlayerStrategies: Strategy[];

  protected player1PossibleStrategies = 'ABCDEFGHIJKLM'.split('');
  protected player2PossibleStrategies = 'abcdefghijklm'.split('');

  playerScores$: Observable<number[]> = this.#playerScoresSubject.asObservable();
  currentRound$: Observable<number> = this.#roundSubject.asObservable();
  gameFinished$: Observable<boolean> = this.#gameFinishedSubject.asObservable();

  abstract matrix: Matrix;
  players: Player[];
  numberOfRounds: number;
  rounds: Round[];

  constructor() {

  }

  createPlayers(numberOfPlayers): void {
    this.players = [];

    for (let playerIndex = 0; playerIndex < numberOfPlayers; playerIndex++) {
      this.players.push(new Player(playerIndex as 0 | 1 | 2));
    }

    this.#playerScoresSubject.next(this.players.map(p => p.cookies));
  }

  setNumberOfRounds(numberOfRounds: number): void {
    this.numberOfRounds = numberOfRounds;
    this.#roundSubject.next(1);
  }

  abstract createGameMatrix(rows: number, columns: number, depth: number): Matrix;
  abstract generateRandomMatrixValues(minValue?: number, maxValue?: number): Matrix;
  abstract finalizeGameSetup(): void;

  validateGame(): [boolean, string[]] {
    const errors: string[] = [];

    if (!this.numberOfRounds) {
      errors.push('No rounds were set');
    }

    if (!this.matrix) {
      errors.push('No game matrix was set');
    } else {
      if (!this.matrix.playersStrategies ||
          !(this.matrix.playersStrategies.length !== this.players.length)) {
        errors.push('Number of player strategies do not match number of players in game');
      }

      if (!this.matrix.paymentsMatrix) {
        errors.push('Payments matrix is not defined');
      }
    }

    return [(errors.length > 0), errors];
  }

  submitPlayerStrategy(playerIndex: number, strategy: string): void {
    this.#currentPlayerStrategies[playerIndex] = {
      player: this.players[playerIndex],
      strategy
    };
  }

  finishRound(roundResult: number[]): void {
    const round = new Round(this.#currentPlayerStrategies, roundResult);
    this.rounds.push(round);

    this.players.forEach((player, index) => (player.cookies += roundResult[index]));

    this.#currentPlayerStrategies.fill(undefined);
    this.#playerScoresSubject.next(this.players.map(p => p.cookies));

    if (this.#roundSubject.value < this.numberOfRounds) {
      this.#roundSubject.next(this.#roundSubject.value + 1);
    } else {
      this.#gameFinishedSubject.next(true);
    }
  }

  abstract getGameResults(): Results;
}
